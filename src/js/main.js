function $(selector) {return document.querySelector(selector)}
function $$(selector) {return document.querySelectorAll(selector)}

document.addEventListener("DOMContentLoaded", () => {
    $("#editProcessBtn").addEventListener("click", () => {
        $("#mainScreen").classList.toggle("hidden");
        $("#pcbScreen").classList.toggle("hidden");
    })
    $("#showResultBtn").addEventListener("click", () => {
        $("#windowScreen").classList.toggle("hidden");
        $("#resultScreen").classList.toggle("hidden");
    })
    $("#showSimBtn").addEventListener("click", () => {
        $("#windowScreen").classList.toggle("hidden");
        $("#simulatorScreen").classList.toggle("hidden");
    })
    $("#returnMainBtn").addEventListener("click", () => {
        $("#pcbScreen").classList.toggle("hidden");
        $("#mainScreen").classList.toggle("hidden");
    })
})