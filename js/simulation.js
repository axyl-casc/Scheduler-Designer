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
        this.schedulingAlgorithm = scheduling_algorithm.toLowerCase();
        this.isRunning = false;
        this.currentProcessIndex = 0;
        this.totalSteps = 0;
        console.log("Simulator initialized with process list and scheduling algorithm.");
    }
    incrementRunningExecutionTime() {
        for (const process of this.processList) {
            if (process.state === "Running") {
                process.execution_time++;
                if(process.execution_time >= process.required_execution_time){
                    process.state = "Terminated"
                }else if(Math.random() > process.running_chance){
                    process.state = "Waiting";
                }
            }
            if (process.state === "Waiting") {
                process.wait_time++;
            }
            if (process.state === "Ready" || process.state === "Unwait") {
                process.ready_time++;
            }
            if (process.state === "Terminated" && process.time_of_term == -1) {
                process.time_of_term = this.totalSteps;
            }
        }
    }
    
    run() {
        if(this.schedulingAlgorithm != "select a scheduler"){ // messy :(
            showToast("Simulation running...");
            this.isRunning = true;
            console.log("Simulation started.");
            this.resetTimers();
            updateProcessStates(this.processList);
        }else{
            showToast("Select a scheduler first...")
        }
        
    }

    step(){
        console.log(this.processList);
        // add process to delay after a time
        for(let p of this.processList){
            if(p.delay_time <= 0 && p.state == "None"){
                p.state = "New"
            }else{
                p.delay_time--;
            }
        }

        console.log(this.processList);
        if(this.isRunning == true){
            if (this.schedulingAlgorithm === "fifo") {
                for(let p of this.processList){
                    p.priority = p.id;
                }
            }else if(this.schedulingAlgorithm === "sjf"){
                for(let p of this.processList){
                    p.priority = p.required_execution_time;
                }
            }else if(this.schedulingAlgorithm === "ljf"){
                for(let p of this.processList){
                    p.priority = -1 * p.required_execution_time;
                }
            }
            this.priority_step();
        }
        // End simulation if all processes are Terminated
        if (this.processList.every(process => process.state === "Terminated")) {
            if (this.isRunning) {
                this.isRunning = false;
                showToast("Simulation Complete.");
            }else{
                clearInterval(this.intervalId);
            }
            return false;
        }
        updateProcessStates(this.processList);
    }

    priority_step() {
        // Select the highest-priority process that is not Terminated
        const eligibleProcesses = this.processList.filter(
            process => process.state != "Waiting" && process.state !== "Terminated"
        );
        if (eligibleProcesses.length === 0) {
            console.log("No eligible processes to run.");
            return false;
        }

        const hasRunningProcess = this.processList.some(process => process.state === "Running");
        if (hasRunningProcess) {
            console.log(`Another process is running. Skipping`);
            this.incrementRunningExecutionTime();
            return false
        }
    
        // Sort processes by priority (lower value = higher priority)
        eligibleProcesses.sort((a, b) => a.priority - b.priority);
        const currentProcess = eligibleProcesses[0];
        let old_state = currentProcess.state;

        if(currentProcess.state === "Unwait"){
            currentProcess.state = "Ready";
        }else if(currentProcess.state === "New"){
            currentProcess.state = "Ready";
        }else if(currentProcess.state === "Ready"){
            currentProcess.state = "Running";
        }

        if(old_state == currentProcess.state){
            console.error("A valid process could not move !!!");
        }

    }
    

    /**
     * Periodically checks the waiting queue to see if processes can return to Ready state.
     */
    pollWaitingQueue() {
        for (let i = this.processList.length - 1; i >= 0; i--) {
            const waitingProcess = this.processList[i];
            if (Math.random() > 0.5 && waitingProcess.state == "Waiting") { // Simulate the process becoming ready
                waitingProcess.state = "Unwait";
                console.log(`Process ${waitingProcess.name} is ready again.`);
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

    // resert the timers for calling the functions used
    resetTimers(){
        clearInterval(this.intervalId);
        clearInterval(this.intervalIdWait);

        this.intervalIdWait = setInterval(() => this.pollWaitingQueue(), 1.1 * (1000 / this.speed));
        this.intervalId = setInterval(() => this.step(), 1000 / this.speed);
    }

    setSpeed(speedValue) {
        if (speedValue <= 0) {
            console.error("Speed value must be greater than zero.");
            return;
        }
        this.speed = speedValue;
        this.resetTimers();
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
