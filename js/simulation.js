/**
 * Represents a CPU scheduling simulation.
 *
 * The `Simulator` class manages the processes, their states, and the scheduling algorithm
 * used to simulate CPU scheduling. It provides methods to initialize, run, step through,
 * and reset the simulation, as well as track various metrics such as CPU usage, throughput,
 * and Gantt chart data. This class supports multiple scheduling algorithms and simulates 
 * process execution, waiting, and termination.
 */

class Simulator {
    constructor() {
        this.processList = []; // Stores the list of processes currently in the simulation, including their states and attributes.
        this.schedulingAlgorithm = null; // The selected scheduling algorithm for the simulation (e.g., FIFO, SJF, etc.).
        this.isRunning = false; // A flag indicating whether the simulation is currently running.
        this.speed = 1; // The speed of the simulation; affects the interval of timer-based execution.
        this.intervalId = null; // Stores the ID of the timer interval for the main simulation loop.
        this.interrupt_freq = 5; // Frequency of CPU interrupts, measured in simulation steps.
        this.totalSteps = 0; // The total number of simulation steps that have been executed.
        this.cpuNotUsedFrames = 0; // Tracks the number of steps where the CPU was not utilized.
        this.noProcessReadyFrames = 0; // Counts the number of steps where no processes were in the "Ready" state.
        this.cpuRunningFrames = 0; // Tracks the number of steps where the CPU was actively running a process.
        this.ganttData = []; // An array used to record the Gantt chart data for visualizing process execution.
    }
    
/**
 * Initializes the simulator with a process list and scheduling algorithm.
 *
 * This method sets the list of processes to be simulated and selects a scheduling
 * algorithm. It also resets the simulation to its initial state and prepares it
 * for execution.
 *
 * @param {Array<Object>} process_list - The list of processes to simulate.
 * @param {string} scheduling_algorithm - The name of the scheduling algorithm to use.
 *
 * @returns {void}
 *
 * @example
 * // Initialize the simulator with a process list and the "FIFO" scheduling algorithm
 * simulator.initialize([
 *     { id: 1, state: "New", time_to_arrival: 0, required_execution_time: 5 },
 *     { id: 2, state: "New", time_to_arrival: 3, required_execution_time: 8 }
 * ], "FIFO");
 */
    initialize(process_list, scheduling_algorithm) {
        this.processList = process_list;
        this.setScheduler(scheduling_algorithm)
        this.isRunning = false;
        console.log("Simulator initialized with process list and scheduling algorithm.");
        this.reset();
    }
/**
 * Sets the scheduling algorithm for the simulation.
 *
 * This method updates the scheduling algorithm based on the provided string.
 * The algorithm name is converted to lowercase for consistency. If the algorithm
 * is not the default, a toast notification is displayed to confirm the change.
 *
 * @param {string} sch_str - The name of the scheduling algorithm to set.
 *
 * @returns {void}
 *
 * @example
 * // Set the scheduling algorithm to "FIFO"
 * simulator.setScheduler("FIFO");
 *
 * // Set the scheduling algorithm to "SJF"
 * simulator.setScheduler("SJF");
 */
    setScheduler(sch_str){
        this.schedulingAlgorithm = sch_str.toLowerCase();
        if(this.schedulingAlgorithm != "default"){
            showToast(`Scheduler set to ${sch_str}`)
        }
    }

/**
 * Checks whether the simulation is active.
 *
 * This method determines if the simulation is currently running or has 
 * executed any steps. It returns `true` if the simulation is either running 
 * or has executed at least one step; otherwise, it returns `false`.
 *
 * @returns {boolean} `true` if the simulation is active; otherwise, `false`.
 *
 * @example
 * // Check if the simulation is active
 * const isActive = simulator.isOn();
 * console.log(`Simulation is ${isActive ? "active" : "inactive"}.`);
 */
    isOn(){
        if(this.totalSteps == 0 && this.isRunning == false){
            return false;
        }
        return true;
    }


