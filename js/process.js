/**
 * Represents an operating system (OS) process.
 *
 * @constructor
 * @param {number|string} id - A unique identifier for the process.
 * @param {string} name - The name of the process for identification purposes.
 * @param {string} state - The current state of the process (e.g., "Running", "Waiting", "Ready", "Terminated").
 * @param {number} priority - The priority level of the process; higher values indicate higher priority.
 * @param {boolean} is_io - Indicates whether the process is I/O-bound (`true`) or CPU-bound (`false`).
 * @param {number} running_chance - A probability (between 0 and 1) representing the likelihood of the process executing 
 *                                  when given the opportunity, instead of waiting for I/O.
 * @param {number} required_execution_time - The total CPU time required for the process to complete.
 *
 * @example
 * const process1 = new Process(101, "ProcessA", "Ready", 5, true, 0.7, 50);
 * console.log(process1);
 * // Output:
 * // {
 * //   id: 101,
 * //   name: "ProcessA",
 * //   state: "Ready",
 * //   priority: 5,
 * //   is_io: true,
 * //   running_chance: 0.7,
 * //   required_execution_time: 50
 * // }
 */
function Process(id, name, state, priority, is_io, running_chance, required_execution_time) {
    this.id = id;                 // Assign the id
    this.name = name;             // Assign the name
    this.state = state;           // Assign the state
    this.priority = priority;     // Assign the priority
    this.is_io = is_io;           // Assign the is_io (boolean indicating I/O process)
    this.running_chance = running_chance; // Assign the running_chance
    this.execution_time = 0;
    this.required_execution_time = required_execution_time;
}
