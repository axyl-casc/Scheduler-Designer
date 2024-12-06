
document.addEventListener("DOMContentLoaded", () => {
    $("#createProcessBtn").addEventListener("click", () => {
        createProcess();
    })
    $("#scheduler").addEventListener("change", () => {
        simulation.setScheduler($("#scheduler").value);
    })
    $("#presetData").addEventListener("change", () => {
        // set the process table based on the input
        const setSelection = $("#presetData").value;
        const process_list = []
        console.log(`Set new process ${setSelection}`);
        if(setSelection == "ap"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 0.1, 10, 0));
            process_list.push(new Process(1, "kevin",  "None", 1, true, 0.75, 2, 7));
            process_list.push(new Process(2, "test1",  "None", 2, true, 0.6, 5, 2));
            process_list.push(new Process(3, "test2",  "None", 3, true, 0.5, 10, 0));
        }else if(setSelection == "sp"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 0.9, 10, 0));
        }else if(setSelection == "da"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 0.5, 5, 0));
            process_list.push(new Process(1, "Process 1",  "None", 1, true, 0.5, 5, 3));
            process_list.push(new Process(2, "Process 2",  "None", 2, true, 0.5, 5, 6));
            process_list.push(new Process(3, "Process 3",  "None", 3, true, 0.5, 5, 9));
        }else if(setSelection == "noWait"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 1, 10, 0));
            process_list.push(new Process(1, "Process 1",  "None", 1, true, 1, 2, 0));
            process_list.push(new Process(2, "Process 2",  "None", 2, true, 1, 5, 0));
            process_list.push(new Process(3, "Process 3",  "None", 3, true, 1, 10, 0));
        }else if(setSelection == "sorted"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 0.9, 4, 0));
            process_list.push(new Process(1, "Process 1",  "None", 1, true, 0.9, 5, 0));
            process_list.push(new Process(2, "Process 2",  "None", 2, true, 0.9, 8, 0));
            process_list.push(new Process(3, "Process 3",  "None", 3, true, 0.9, 10, 0));
        }
        
        localStorage.setItem(storage_key, JSON.stringify(process_list));
        popProcessList("processList");
        $("#presetData").value = "default";
        simulation.initialize(process_list, $("#scheduler").value);
        showToast("Updated process list...")
    })
})

/*
*   createProcess - Using user input values create a process prototype
*                   instance
*               
*   Details: All id's are gathered from the form submitted by the user in index.html
*/
function createProcess() {
    let process_list = [];
    if(localStorage.getItem(storage_key)) {
        process_list = JSON.parse(localStorage.getItem(storage_key));
    }
    let new_process = new Process;
    //the new id is equal to the length of the process list before addition
    new_process.id = process_list.length; 

    if ($("#processName").value == "") {
        new_process.name = "Process " + new_process.id;
    } else {
        new_process.name = $("#processName").value;
    }
    
    new_process.state = "None";
    

    new_process.priority = convertToInt($("#priorityInput").value);
    new_process.running_chance = convertToInt($("#runningChanceInput").value) / 100;
    new_process.required_execution_time = convertToInt($("#burstTimeInput").value);
    new_process.delay_time = convertToInt($("#arrivalTimeInput").value);
    new_process.time_to_arrival = convertToInt($("#arrivalTimeInput").value);

    console.log(new_process.time_to_arrival);

    appendProcessList(new_process);
}



/*
*   appendProcessList - Adds a passed process to the process list, updating
*                       the front and backend.
*
*   Details: #editProcessList refers to the html ul element which displays to
*            the user
*/
function appendProcessList(process) {
    const process_list = $("#editProcessList");
    //adding to the html
    let name = document.createElement("li");
    name.className = "bg-white p-2 rounded shadow";
    name.textContent = process.name;
    name.dataset.id = process.id;
    name.addEventListener("mouseover", (e) => {
        e.target.classList.toggle("bg-blue-500");
    });

    name.addEventListener("mouseout", (e) => {
        e.target.classList.toggle("bg-blue-500");
    });
    let id = document.createElement("strong");
    id.className = "ml-4";
    id.textContent = "P" + process.id;
    name.appendChild(id);
    
    process_list.appendChild(name);

    //adding to the locally stored array
    if(localStorage.getItem(storage_key)) {
        let process_list = JSON.parse(localStorage.getItem(storage_key));
        process_list.push(process);
        localStorage.setItem(storage_key, JSON.stringify(process_list));
    }
}
/*
*   editProcess - Changes one specific process that's being updated
*
*/
function editProcess(process) {
    let process_list = [];
    if(localStorage.getItem(storage_key)) {
        process_list = JSON.parse(localStorage.getItem(storage_key));
    }

    for(let p of process_list) {
        if(p.id == process.id) {
            if ($("#processName").value == "") {
                p.name = "Process " + process.id;
            } else {
                p.name = $("#processName").value;
            }
            //the new id is equal to the length of the process list before addition

            p.priority = convertToInt($("#priorityInput").value);
            p.running_chance = convertToInt($("#runningChanceInput").value) / 100;
            p.required_execution_time = convertToInt($("#burstTimeInput").value);
            p.delay_time = convertToInt($("#arrivalTimeInput").value);
            p.time_to_arrival = convertToInt($("#arrivalTimeInput").value);

            break;
        }
    }
    
    localStorage.setItem(storage_key, JSON.stringify(process_list));
    
}

function convertToInt(value) {
    // Attempt to convert the input to an integer
    const number = parseInt(value, 10);

    // Check if the conversion resulted in a valid number
    if (isNaN(number)) {
        return 0; // Return 0 if the conversion fails
    }

    // Return the converted integer
    return number;
}


