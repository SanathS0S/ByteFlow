let socketio = io();
const messages = document.getElementById("messages");
const now = new Date();
const timestamp = `${now.getHours()}:${
  (now.getMinutes() < 10 ? "0" : "") + now.getMinutes()
}`;

const createMessage = (name, msg) => {
  const content = `
            <div class="text">
                <span>
                    <strong>${name}</strong>: ${msg}
                    <span class="timestamp">${timestamp}</span>
                    </span>
            </div>
        `;
  messages.innerHTML += content;
};

socketio.on("message", (data) => {
  createMessage(data.name, data.message);
});
const sendMessage = () => {
  const message = document.getElementById("message");
  const fileInput = document.getElementById("option1");

  const imageInput = document.getElementById("option3");
  const filesharebox = document.getElementById("fileshare-box");
  const imgsharebox = document.getElementById("imgshare-box");
  const audsharebox = document.getElementById("liveaud-box");

  if (filesharebox.style.display !== "none") {
    let file = fileInput.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
      let fileContent = e.target.result;
      socketio.emit("file_shared", {
        filename: file.name,
        file_content: fileContent,
        filetype: file.type,
      });
    };
    reader.readAsDataURL(file);
    filesharebox.innerHTML = "";
    filesharebox.style.display = "none";
  }
  if (audsharebox.style.display !== "none") {
    let reader = new FileReader();
    reader.onload = function (e) {
      let fileContent = e.target.result;
      socketio.emit("audio_shared", {
        filename: audioFile.name,
        file_content: fileContent,
        filetype: audioFile.type,
      });
    };
    reader.readAsDataURL(audioFile);
    audsharebox.innerHTML = "";
    audsharebox.style.display = "none";
  }
  if (imgsharebox.style.display !== "none") {
    /* window.onload=function() { 
                document.getElementById("imgform").submit(); // using ID 
            } */
    event.preventDefault();
    let file = imageInput.files[0];
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      socketio.emit("message", { data: "" });
      socketio.emit("image_shared", reader.result);
    });
    reader.readAsDataURL(file);
    imgsharebox.innerHTML = "";
    imgsharebox.style.display = "none";
  }
};

socketio.on("file_received", function (data) {
  console.log("File:", data.filename);
  let fileInfoDiv = document.createElement("div");
  let fileListDiv = document.getElementById("messages");
  fileInfoDiv.innerHTML = `
            <div class="file">
                <span>
                    <span class="timestamp">${timestamp}</span>
                </span>
            </div>
            <p class="file-para"><strong>${data.name}</strong>: ${data.filename}</p>
            <button class="button-download" onclick="downloadFile('${data.filename}', '${data.file_content}')">Download</button>
        `;
  let filetype = String(data.filename);
  console.log(filetype);
  fileListDiv.appendChild(fileInfoDiv);
  if (
    filetype.includes("mp4") ||
    (filetype.includes("video") && filetype !== undefined)
  ) {
    let vidDiv = document.createElement("div");
    vidDiv.innerHTML = `
                <video width ="320" height="240" controls>
                    <source src = ${data.file_content} type = video/mp4>
                </video>
            `;
    fileListDiv.appendChild(vidDiv);
  }

  if (
    filetype.includes("wav") ||
    filetype.includes("audio") ||
    (filetype.includes("mp3") && filetype !== undefined)
  ) {
    let audDiv = document.createElement("div");
    audDiv.innerHTML = `
                <audio controls>
                    <source src = ${data.file_content} type = audio/mpeg>
                </audio>
                    
                
            `;
    fileListDiv.appendChild(audDiv);
  }
});
socketio.on("audio_received", function (data) {
  console.log("File:", data.filename);
  let fileInfoDiv = document.createElement("div");
  let fileListDiv = document.getElementById("messages");
  fileInfoDiv.innerHTML = `
            <div class="file">
                <span>
                    <span class="timestamp">${timestamp}</span>
                </span>
            </div>
            <p class="file-para"><strong>${data.name}</strong>: ${data.filename}</p>
            <button class="button-download" onclick="downloadFile('${data.filename}', '${data.file_content}')">Download</button>
        `;
  let filetype = String(data.filename);
  console.log(filetype);
  fileListDiv.appendChild(fileInfoDiv);
  if (
    filetype.includes("wav") ||
    filetype.includes("audio") ||
    (filetype.includes("mp3") && filetype !== undefined)
  ) {
    let audDiv = document.createElement("div");
    audDiv.innerHTML = `
                <audio controls>
                    <source src = ${data.file_content} type = audio/mpeg>
                </audio>
                    
                
            `;
    fileListDiv.appendChild(audDiv);
  }
});

