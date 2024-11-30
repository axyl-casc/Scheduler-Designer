

_STATE_IDS = [
    ""
]

class Simulator {
    constructor() {
        this.processList = []; // Stores the list of processes in the ready queue
        this.waitingQueue = []; // Stores processes in the waiting state
        this.schedulingAlgorithm = null; // Stores the scheduling algorithm
        this.isRunning = false; // Indicates if the simulation is running
        this.speed = 1; // Default simulation speed
        this.currentProcessIndex = 0; // Keeps track of the current process
        this.intervalId = null; // Stores the interval ID for the simulation
        this.totalSteps = 0;
    }

    initialize(process_list, scheduling_algorithm) {
        this.processList = process_list;
        this.schedulingAlgorithm = scheduling_algorithm;
        this.isRunning = false;
        this.currentProcessIndex = 0;
        console.log("Simulator initialized with process list and scheduling algorithm.");
    }
    incrementRunningExecutionTime() {
        for (const process of this.processList) {
            if (process.state === "Running") {
                process.execution_time++;
                console.log(
                    `Process ${process.name}: Execution time incremented to ${process.execution_time}.`
                );
    
                // Check if the process has completed
                if (process.execution_time >= process.required_execution_time) {
                    process.state = "Terminated";
                    console.log(`Process ${process.name} has completed and is now Terminated.`);
                }
            }
        }
    }
    
    run() {
        showToast("Simulation running...");
        this.isRunning = true;
        console.log("Simulation started.");

        if (this.schedulingAlgorithm === "FIFO") {
            this.intervalId = setInterval(() => this.fifo_step(), 1000 / this.speed);
        } else {
            this.intervalId = setInterval(() => this.step(), 1000 / this.speed);
        }

        // Periodically check the waiting queue
        setInterval(() => this.pollWaitingQueue(), 1000 / this.speed);
    }
    fifo_step() {
        this.totalSteps++;
        if(this.totalSteps == 1){
            return false;
        }
        if(this.processList.every(process => process.state === "Terminated" && this.isRunning)){
            this.isRunning = false;
            showToast("Simulation Complete.")
        }

        this.incrementRunningExecutionTime();
        // Update process states in the UI
        updateProcessStates(this.processList);
    
        // Check if all processes have been executed
        if (this.currentProcessIndex >= this.processList.length) {
            this.currentProcessIndex = 0;
            console.log("Process list wrapped around:");
            console.log(this.processList);
            return this.fifo_step();
        }
    
        const currentProcess = this.processList[this.currentProcessIndex];
    
        if(currentProcess.state == "Terminated"){
            this.currentProcessIndex++;
            return this.fifo_step();
        }

        // Ensure only one process is in the "Ready" state
        const hasReadyProcess = this.processList.some(process => process.state === "Running");
        if (hasReadyProcess && currentProcess.state === "Ready") {
            console.log(`Another process is Ready. Skipping ${currentProcess.name}.`);
            this.currentProcessIndex++;
            return false;
        }
    
        // Handle the "New" state, transitioning to "Ready" only if no other process is Ready
        if (currentProcess.state === "New" && !hasReadyProcess) {
            currentProcess.state = "Ready";
            console.log(`Process ${currentProcess.name} moved to Ready state.`);
            this.currentProcessIndex++;
            updateProcessStates(this.processList);
            return true;
        }
    
        // Handle the "Unwait" state, transitioning to "Ready" only if no other process is Ready
        if (currentProcess.state === "Unwait" && !hasReadyProcess) {
            currentProcess.state = "Ready";
            console.log(`Process ${currentProcess.name} returned to Ready state from Unwait.`);
            this.currentProcessIndex++;
            updateProcessStates(this.processList);
            return true;
        }
    
        // Handle the "Waiting" state
        if (currentProcess.state === "Waiting") {
            console.log(`Process ${currentProcess.name} is in Waiting state. Moving to the next process.`);
            this.currentProcessIndex++;
            updateProcessStates(this.processList);
            return false;
        }
    
        // Handle processes in the "Ready" or "Running" state
        if (currentProcess.state === "Ready" || currentProcess.state === "Running") {
            // Transition to "Running" state
            if (currentProcess.state === "Ready") {
                currentProcess.state = "Running";
                console.log(`Process ${currentProcess.name} is now Running.`);
                return true;
            }
    
            console.log(
                `Process ${currentProcess.name}: Execution progress: ${currentProcess.execution_time}/${currentProcess.required_execution_time}`
            );
    
            // Randomly transition to "Waiting" state if still executing
            if (Math.random() > currentProcess.running_chance && currentProcess.execution_time < currentProcess.required_execution_time) {
                currentProcess.state = "Waiting";
                this.waitingQueue.push(currentProcess);
                console.log(`Process ${currentProcess.name} moved to Waiting state.`);
            } else if (currentProcess.execution_time >= currentProcess.required_execution_time) {
                // Mark as "Terminated" if execution is complete
                currentProcess.state = "Terminated";
                console.log(`Process ${currentProcess.name} has completed and is now Terminated.`);
                return true;
            }
        }
    
        // Advance to the next process
        this.currentProcessIndex++;
        updateProcessStates(this.processList);
        return true;
    }
    

    /**
     * Periodically checks the waiting queue to see if processes can return to Ready state.
     */
    pollWaitingQueue() {
        for (let i = this.waitingQueue.length - 1; i >= 0; i--) {
            const waitingProcess = this.waitingQueue[i];
            if (Math.random() > 0.5) { // Simulate the process becoming ready
                waitingProcess.state = "Unwait";
                console.log(`Process ${waitingProcess.name} is ready again.`);
                this.processList.push(waitingProcess); // Reinsert into the ready queue
                this.waitingQueue.splice(i, 1); // Remove from the waiting queue
            }
        }
        updateProcessStates(this.processList);
    }

    pause() {
        showToast("Simulation paused...");
        if (!this.isRunning) {
            console.log("Simulation is already paused.");
            return;
        }
        clearInterval(this.intervalId);
        this.isRunning = false;
        console.log("Simulation paused.");
    }

    setSpeed(speedValue) {
        if (speedValue <= 0) {
            console.error("Speed value must be greater than zero.");
            return;
        }
        this.speed = speedValue;
        if (this.isRunning) {
            this.pause();
            this.run();
        }
        console.log(`Simulation speed set to ${speedValue}.`);
    }

    getProcessInfo(process_id) {
        const process = this.processList.find(proc => proc.id === process_id);
        if (!process) {
            console.error(`Process with ID ${process_id} not found.`);
            return null;
        }
        return process;
    }
}
