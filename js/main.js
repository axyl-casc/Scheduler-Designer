function $(selector) {return document.querySelector(selector)}
function $$(selector) {return document.querySelectorAll(selector)}
const simulation = new Simulator();
simulation.setSpeed(0.5); // set a default speed

const storage_key = "processes"; //the key for locally stored processes


//Delete the comments if you're okay with how I changed it
function run_simulator(process_list){
    //let process_list = [];
    //process_list.push(new Process(0, "systemd",  "New", 0, true, 0.1, 20));
    //process_list.push(new Process(1, "kevin",  "New", 1, true, 0.75, 2));
    //process_list.push(new Process(2, "test1",  "New", 2, true, 0.6, 5));
    //process_list.push(new Process(3, "test2",  "New", 3, true, 0.5, 10));
    let scheduling_algorithm = $("#scheduler").value;
    simulation.initialize(process_list, scheduling_algorithm);
    simulation.run();
}

function updateSliderValue(value) {
    document.querySelector('#slider-value').textContent = value;
    simulation.setSpeed(value);
  }
  

document.addEventListener("DOMContentLoaded", () => {
    let process_list = [];
    if(!(localStorage.getItem(storage_key))) {
        //The 4 pushes below are test values - delete locally stored array "processes" to make them added.
        process_list.push(new Process(0, "systemd",  "New", 0, true, 0.1, 20));
        process_list.push(new Process(1, "kevin",  "New", 1, true, 0.75, 2));
        process_list.push(new Process(2, "test1",  "New", 2, true, 0.6, 5));
        process_list.push(new Process(3, "test2",  "New", 3, true, 0.5, 10));
        
        localStorage.setItem(storage_key, JSON.stringify(process_list));
    } else {
        process_list = JSON.parse(localStorage.getItem(storage_key));
    }
    popProcessList("processList");
    console.dir(process_list)

    $("#editProcessBtn").addEventListener("click", () => {
        $("#mainScreen").classList.toggle("hidden");
        $("#pcbScreen").classList.toggle("hidden");
        popProcessList("editProcessList");
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
        run_simulator(process_list);
    })
    $("#slider").addEventListener("change", () => {
        updateSliderValue($("#slider").value);
    })
    $("#returnMainBtn").addEventListener("click", () => {
        $("#pcbScreen").classList.toggle("hidden");
        $("#mainScreen").classList.toggle("hidden");
        popProcessList("processList");
    })
    $("#clearProcessBtn").addEventListener("click", () => {
        clearProcessList();
        popProcessList("editProcessList");
    })

    
})

/*
*   popProcessList - Populates the list of processes based on locally stored data
*
*   list_id        - the id of the html ul element to populate.
*
*   Details: No changes to the actual data is made, only changes the websites html
*
*/
function popProcessList(list_id) {
    const list = $(`#${list_id}`);
    list.innerHTML = '';
    if(localStorage.getItem(storage_key)) {
        let process_list = JSON.parse(localStorage.getItem(storage_key));
        process_list.forEach((process) => {
            let name = document.createElement("li");
            name.className = "bg-white p-2 rounded shadow";
            name.textContent = process.name;
            list.appendChild(name);
            let id = document.createElement("strong");
            id.className = "ml-4";
            id.textContent = "P" + process.id;
            name.appendChild(id);
        })
    }

}

/*
*   clearProcessList - Deletes all locally stored process data
*
*/
function clearProcessList() {
    if(localStorage.getItem(storage_key)) {
        let process_list = [];
        localStorage.setItem(storage_key, JSON.stringify(process_list));
    }

}
