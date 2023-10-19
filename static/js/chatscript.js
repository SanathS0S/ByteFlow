// JavaScript to handle the pop-up dialogue box with three buttons

const openPopupButton = document.getElementById('open-popup');
const dialogueBox = document.getElementById('dialogue-box');
const filebox = document.getElementById('option1');
const option2Button = document.getElementById('option2');
const option3Button = document.getElementById('option3');
const filepopup = document.getElementById('fileshare-box');


let decision = 0;
openPopupButton.addEventListener('click', function () {
    dialogueBox.style.display = 'block';
    
});

filebox.addEventListener('click', function () {
    dialogueBox.style.display = 'none';
    filepopup.style.display = 'block';
    
    
});

option2Button.addEventListener('click', function () {
    alert('Option 2 was clicked.');
    dialogueBox.style.display = 'none';
});

option3Button.addEventListener('click', function () {
    alert('Option 3 was clicked.');
    
    dialogueBox.style.display = 'none';
});
document.addEventListener('click', function (event) {
    if (event.target !== openPopupButton && !dialogueBox.contains(event.target)) {
        dialogueBox.style.display = 'none';
    }
    
});
//this is the function that handles the popup for sharing files
function shareFileDisplay()
{
   if(filebox.style.display!='none')
   {
        let file = filebox.files[0];
        let filesize = (file.size/1048576).toFixed(3);
        filepopup.innerHTML="<p>File Name: " + file.name + "</p>"
        +"<p>File Size: " + filesize+ " Mb</p>"
        +"<p>File Type: " + file.type + "</p>"
        +"<p>Press Send to continue...</p>";
   }
}
