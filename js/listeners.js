
document.addEventListener("DOMContentLoaded", () => {
    $("#createProcessBtn").addEventListener("click", () => {
        createProcess();
        showToast("Creating process...")
    })
    $("#scheduler").addEventListener("change", () => {
        simulation.setScheduler($("#scheduler").value);
    })

    $("#preemptionCheckbox").addEventListener("change", (event) => {
        const cpuInterruptInput = $("#cpuInterruptInput");
    
        if (event.target.checked) {
            cpuInterruptInput.classList.remove("hidden"); // Show the element
        } else {
            cpuInterruptInput.classList.add("hidden"); // Hide the element
        }
    });
    $("#agingCheckbox").addEventListener("change", (event) => {
        const agingFactor = document.querySelector("#agingFactor");

        if (event.target.checked) {
            agingFactor.classList.remove("hidden"); // Show the element
        } else {
            agingFactor.classList.add("hidden"); // Hide the element
        }
    });

    $("#presetData").addEventListener("change", () => {
        // set the process table based on the input
        const setSelection = $("#presetData").value;
        const process_list = []
        console.log(`Set new process ${setSelection}`);
        if(setSelection == "ap"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 0.9, 100, 0));
            process_list.push(new Process(1, "kevin",  "None", 1, true, 0.9, 20, 7));
            process_list.push(new Process(2, "test1",  "None", 2, true, 0.9, 50, 2));
            process_list.push(new Process(3, "test2",  "None", 3, true, 0.9, 100, 0));
        }else if(setSelection == "sp"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 0.9, 100, 0));
        }else if(setSelection == "da"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 0.9, 50, 0));
            process_list.push(new Process(1, "Process 1",  "None", 1, true, 0.9, 50, 3));
            process_list.push(new Process(2, "Process 2",  "None", 2, true, 0.9, 50, 6));
            process_list.push(new Process(3, "Process 3",  "None", 3, true, 0.9, 50, 9));
        }else if(setSelection == "noWait"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 1, 100, 0));
            process_list.push(new Process(1, "Process 1",  "None", 1, true, 1, 20, 0));
            process_list.push(new Process(2, "Process 2",  "None", 2, true, 1, 50, 0));
            process_list.push(new Process(3, "Process 3",  "None", 3, true, 1, 100, 0));
        }else if(setSelection == "sorted"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 0.9, 40, 0));
            process_list.push(new Process(1, "Process 1",  "None", 1, true, 0.9, 50, 0));
            process_list.push(new Process(2, "Process 2",  "None", 2, true, 0.9, 80, 0));
            process_list.push(new Process(3, "Process 3",  "None", 3, true, 0.9, 100, 0));
        }else if(setSelection == "minOverHead"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 1, 200, 0));
            process_list.push(new Process(1, "Process 1",  "None", 1, true, 1, 200, 0));
            process_list.push(new Process(2, "Process 2",  "None", 2, true, 1, 200, 0));
            process_list.push(new Process(3, "Process 3",  "None", 3, true, 1, 200, 0));
            process_list.push(new Process(4, "Process 4",  "None", 1, true, 1, 200, 0));
            process_list.push(new Process(5, "Process 5",  "None", 2, true, 1, 200, 0));
            process_list.push(new Process(6, "Process 6",  "None", 3, true, 1, 200, 0));
            process_list.push(new Process(7, "Process 7",  "None", 1, true, 1, 200, 0));
            process_list.push(new Process(8, "Process 8",  "None", 2, true, 1, 200, 0));
            process_list.push(new Process(9, "Process 9",  "None", 3, true, 1, 200, 0));
        }else if(setSelection == "normOverHead"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 0.9, 200, 0));
            process_list.push(new Process(1, "Process 1",  "None", 1, true, 0.9, 200, 0));
            process_list.push(new Process(2, "Process 2",  "None", 2, true, 0.9, 200, 0));
            process_list.push(new Process(3, "Process 3",  "None", 3, true, 0.9, 200, 0));
            process_list.push(new Process(4, "Process 4",  "None", 1, true, 0.9, 200, 0));
            process_list.push(new Process(5, "Process 5",  "None", 2, true, 0.9, 200, 0));
            process_list.push(new Process(6, "Process 6",  "None", 3, true, 0.9, 200, 0));
            process_list.push(new Process(7, "Process 7",  "None", 1, true, 0.9, 200, 0));
            process_list.push(new Process(8, "Process 8",  "None", 2, true, 0.9, 200, 0));
            process_list.push(new Process(9, "Process 9",  "None", 3, true, 0.9, 200, 0));
        }else if(setSelection == "oneBigManySmall"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 0.9, 1000, 0));
            process_list.push(new Process(1, "Process 1",  "None", 1, true, 0.9, 20, 0));
            process_list.push(new Process(2, "Process 2",  "None", 2, true, 0.9, 30, 0));
            process_list.push(new Process(3, "Process 3",  "None", 3, true, 0.9, 40, 0));
            process_list.push(new Process(4, "Process 4",  "None", 1, true, 0.9, 50, 0));
            process_list.push(new Process(5, "Process 5",  "None", 2, true, 0.9, 60, 0));
            process_list.push(new Process(6, "Process 6",  "None", 3, true, 0.9, 45, 0));
            process_list.push(new Process(7, "Process 7",  "None", 1, true, 0.9, 67, 0));
            process_list.push(new Process(8, "Process 8",  "None", 2, true, 0.9, 23, 0));
            process_list.push(new Process(9, "Process 9",  "None", 3, true, 0.9, 5, 0));
        }else if(setSelection == "sjfPreemption"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 0.9, 300, 0));
            process_list.push(new Process(1, "Process 1",  "None", 1, true, 0.9, 250, 0));
            process_list.push(new Process(2, "Process 2",  "None", 2, true, 0.9, 200, 0));
            process_list.push(new Process(3, "Process 3",  "None", 3, true, 0.9, 150, 0));
            process_list.push(new Process(4, "Process 4",  "None", 1, true, 0.9, 50, 0));
        }else if(setSelection == "priorityPreemption"){
            process_list.push(new Process(0, "systemd",  "None", 0, true, 0.9, 300, 0));
            process_list.push(new Process(1, "Process 1",  "None", 8, true, 0.9, 20, 0));
            process_list.push(new Process(2, "Process 2",  "None", 9, true, 0.9, 30, 0));
            process_list.push(new Process(3, "Process 3",  "None", 10, true, 0.9, 47, 0));
            process_list.push(new Process(4, "Process 4",  "None", 1, true, 0.9, 50, 0));
            process_list.push(new Process(5, "Process 5",  "None", 2, true, 0.9, 150, 200));
            process_list.push(new Process(6, "Process 6",  "None", 1, true, 0.9, 150, 300));
            process_list.push(new Process(7, "Process 7",  "None", 2, true, 0.9, 150, 400));
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





