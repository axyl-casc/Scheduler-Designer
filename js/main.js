function $(selector) {return document.querySelector(selector)}
function $$(selector) {return document.querySelectorAll(selector)}
const simulation = new Simulator();
simulation.setSpeed(0.5); // set a default speed
simulation.reset(false);

const storage_key = "processes"; //the key for locally stored processes

function updateSliderValue(value) {
    simulation.setSpeed(value);
  }
  

document.addEventListener("DOMContentLoaded", () => {
    let process_list = [];
    if(!(localStorage.getItem(storage_key))) {
        //The 4 pushes below are test values - delete locally stored array "processes" to make them added.
        process_list.push(new Process(0, "systemd",  "None", 0, true, 0.1, 20, 0));
        process_list.push(new Process(1, "kevin",  "None", 1, true, 0.75, 2, 5));
        process_list.push(new Process(2, "test1",  "None", 2, true, 0.6, 5, 0));
        process_list.push(new Process(3, "test2",  "None", 3, true, 0.5, 10, 0));
        
        localStorage.setItem(storage_key, JSON.stringify(process_list));
    } else {
        process_list = JSON.parse(localStorage.getItem(storage_key));
    }
    popProcessList("processList");

    $("#editProcessBtn").addEventListener("click", () => {
        $("#mainScreen").classList.toggle("hidden");
        $("#pcbScreen").classList.toggle("hidden");
        $("#createProcessBtn").textContent = "Create";
        popProcessList("editProcessList");
        if($("#createProcessBtn").classList.contains("hidden")) {
            $("#updateProcessBtn").classList.toggle("hidden");
            $("#createProcessBtn").classList.toggle("hidden");
        }
        resetProcessForm();
    })
    $("#showResultBtn").addEventListener("click", () => {
        if($("#resultScreen").classList.contains("hidden")) {
            $("#resultScreen").classList.toggle("hidden");
            $("#simulatorScreen").classList.toggle("hidden");
            display_results(simulation)
        }
        
    })
    $("#showSimBtn").addEventListener("click", () => {
        if($("#simulatorScreen").classList.contains("hidden")) {
            $("#simulatorScreen").classList.toggle("hidden");
            $("#resultScreen").classList.toggle("hidden");
        }

        if(localStorage.getItem(storage_key)) {
            process_list = JSON.parse(localStorage.getItem(storage_key));
        }
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

    $("#playButton").addEventListener("click", () => {
        if(simulation.isOn()){
            simulation.play();
        }else{
            simulation.initialize(process_list, $("#scheduler").value);
            simulation.run();
        }
        
    })
    $("#pauseButton").addEventListener("click", () => {
        simulation.pause();
    })
    $("#stepButton").addEventListener("click", () => {
        simulation.forceStep();
    })
    $("#resetButton").addEventListener("click", () => {
        simulation.reset(true);
    })

    const processList = $("#processList");
    const processPopup = $("#processPopup");
    const processDetails = $("#processDetails");
    const closePopup = $("#closePopup");

    // Populate the popup with process details
    const displayProcessDetails = (process) => {
        processDetails.innerHTML = `
        <p><strong>ID:</strong> ${process.id}</p>
        <p><strong>Name:</strong> ${process.name}</p>
        <p><strong>State:</strong> ${process.state}</p>
        <p><strong>Priority:</strong> ${process.priority}</p>
        <p><strong>Is IO:</strong> ${process.is_io}</p>
        <p><strong>Running Chance:</strong> ${process.running_chance}</p>
        <p><strong>Execution Time:</strong> ${process.execution_time}</p>
        <p><strong>Required Execution Time:</strong> ${process.required_execution_time}</p>
        <p><strong>Wait Time:</strong> ${process.wait_time}</p>
        <p><strong>Ready Time:</strong> ${process.ready_time}</p>
        <p><strong>Time of Termination:</strong> ${process.time_of_term}</p>
        <p><strong>Delay Time:</strong> ${process.delay_time}</p>
        `;
        processPopup.classList.remove("hidden");
    };

    // Attach click event to process items
    processList.addEventListener("click", (e) => {
        let process_list = [];
        if(localStorage.getItem(storage_key)) {
            process_list = JSON.parse(localStorage.getItem(storage_key));
        }
        const process = process_list.find((p) => p.id == e.target.dataset.id);
        
        if (process) {
            displayProcessDetails(process);
        }
    });

    let process;
    $("#editProcessList").addEventListener("click", (e) => {
        
        let process_list = [];
        if(localStorage.getItem(storage_key)) {
            process_list = JSON.parse(localStorage.getItem(storage_key));
        }
        process = process_list.find((p) => p.id == e.target.dataset.id);
        
        if (process) {
            //displayProcessDetails(process);
            $("#processName").value = process.name;
            //the new id is equal to the length of the process list before addition

            //all new processes should be "New"? check with axyl
            process.state = "None";

            $("#priorityInput").value = process.priority;
            $("#runningChanceInput").value = process.running_chance * 100;
            $("#isIOInput").value = process.is_io;
            $("#burstTimeInput").value = process.required_execution_time;
            $("#arrivalTimeInput").value = process.delay_time;
        }
        if($("#updateProcessBtn").classList.contains("hidden")) {
            $("#createProcessBtn").classList.toggle("hidden");
            $("#updateProcessBtn").classList.toggle("hidden");
        } 
    });
    $("#updateProcessBtn").addEventListener("click", () => {
        if($("#createProcessBtn").classList.contains("hidden")) {
            if(process != undefined) {
                editProcess(process);
                resetProcessForm();
                popProcessList("editProcessList");
                process = undefined;
            }
        }
        $("#updateProcessBtn").classList.toggle("hidden");
        $("#createProcessBtn").classList.toggle("hidden");
        
    })

    

    // Close popup
    closePopup.addEventListener("click", () => {
        processPopup.classList.add("hidden");
    });


        
})

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
                name.dataset.id = process.id;
                name.addEventListener("mouseover", (e) => {
        
                    e.target.classList.toggle("bg-blue-500");
                });
            
                name.addEventListener("mouseout", (e) => {
                    
                    e.target.classList.toggle("bg-blue-500");
                });
                list.appendChild(name);
                let id = document.createElement("strong");
                id.className = "ml-4";
                id.textContent = "P" + process.id;
                name.appendChild(id);
            })
        }

    }
function resetProcessForm() {
    $("#processName").value = "";
    $("#priorityInput").value = 0;
    $("#runningChanceInput").value = ""
    $("#isIOInput").value = "";
    $("#burstTimeInput").value = "";
    $("#arrivalTimeInput").value = "";
}
