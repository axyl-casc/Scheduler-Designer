class Simulator {
    constructor() {
        this.processList = []; // Stores the list of processes in the ready queue
        this.schedulingAlgorithm = null; // Stores the scheduling algorithm
        this.isRunning = false; // Indicates if the simulation is running
        this.speed = 1; // Default simulation speed
        this.intervalId = null; // Stores the interval ID for the simulation
        this.interrupt_freq = 5;
        this.totalSteps = 0;
        this.cpuNotUsedFrames = 0;
        this.noProcessReadyFrames = 0;
        this.cpuRunningFrames = 0;
        this.ganttData = [];
    }

    initialize(process_list, scheduling_algorithm) {
        this.processList = process_list;
        this.setScheduler(scheduling_algorithm)
        this.isRunning = false;
        console.log("Simulator initialized with process list and scheduling algorithm.");
        this.reset();
    }

    setScheduler(sch_str){
        this.schedulingAlgorithm = sch_str.toLowerCase();
        if(this.schedulingAlgorithm != "default"){
            showToast(`Scheduler set to ${sch_str}`)
        }
    }

    isOn(){
        if(this.totalSteps == 0 && this.isRunning == false){
            return false;
        }
        return true;
    }
    getCpuThroughput(){
        return Math.floor(this.totalSteps / this.processList.length);
    }
    getCpuUsage(){
        return Math.floor((this.cpuRunningFrames / this.totalSteps) * 100)
    }
    getGanttData(){
        return this.ganttData;
    }
    incrementRunningExecutionTime() {
        let isReadyProcess = false;
        for(let p of this.processList){
            if(p.state == "Ready"){
                isReadyProcess = true;
            }
        }
        if(isReadyProcess == false){
            this.noProcessReadyFrames++;
        }
        this.totalSteps++;
        let cpu_used = false;
        for (const process of this.processList) {
            if (process.state == "Running") {
                if(cpu_used == false){
                    this.cpuRunningFrames++;
                    cpu_used = true;
                    this.ganttData.push(process.id)
                    process.execution_time++;
                    if(process.execution_time >= process.required_execution_time){
                        process.state = "Terminated"
                    }else if(Math.random() > process.running_chance){
                        process.state = "Waiting";
                    }
                    if(process.first_execution_time == -1){
                        process.first_execution_time = this.totalSteps;
                    }
                }
            }
            if (process.state === "Waiting") {
                process.wait_time++;
            }
            if (process.state === "New") {
                process.new_time++;
            }
            if (process.state === "Ready" || process.state === "Unwait") {
                process.ready_time++;
            }
            if (process.state === "Terminated" && process.time_of_term == -1) {
                process.time_of_term = this.totalSteps;
            }
        }

        // keep track of CPU usage
        if(cpu_used == false){
            this.cpuNotUsedFrames++;
            console.log("CPU not running")
        }
    }
    
    run() {
        if(this.schedulingAlgorithm != "default"){ 
            this.reset(false)
            showToast("Simulation running...");
            this.isRunning = true;
            console.log("Simulation started.");
            this.resetTimers();
            this.step();
        }else{
            showToast("Select a scheduler first...")
        }
        
    }

    getProcessList(){
        return this.processList;
    }


    forceStep(){
        this.isRunning = true;

        if(this.step() == false){
            this.pollWaitingQueue()
        }
        showToast("Stepped...");
        this.isRunning = false;
    }

    forceComplete(){
        while(this.isRunning){
            this.step();
            this.pollWaitingQueue()
        }
    }

    reset(displayToast){
        clearInterval(this.intervalId);
        clearInterval(this.intervalIdWait);
        this.isRunning = false;
        this.ganttData = [];

        for(let p of this.processList){
            p.state = "None";
            p.delay_time = p.time_to_arrival;
            p.wait_time = 0;
            p.ready_time = 0;
            p.new_time = 0;
            p.time_of_term = -1;
            p.first_execution_time = -1;
            p.execution_time = 0;
        }

        this.totalSteps = 0;
        this.cpuNotUsedFrames = 0;
        this.cpuRunningFrames = 0;
        updateProcessStates(this.processList);
        if(displayToast){
            showToast("Simulator reset...")
        }

    }

    step(){
        if(this.processList.every(process => process.state == "Terminated")){
            updateProcessStates(this.processList);
            this.isRunning = false;
            return;
        }

        let CPU_interrupt = 5;

        if(isNaN(parseInt($("#cpuInterruptInput").value))){
            console.log("No interrupt set")
        }else{
            CPU_interrupt = parseInt($("#cpuInterruptInput").value);
            console.log(`CPU interrupt set to ${CPU_interrupt}`)

        }

        this.interrupt_freq = CPU_interrupt

        let ret_val = false;

        this.incrementRunningExecutionTime();

        for(let p of this.processList){
            if(p.delay_time <= 0 && p.state == "New"){
                p.state = "Ready" // assumes new process creation is a queue
                updateProcessStates(this.processList);
                return true;
            }
        }
        for(let p of this.processList){
            if(p.delay_time <= 0 && p.state == "None"){
                p.state = "New"
                updateProcessStates(this.processList);
                return true;
            }else if(p.state == "None"){
                p.delay_time--;
            }
        }
        if(this.totalSteps % this.interrupt_freq == 0){
            this.interrupt();
            updateProcessStates(this.processList);
            return true;
        }
        updateProcessStates(this.processList);
        if(this.isRunning == true){
            if (this.schedulingAlgorithm == "fifo") {
                for(let p of this.processList){
                    p.priority = p.id + p.time_to_arrival * 100;
                }
            }else if(this.schedulingAlgorithm == "sjf"){
                for(let p of this.processList){
                    p.priority = p.required_execution_time;
                }
            }else if(this.schedulingAlgorithm == "ljf"){
                for(let p of this.processList){
                    p.priority = -1 * p.required_execution_time;
                }
            }else if(this.schedulingAlgorithm == "srt"){
                for(let p of this.processList){
                    p.priority = p.required_execution_time - p.execution_time;
                }
            }
            ret_val = this.priority_step();
        }
        // End simulation if all processes are Terminated
        if (this.processList.every(process => process.state == "Terminated")) {
            if (this.isRunning) {
                this.isRunning = false;
                showToast("Simulation Complete.");
            }else{
                clearInterval(this.intervalId);
            }
            return false;
        }
        updateProcessStates(this.processList);
        while(ret_val == false){
            this.pollWaitingQueue()
            ret_val = this.step();
        }
        return ret_val
    }


    priority_step() {
        let ret_val = true;
        // Select the highest-priority process that is not Terminated
        const eligibleProcesses = this.processList.filter(
            process => process.state != "Waiting" && process.state !== "Terminated" && process.state !== "None"
        );
        if (eligibleProcesses.length === 0) {
            console.log("No eligible processes to run.");
            return false;
        }
        // Sort processes by priority (lower value = higher priority)
        eligibleProcesses.sort((a, b) => a.priority - b.priority);

        for(let p of eligibleProcesses){
            if(p.state == "New"){
                p.state = "Ready";
                return true;
            }
        }
        
        let hasRunningProcess = false;
        for(let p of this.processList){
            if(p.state == "Running"){
                hasRunningProcess = true;
            }
        }
        if (hasRunningProcess) {
            console.log(`Another process is running. Skipping`);
            return false
        }
    

        const currentProcess = eligibleProcesses[0];
        let old_state = currentProcess.state;

        if(currentProcess.state === "Unwait"){
            currentProcess.state = "Ready";
            ret_val = false;
        }else if(currentProcess.state === "Ready"){
            currentProcess.state = "Running";
            if(this.schedulingAlgorithm == "aging"){
                currentProcess.priority++;
            }
        }

        if(old_state == currentProcess.state){
            console.error("A valid process could not move !!!");
        }
        return ret_val;
    }
    

    /**
     * Periodically checks the waiting queue to see if processes can return to Ready state.
     */
    pollWaitingQueue() {
        let ret_val = false;
        for (let i = this.processList.length - 1; i >= 0; i--) {
            const waitingProcess = this.processList[i];
            if (Math.random() > 0.5 && waitingProcess.state == "Waiting") { // Simulate the process becoming ready
                waitingProcess.state = "Unwait";
                console.log(`Process ${waitingProcess.name} is ready again.`);
                ret_val = true
            }
        }
        updateProcessStates(this.processList);
        return ret_val
    }

    pause() {
        showToast("Simulation paused...");
        if (!this.isRunning) {
            console.log("Simulation is already paused.");
            return;
        }

        // disable timers to pause
        clearInterval(this.intervalId);
        clearInterval(this.intervalIdWait);
        this.isRunning = false;
        console.log("Simulation paused.");
    }
    play(){
        this.isRunning = true;
        this.resetTimers();
    }

    // resert the timers for calling the functions used
    resetTimers(){
        clearInterval(this.intervalId);
        clearInterval(this.intervalIdWait);

        this.intervalIdWait = setInterval(() => this.pollWaitingQueue(), 1000 / this.speed);
        this.intervalId = setInterval(() => this.step(), 1000 / this.speed);
    }

    interrupt(){
        if($("#preemptionCheckbox").checked){
            for(let p of this.processList){
                if(p.state == "Running"){
                    p.state = "Ready";
                }
            }
        }
    }

    setSpeed(speedValue) {
        if (speedValue <= 0) {
            console.log("simulation.js: Speed value must be greater than zero.");
            return;
        }
        this.speed = speedValue * speedValue;
        this.resetTimers();
        console.log(`Simulation speed set to ${speedValue}.`);
    }

    getProcessInfo(process_id) {
        const process = this.processList.find(proc => proc.id === process_id);
        if (!process) {
            console.log(`simulation.js : Process with ID ${process_id} not found.`);
            return null;
        }
        return process;
    }
}
