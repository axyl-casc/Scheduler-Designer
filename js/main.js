function $(selector) {return document.querySelector(selector)}
function $$(selector) {return document.querySelectorAll(selector)}

const simulation = new Simulator();
function run_simulator(){
    
    simulation.setSpeed(0.5);
    let process_list = [];
    process_list.push(new Process(0, "systemd",  "New", 0, true, 0.1, 20));
    process_list.push(new Process(1, "kevin",  "New", 1, true, 0.75, 2));
    process_list.push(new Process(2, "test1",  "New", 2, true, 0.6, 5));
    process_list.push(new Process(3, "test2",  "New", 3, true, 0.5, 10));
    let scheduling_algorithm = $("#scheduler").value;
    simulation.initialize(process_list, scheduling_algorithm);
    simulation.run();
}


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
        run_simulator();
        
    })
    $("#returnMainBtn").addEventListener("click", () => {
        $("#pcbScreen").classList.toggle("hidden");
        $("#mainScreen").classList.toggle("hidden");
    })
})