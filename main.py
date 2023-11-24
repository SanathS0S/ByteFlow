from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import join_room, leave_room, send, SocketIO, emit
import random
from string import ascii_uppercase, digits

app = Flask(__name__)
app.config["SECRET_KEY"] = "CNPROJECT"
rooms = {}

socketio = SocketIO(app, cors_allowed_origins="*", max_http_buffer_size=100000000)


def generate():
    letters = ascii_uppercase + digits
    room_code = ''.join(random.choice(letters) for _ in range(6))
    return room_code


@app.route("/", methods=["POST", "GET"])
def home():
    session.clear()
    if request.method == "POST":
        name = request.form.get("name")
        code = request.form.get("id")
        action = request.form.get("action")

        if not name and action == "join":
            return render_template("home.html", error="Please enter a name", code=code, name=name)
        if action == "join" and not code:
            return render_template("home.html", error="Please enter a room code", code=code, name=name)

        room = code
        if action == "create":
            room = generate()
            rooms[room] = {"members": 0, "messages": []}
            return render_template("home.html", room_code=room)
        elif code not in rooms:
            return render_template("home.html", error="Room does not exist", code=code, name=name)

        session["room"] = room
        session["name"] = name
        return redirect(url_for("room"))

    return render_template("home.html")


@app.route("/room")
def room():
    room = session.get("room")
    if room is None or session.get("name") is None or room not in rooms:
        return redirect(url_for("home"))
    return render_template("room.html", code=room)


@socketio.on("message")
def message(data):
    room = session.get("room")
    if room not in rooms:
        return
    content = {
        "name": session.get("name"),
        "message": data["data"]
    }
    send(content, to=room)
    rooms[room]["messages"].append(content)


@socketio.on('file_shared')
def handle_file_shared(data):
    filename = data['filename']
    file_content = data['file_content']
    filetype = data['filetype']
    name = session.get("name")
    # Broadcast the file to all connected clients, including the sender
    emit('file_received', {'filename': filename, 'file_content': file_content,'name':name,filetype:filetype}, broadcast=True)

@socketio.on('audio_shared')
def handle_file_shared(data):
    filename = data['filename']
    file_content = data['file_content']
    filetype = data['filetype']
    name = session.get("name")
    # Broadcast the file to all connected clients, including the sender
    emit('audio_received', {'filename': filename, 'file_content': file_content,'name':name,filetype:filetype}, broadcast=True)
@socketio.on('image_shared')
def handle_image(img_data):
    name = session.get("name")
    # Broadcast the image to all connected clients, including the sender
    emit('image_received',img_data, broadcast=True)


@socketio.on("connect")
def connect(auth):
    room = session.get("room")
    name = session.get("name")
    if not room or not name:
        return
    if room not in rooms:
        leave_room(room)
        return
    join_room(room)
    send({"name": name, "message": "has entered the room"}, to=room)
    rooms[room]["members"] += 1


@socketio.on("disconnect")
def disconnect():
    room = session.get("room")
    name = session.get("name")
    leave_room(room)

    if room in rooms:
        rooms[room]["members"] -= 1
        if rooms[room]["members"] <= 0:
            del rooms[room]
    send({"name": name, "message": "has left the room"}, to=room)


if __name__ == "__main__":
    socketio.run(app,debug=True)
