
document.addEventListener("DOMContentLoaded", () => {
    $("#createProcessBtn").addEventListener("click", () => {
        createProcess();
    })
    $("#scheduler").addEventListener("change", () => {
        simulation.setScheduler($("#scheduler").value);
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
    new_process.name = $("#processName").value;
    
    //the new id is equal to the length of the process list before addition
    new_process.id = process_list.length; 

    new_process.state = "None";

    new_process.priority = $("#priorityInput").value;
    new_process.running_chance = $("#runningChanceInput").value / 100;
    new_process.is_io = $("#isIOInput").value;
    new_process.required_execution_time = $("#burstTimeInput").value;
    new_process.delay_time = $("#arrivalTimeInput").value;

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
            p.name = $("#processName").value;
            //the new id is equal to the length of the process list before addition

            p.priority = $("#priorityInput").value;
            p.running_chance = $("#runningChanceInput").value / 100;
            p.is_io = $("#isIOInput").value;
            p.required_execution_time = $("#burstTimeInput").value;
            p.delay_time = $("#arrivalTimeInput").value;

            break;
        }
    }
    
    localStorage.setItem(storage_key, JSON.stringify(process_list));
    
}


