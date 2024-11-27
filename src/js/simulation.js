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
        if (!this.schedulingAlgorithm || this.processList.length === 0) {
            console.error("Simulator is not properly initialized.");
            return;
        }
        if (this.isRunning) {
            console.log("Simulation is already running.");
            return;
        }

        this.isRunning = true;
        console.log("Simulation started.");

        this.intervalId = setInterval(() => {
            const currentProcess = this.processList[this.currentProcessIndex];
            console.log(`Running process: ${currentProcess.name}`);
            this.currentProcessIndex = this.schedulingAlgorithm(this.processList, this.currentProcessIndex);
        }, 1000 / this.speed);
    }

    /**
     * Pauses the simulation.
     */
    pause() {
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
     * Toggles or sets whether to show process names in logs.
     * @param {boolean} bool - True to show process names, false to hide.
     */
    showProcessNames(bool) {
        this.showNames = bool;
        console.log(`Show process names: ${bool}`);
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
