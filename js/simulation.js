

_STATE_IDS = [
    ""
]


class Simulator {
    constructor() {
        this.processList = []; // Stores the list of processes
        this.schedulingAlgorithm = null; // Stores the scheduling algorithm
        this.isRunning = false; // Indicates if the simulation is running
        this.speed = 1; // Default simulation speed
        this.showNames = true; // Default to showing process names
        this.currentProcessIndex = 0; // Keeps track of the current process
        this.intervalId = null; // Stores the interval ID for the simulation
    }

    /**
     * Initializes the simulator with a process list and scheduling algorithm.
     * @param {Array} process_list - List of processes.
     * @param {Function} scheduling_algorithm - A function implementing the scheduling algorithm.
     */
    initialize(process_list, scheduling_algorithm, div_for_scheduler) {
        this.processList = process_list;
        this.schedulingAlgorithm = scheduling_algorithm;
        this.isRunning = false;
        this.currentProcessIndex = 0;
        console.log("Simulator initialized with process list and scheduling algorithm.");
    }

    /**
     * Starts or resumes the simulation.
     */
    run() {
        showToast("Simulation running...")
        this.isRunning = true;
        console.log("Simulation started.");

        if(this.schedulingAlgorithm == "FIFO"){
            this.intervalId = setInterval(() => this.fifo_step(), 1000 * this.speed);
        }else{
            this.intervalId = setInterval(() => this.step(), 1000 * this.speed);
        }
    }

    /**
     * step function
     */
    step(){
        const currentProcess = this.processList[this.currentProcessIndex];
        console.log(`Running process: ${currentProcess.name}`);
    }

    /**
     * step for FIFO test algorithm
     */
    fifo_step(){
        const currentProcess = this.processList[this.currentProcessIndex];
        console.log(`Running process: ${currentProcess.name}`);
    }

    /**
     * Pauses the simulation.
     */
    pause() {
        showToast("Simulation paused...")
        if (!this.isRunning) {
            console.log("Simulation is already paused.");
            return;
        }
        clearInterval(this.intervalId);
        this.isRunning = false;
        console.log("Simulation paused.");
    }

    /**
     * Sets the simulation speed.
     * @param {number} speedValue - The new speed value (1 is normal speed).
     */
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

    /**
     * Retrieves information about a process by its ID.
     * @param {number} process_id - The ID of the process.
     * @returns {Object|null} - The process info, or null if not found.
     */
    getProcessInfo(process_id) {
        const process = this.processList.find(proc => proc.id === process_id);
        if (!process) {
            console.error(`Process with ID ${process_id} not found.`);
            return null;
        }
        return process;
    }
}
