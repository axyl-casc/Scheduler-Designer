function $(selector) {return document.querySelector(selector)}
function $$(selector) {return document.querySelectorAll(selector)}

document.addEventListener("DOMContentLoaded", () => {
    $("#editProcessBtn").addEventListener("click", () => {
        $("#mainScreen").classList.toggle("hidden");
        $("#pcbScreen").classList.toggle("hidden");
    })
    $("#showResultBtn").addEventListener("click", () => {
        if($("#resultScreen").classList.contains("hidden")) {
            $("#resultScreen").classList.toggle("hidden");
            $("#simulatorScreen").classList.toggle("hidden");
        }
        
    })
    $("#showSimBtn").addEventListener("click", () => {
        if($("#simulatorScreen").classList.contains("hidden")) {
            $("#simulatorScreen").classList.toggle("hidden");
            $("#resultScreen").classList.toggle("hidden");
        }
        
    })
    $("#returnMainBtn").addEventListener("click", () => {
        $("#pcbScreen").classList.toggle("hidden");
        $("#mainScreen").classList.toggle("hidden");
    })
})