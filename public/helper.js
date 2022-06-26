// window.onload = function(){
//     document.getElementById('send').onclick = function() {
//         alert("Click Event Fired !")
//     }
// }

$("#send").click(sendButtonClickListener);

function sendButtonClickListener (e) {
    // e.preventDefault();
    console.log(e);
}