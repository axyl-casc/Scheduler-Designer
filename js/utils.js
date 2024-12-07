function $(selector) {return document.querySelector(selector)}
function $$(selector) {return document.querySelectorAll(selector)}

function updateProcessStates(processes) {
    try{
        // Use Sets to automatically handle duplicate entries
        let newProcesses = new Set();
        let terminatedProcesses = new Set();
        let readyProcesses = new Set();
        let runningProcesses = new Set();
        let waitingProcesses = new Set();

        // kebon

        // Sort processes into their respective states - kevin was here
        processes.forEach((process) => {
            switch (process.state) {
                case "New":
                    newProcesses.add(`P${process.id}`);
                    break;
                case "Terminated":
                    terminatedProcesses.add(`P${process.id}`);
                    break;
                case "Ready":
                    readyProcesses.add(`P${process.id}`);
                    break;
                case "Running":
                    runningProcesses.add(`P${process.id}`);
                    break;
                case "Waiting":
                    waitingProcesses.add(`P${process.id}`);
                    break;
                case "Unwait":
                    waitingProcesses.add(`P${process.id}`);
                    break;
                case "None":
                    //
                    break;
            }
        });

        // Update the state labels with the corresponding process IDs
        $("#new_state_process").textContent = Array.from(newProcesses).join(", ");
        $("#terminated_state_process").textContent = Array.from(terminatedProcesses).join(", ");
        $("#ready_state_process").textContent = Array.from(readyProcesses).join(", ");
        $("#running_state_process").textContent = Array.from(runningProcesses).join(", ");
        $("#wait_state_process").textContent = Array.from(waitingProcesses).join(", ");
    }catch{
        console.log("utils.js : process state transition error")
    }

}



function showToast(text) {
    const toast = document.querySelector('#toast');
    const toastContainer = document.querySelector('#toast-container');

    if (!toast || !toastContainer) {
        console.log("utils.js : Toast elements not found in the DOM");
        return;
    }

    toast.textContent = text;

    // Show the toast
    toastContainer.classList.remove('hidden');
    toast.classList.remove('opacity-0');
    toast.classList.add('opacity-100');

    addNotification(text);
    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
        setTimeout(() => {
            toastContainer.classList.add('hidden');
        }, 500);
    }, 3000);
}

function addNotification(message) {
    const notificationBox = $('#notification-box');
    
    // Create a new notification element
    const notification = document.createElement('div');
    notification.className = 'mb-2 p-2 bg-gray-700 rounded-md';
    notification.textContent = message;
  
    // Append to the notification box
    notificationBox.appendChild(notification);
  
    // Scroll to the bottom to ensure the latest message is visible
    notificationBox.scrollTop = notificationBox.scrollHeight;
  }
  