    /**
     * Calculates the CPU throughput of the simulation.
     *
     * This method computes the number of processes terminated per 1000 simulation steps.
     * The result is returned as a string formatted to three decimal places. If no steps
     * have been executed, the throughput is `0`.
     *
     * @returns {string} The CPU throughput as a string formatted to three decimal places.
     *
     * @example
     * // Get the CPU throughput
     * const throughput = simulator.getCpuThroughput();
     * console.log(`CPU Throughput: ${throughput} processes per 1000 steps`);
     */
    getCpuThroughput() {
        const terminatedCount = this.processList.filter(p => p.state === "Terminated").length;
        if (this.totalSteps === 0) {
            return 0;
        }
        return (terminatedCount / (this.totalSteps / 1000)).toFixed(3);
    }
    
    /**
 * Calculates the CPU usage percentage during the simulation.
 *
 * This method computes the percentage of total simulation steps where the CPU
 * was actively running a process. The result is rounded down to the nearest integer.
 *
 * @returns {number} The CPU usage percentage as an integer value.
 *
 * @example
 * // Get the CPU usage percentage
 * const cpuUsage = simulator.getCpuUsage();
 * console.log(`CPU Usage: ${cpuUsage}%`);
 */
    getCpuUsage(){
        return Math.floor((this.cpuRunningFrames / this.totalSteps) * 100)
    }
/**
 * Retrieves the Gantt chart data.
 *
 * This method returns the Gantt chart data, which contains the sequence of process IDs
 * representing the order and duration of processes executed during the simulation.
 *
 * @returns {Array<number|string>} An array of process IDs recorded in the Gantt chart.
 *
 * @example
 * // Get the Gantt chart data and display it
 * const ganttData = simulator.getGanttData();
 * console.log("Gantt Chart Data:", ganttData);
 */
    getGanttData(){
        return this.ganttData;
    }
/**
 * Increments the execution time and updates the states of processes.
 *
 * This method performs the following:
 * - Increases the total simulation steps (`totalSteps`).
 * - Tracks whether any processes are in the "Ready" state.
 * - Updates the execution time, state, and attributes of each process based on its current state.
 * - Records Gantt chart data for running processes.
 * - Manages transitions of processes, including handling "Running", "Waiting", "Ready", "Unwait", and "Terminated" states.
 * - Tracks CPU utilization and increments counters for unused CPU frames.
 *
 * @returns {void}
 *
 * @example
 * // Increment execution time and update process states
 * simulator.incrementRunningExecutionTime();
 */
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
                process.age++;
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
    /**
 * Starts the simulation.
 *
 * This method begins the simulation process. If a valid scheduling algorithm 
 * is selected, it resets the simulation state without displaying a toast 
 * notification, initializes timers, and executes the first simulation step.
 * If no scheduling algorithm is selected, it displays a notification to the user.
 *
 * @returns {void}
 *
 * @example
 * // Start the simulation
 * simulator.run();
 */
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
/**
 * Executes a single step of the simulation manually.
 *
 * This method forces the simulation to execute one step, regardless of its
 * current state. If the step does not progress the simulation (returns `false`),
 * the waiting queue is polled to check for processes that may transition to a
 * ready state. Displays a toast notification upon completion of the step.
 *
 * @returns {void}
 *
 * @example
 * // Manually execute one step in the simulation
 * simulator.forceStep();
 */

