function $(selector) {return document.querySelector(selector)}
function $$(selector) {return document.querySelectorAll(selector)}

document.addEventListener("DOMContentLoaded", () => {

    const simulation = new Simulator();
    simulation.setSpeed(0.5);
    let process_list = [];
    process_list.push(new Process(0, "systemd",  "New", 0, true, 0.1, 20));
    process_list.push(new Process(1, "kevin",  "New", 0, true, 0.75, 2));
    process_list.push(new Process(2, "test1",  "New", 0, true, 0.6, 5));
    process_list.push(new Process(3, "test2",  "New", 0, true, 0.5, 10));
    let scheduling_algorithm = "FIFO";
    let sim_div = $("#simulatorScreen");
    simulation.initialize(process_list, scheduling_algorithm, sim_div);
    simulation.run();

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