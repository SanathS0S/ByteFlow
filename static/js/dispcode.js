function copytoClipboard(finword)
{
    const textarea = document.createElement("textarea");
    textarea.value = finword;

    // Make the textarea non-visible
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";

    // Append the textarea to the document
    document.body.appendChild(textarea);

    // Select and copy the text from the textarea
    textarea.select();
    document.execCommand("copy");

    // Remove the textarea
    document.body.removeChild(textarea);
}
function copycode()
{
    const code = document.getElementById('codename');
    const inputString = code.innerText;
    const words = inputString.split(" ");
    const finword = words[3];
    copytoClipboard(finword);

}
const copyButton = document.getElementById("copyButton");
const codedisplay = document.getElementById("show-code");
copyButton.addEventListener("click",()=>
{
    codedisplay.classList.remove("hidden");
    setTimeout(()=>{
        codedisplay.classList.add("hidden");
    },3000);
}
)