    forceStep(){
        this.isRunning = true;

        if(this.step() == false){
            this.pollWaitingQueue()
        }
        showToast("Stepped...");
        this.isRunning = false;
    }
/**
 * Forces the simulation to run until completion.
 *
 * This method continuously executes simulation steps and processes the waiting
 * queue until all processes are terminated and the simulation completes.
 *
 * @returns {void}
 *
 * @example
 * // Force the simulation to complete all steps
 * simulator.forceComplete();
 */
    forceComplete(){
        while(this.isRunning){
            this.step();
            this.pollWaitingQueue()
        }
    }
/**
 * Resets the simulation to its initial state.
 *
 * This method stops the simulation, clears timers, and resets all tracked
 * simulation data. The state of all processes is reinitialized, and the
 * simulation is prepared for a fresh start. Optionally displays a toast
 * notification to indicate the reset.
 *
 * @param {boolean} displayToast - If `true`, a toast notification will be displayed after the reset.
 *
 * @returns {void}
 *
 * @example
 * // Reset the simulation and show a toast notification
 * simulator.reset(true);
 *
 * // Reset the simulation without showing a notification
 * simulator.reset(false);
 */
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
/**
 * Executes a single simulation step.
 *
 * This method simulates one time unit in the process scheduling simulation.
 * It performs the following actions:
 * 1. Checks if all processes are terminated to stop the simulation.
 * 2. Handles CPU interrupts based on the interrupt frequency.
 * 3. Updates process states, transitions new processes to "Ready", and decrements delays.
 * 4. Determines process priorities and executes the scheduling algorithm.
 * 5. Ensures the simulation continues or ends as appropriate.
 *
 * @returns {boolean} Returns `true` if a valid scheduling step occurs; otherwise, `false`.
 *
 * @example
 * // Execute a single step in the simulation
 * const success = simulator.step();
 * if (!success) {
 *     console.log("No further steps can be taken.");
 * }
 */
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
            console.log(this.processList)
            if (this.schedulingAlgorithm == "fifo") {
                for(let p of this.processList){
                    p.priority = p.time_to_arrival;
                }
            }else if(this.schedulingAlgorithm == "sjf"){
                for(let p of this.processList){
                    p.priority = (p.required_execution_time - p.execution_time);
                }
            }else if(this.schedulingAlgorithm == "ljf"){
                for(let p of this.processList){
                    p.priority = (-1 * p.required_execution_time);
                }
            }else if(this.schedulingAlgorithm == "srt"){
                for(let p of this.processList){
                    p.priority = (p.required_execution_time - p.execution_time);
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
/**
 * Executes a scheduling step based on process priority.
 *
 * This method selects the highest-priority process that is eligible to run
 * (not in "Waiting", "Terminated", or "None" states). If the aging checkbox
 * is enabled, the priority is adjusted using an aging factor to prevent starvation.
 * The selected process is transitioned to the appropriate state ("Ready" or "Running").
 *
 * @returns {boolean} Returns `true` if a process transitions successfully, otherwise `false`.
 *
 * @example
 * // Perform a priority-based scheduling step
 * const success = simulator.priority_step();
 * if (!success) {
 *     console.log("No valid processes to run.");
 * }
 */
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

        if($("#agingCheckbox").checked){
            const agingFactorInput = $("#agingFactor");

            let age_factor = parseInt(agingFactorInput.value);
            if (isNaN(age_factor) || age_factor <= 0) {
                age_factor = 10; // Default value
            }
            age_factor = age_factor / 100;
            eligibleProcesses.sort((a, b) => (a.priority - (a.age * age_factor)) - (b.priority - (b.age * age_factor)));
        }else{
            eligibleProcesses.sort((a, b) => a.priority - b.priority);
        }


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
        }

        if(old_state == currentProcess.state){
            console.error("A valid process could not move !!!");
        }
        return ret_val;
    }
    

/**
 * Checks the waiting queue to determine if any processes are ready to resume.
 *
 * This method iterates over the list of processes and randomly determines 
 * if a process in the "Waiting" state becomes "Unwait" (ready to resume execution). 
 * It logs any processes that transition to the "Unwait" state and updates the process states.
 *
 * @returns {boolean} Returns `true` if at least one process transitioned from "Waiting" 
 * to "Unwait", otherwise `false`.
 *
 * @example
 * // Periodically poll the waiting queue
 * const result = simulator.pollWaitingQueue();
 * if (result) {
 *     console.log("Some processes are now ready to execute.");
 * }
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

    /**
 * Pauses the simulation.
 *
 * This method stops the simulation by clearing the active timers and
 * setting the `isRunning` flag to `false`. If the simulation is already
 * paused, it logs a message and takes no further action.
 *
 * @returns {void}
 *
 * @example
 * // Pause the simulation
 * simulator.pause();
 */
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
    /**
 * Starts or resumes the simulation.
 *
 * This method sets the `isRunning` flag to `true` and resets the timers
 * to begin or continue the simulation. It ensures that the simulation
 * processes are executed at the appropriate intervals based on the current speed.
 *
 * @returns {void}
 *
 * @example
 * // Start or resume the simulation
 * simulator.play();
 */
    play(){
        this.isRunning = true;
        this.resetTimers();
    }

/**
 * Resets the simulation timers.
 *
 * This method clears any existing intervals and sets up new intervals
 * to manage the periodic execution of `pollWaitingQueue` and `step` functions.
 * The intervals are adjusted based on the current simulation speed.
 *
 * @returns {void}
 *
 * @example
 * // Reset the timers after changing the simulation speed
 * simulator.resetTimers();
 */
    resetTimers(){
        clearInterval(this.intervalId);
        clearInterval(this.intervalIdWait);

        this.intervalIdWait = setInterval(() => this.pollWaitingQueue(), 1000 / this.speed);
        this.intervalId = setInterval(() => this.step(), 1000 / this.speed);
    }
/**
 * Handles a CPU interrupt to preempt the currently running process.
 *
 * If the preemption checkbox is checked in the user interface, this method
 * changes the state of any running processes to "Ready". This simulates
 * a CPU interrupt forcing a context switch.
 *
 * @returns {void}
 *
 * @example
 * // Simulate an interrupt to preempt running processes
 * simulator.interrupt();
 */
    interrupt(){
        if($("#preemptionCheckbox").checked){
            for(let p of this.processList){
                if(p.state == "Running"){
                    p.state = "Ready";
                }
            }
        }
    }
    /**
     * Sets the speed of the simulation.
     *
     * This method updates the simulation speed based on the provided value. The speed
     * value is squared to determine the actual simulation speed multiplier. If a valid
     * scheduling algorithm is selected, the simulation timers are reset to apply the new speed.
     *
     * @param {number} speedValue - The speed value to set. Must be greater than zero.
     *
     * @returns {void}
     *
     * @example
     * // Set the simulation speed to 2 (resulting in a speed multiplier of 4)
     * simulator.setSpeed(2);
     *
     * @throws Will log an error if `speedValue` is less than or equal to zero.
     */
    setSpeed(speedValue) {
        if (speedValue <= 0) {
            console.log("simulation.js: Speed value must be greater than zero.");
            return;
        }
        this.speed = speedValue * speedValue;
        if(this.schedulingAlgorithm != "default"){
            this.resetTimers();
        }
        
        console.log(`Simulation speed set to ${speedValue}.`);
    }
    /**
     * Retrieves information about a process with the specified ID.
     *
     * This method searches the process list for a process with the given ID.
     * If a matching process is found, it returns the process object containing
     * detailed information. If no process is found, it logs a message and returns `null`.
     *
     * @param {number|string} process_id - The unique identifier of the process to retrieve.
     * @returns {Object|null} The process object if found; otherwise, `null`.
     *
     * @example
     * const processInfo = simulator.getProcessInfo(1);
     * if (processInfo) {
     *     console.log("Process details:", processInfo);
     * } else {
     *     console.log("Process not found.");
     * }
     */
    getProcessInfo(process_id) {
        const process = this.processList.find(proc => proc.id === process_id);
        if (!process) {
            console.log(`simulation.js : Process with ID ${process_id} not found.`);
            return null;
        }
        return process;
    }
}
