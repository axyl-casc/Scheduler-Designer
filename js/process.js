/**
 * Represents a process in the simulation.
 *
 * A `Process` object contains information about an individual process, including its 
 * identity, state, priority, execution details, and metrics for simulation tracking.
 *
 * @param {number|string} id - The unique identifier for the process.
 * @param {string} name - The name of the process.
 * @param {string} state - The initial state of the process (e.g., "New", "Ready").
 * @param {number} priority - The priority level of the process (lower value = higher priority).
 * @param {boolean} is_io - Indicates whether the process is an I/O-bound process.
 * @param {number} running_chance - The probability that the process continues running in the current cycle.
 * @param {number} required_execution_time - The total time the process needs for execution.
 * @param {number} delay_time - The time until the process transitions to the "New" state.
 */
function Process(id, name, state, priority, is_io, running_chance, required_execution_time, delay_time) {
    this.id = id;                 // Assign the id
    this.name = name;             // Assign the name
    this.state = state;           // Assign the state
    this.priority = priority;     // Assign the priority
    this.is_io = is_io;           // Assign the is_io (boolean indicating I/O process)
    this.running_chance = running_chance; // Assign the running_chance
    this.execution_time = 0;
    this.required_execution_time = required_execution_time;
    this.wait_time = 0;
    this.ready_time = 0;
    this.new_time = 0;
    this.time_of_term = -1;
    this.first_execution_time = -1;
    this.delay_time = delay_time; // time until the process arrives in the new state
    this.time_to_arrival = delay_time;
    this.age = 0;
}