function downloadFile(filename, fileContent) {
  const linkSource = `${fileContent}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = filename;
  downloadLink.click();
}
let imgform = document.getElementById("imgform");

function handleKeyPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const message = document.getElementById("message");
    if (message.value === "") return;
    socketio.emit("message", { data: message.value });
    message.value = "";
  }
}

socketio.on("image_received", (image_data) => {
  let imgInfoDiv = document.createElement("div");
  let img = document.createElement("img");
  img.src = image_data;
  img.width = 300;
  img.height = 200;
  imgInfoDiv.appendChild(img);
  let imgListDiv = document.getElementById("messages");
  imgListDiv.appendChild(imgInfoDiv);
});

const openPopupButton = document.getElementById("open-popup");
const dialogueBox = document.getElementById("dialogue-box");
const filebox = document.getElementById("option1");
const audbox = document.getElementById("option2");
const imageInput = document.getElementById("option3");
const filepopup = document.getElementById("fileshare-box");
const imgpopup = document.getElementById("imgshare-box");
const audpopup = document.getElementById("liveaud-box");

let decision = 0;
openPopupButton.addEventListener("click", function () {
  dialogueBox.style.display = "block";
});

filebox.addEventListener("click", function () {
  dialogueBox.style.display = "none";
  imgpopup.style.display = "none";
  audpopup.style.display = "none";
  filepopup.style.display = "block";
});

audbox.addEventListener("click", function () {
  dialogueBox.style.display = "none";
  imgpopup.style.display = "none";
  filepopup.style.display = "none";
  audpopup.style.display = "flex";
});

imageInput.addEventListener("click", function () {
  //alert('Option 3 was clicked.');
  //shareImageDisplay();
  dialogueBox.style.display = "none";
  filepopup.style.display = "none";
  audpopup.style.display = "none";
  imgpopup.style.display = "block";
});
document.addEventListener("click", function (event) {
  if (event.target !== openPopupButton && !dialogueBox.contains(event.target)) {
    dialogueBox.style.display = "none";
  }
});
//this is the function that handles the popup for sharing files
function shareFileDisplay() {
  if (filebox.style.display != "none") {
    let file = filebox.files[0];
    let filesize = (file.size / 1048576).toFixed(3);
    filepopup.innerHTML =
      "<p>File Name: " +
      file.name +
      "</p>" +
      "<p>File Size: " +
      filesize +
      " Mb</p>" +
      "<p>File Type: " +
      file.type +
      "</p>" +
      "<p>Press Send to continue...</p>";
  }
}

function shareImageDisplay() {
  {
    if (imageInput.style.display != "none") {
      let file = imageInput.files[0];
      let filesize = (file.size / 1048576).toFixed(3);
      imgpopup.innerHTML =
        "<p>Image Name: " +
        file.name +
        "</p>" +
        "<p>Image Size: " +
        filesize +
        " Mb</p>" +
        "<p>Image Type: " +
        file.type +
        "</p>" +
        "<p>Press Send to continue...</p>";
    }
  }
}
let audioChunks = [];
let audioFile;
function shareAudDisplay() {
  if (audbox.style.display != "none") {
    audpopup.innerHTML = `
            <button id="startRecording">Start Recording</button>
            <button id="stopRecording" style="display: none;">Stop Recording</button>
        `;
    const startRecordingButton = document.getElementById("startRecording");
    const stopRecordingButton = document.getElementById("stopRecording");
    let mediaRecorder;

    // Start recording audio
    startRecordingButton.addEventListener("click", () => {
      startRecordingButton.style.display = "none";
      stopRecordingButton.style.display = "block";
      audioChunks = [];

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.push(event.data);
            }
          };
          mediaRecorder.start();
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    });

    // Stop recording audio and create a File object
    stopRecordingButton.addEventListener("click", () => {
      stopRecordingButton.style.display = "none";
      startRecordingButton.style.display = "block";

      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioFile = new File([audioBlob], "recorded_audio.wav", {
          type: "audio/wav",
        });

        const fileSize = (audioFile.size / 1048576).toFixed(3);

        audpopup.innerHTML =
          "<p>Audio Name: " +
          audioFile.name +
          "</p>" +
          "<p>Audio Size: " +
          fileSize +
          " Mb</p>" +
          "<p>Audio Type: " +
          audioFile.type +
          "</p>" +
          "<p>Press Send to continue...</p>";
        // Now you can use the audioFile object as needed (e.g., sending it to a server).
      };
    });
  }
}
