

function generateRGB(id) {
    id = id + 1;
    const red = (id * 137) % 256;
    const green = (id * 149) % 256; 
    const blue = (id * 157) % 256; 

    return `rgb(${red},${green},${blue})`;
}

function display_results(simulator_obj) {
    console.log("Displaying results window...");
    const div = document.querySelector("#generatedResults");
    
    const ganttData = simulator_obj.getGanttData(); // Array of processes running each step
    let data = [];

    // Preprocessing Gantt data to extract segments of continuous execution
    let segments = [];
    let currentProcess = ganttData[0];
    let startTime = 0;

    for (let i = 1; i <= ganttData.length; i++) {
        if (i === ganttData.length || ganttData[i] !== currentProcess) {
            // Save the segment details
            segments.push({
                process: currentProcess,
                startTime: startTime,
                endTime: i - 1,
                duration: i - startTime
            });

            // Update to the next segment
            currentProcess = ganttData[i];
            startTime = i;
        }
    }

    // Create traces for each segment
    for (let segment of segments) {
        const processInfo = simulator_obj.getProcessInfo(segment.process);
        let trace = {
            x: [segment.duration],
            y: [simulator_obj.schedulingAlgorithm],
            name: `${processInfo.name} (P${processInfo.id})`,
            orientation: 'h',
            marker: {
                color: generateRGB(segment.process), // Generate color based on the process
                width: 1
            },
            hoverinfo: 'text',
            text: [`Start: ${segment.startTime}, End: ${segment.endTime}`],
            type: 'bar'
        };
        data.push(trace);
    }

    // Define layout
    var layout = {
        title: {
            text: 'Gantt Chart'
        },
        barmode: 'stack',
        xaxis: {
            title: 'Time',
            showgrid: true
        },
        yaxis: {
            title: 'Processes',
            showgrid: true
        },
        responsive: true
    };

    // Plot the chart
    //Plotly.newPlot('ganttChart', data, layout);

    generateStateTraces(simulator_obj);
}
function generateStateTraces(simulator_obj) {
    // Initialize arrays for each process state
    let newTimes = [];
    let readyTimes = [];
    let runningTimes = [];
    let waitingTimes = [];

    // Populate arrays with data from process list
    for (let p of simulator_obj.getProcessList()) {
        newTimes.push(p.new_time);
        readyTimes.push(p.ready_time);
        runningTimes.push(p.execution_time);
        waitingTimes.push(p.wait_time);
    }

    // Create traces for each state
    const NewTrace = {
        y: newTimes,
        type: 'box',
        name: 'New Times'
    };

    const ReadyTrace = {
        y: readyTimes,
        type: 'box',
        name: 'Ready Times'
    };

    const RunningTrace = {
        y: runningTimes,
        type: 'box',
        name: 'Execution Times'
    };

    const WaitingTrace = {
        y: waitingTimes,
        type: 'box',
        name: 'Waiting Times'
    };

    // Combine traces into an array for plotting
    const data = [NewTrace, ReadyTrace, RunningTrace, WaitingTrace];

    // Define layout for visualization
    const layout = {
        title: 'Process State Times Distribution',
        yaxis: {
            title: 'Time',
            showgrid: true
        },
        xaxis: {
            title: 'State',
            showgrid: true
        },
        boxmode: 'group' // Group boxes by state
    };

    // Render the plot
    //Plotly.newPlot('boxPlot', data, layout);
    generateSchedulingCriteriaTraces(simulator_obj)
}

function generateSchedulingCriteriaTraces(simulator_obj) {
    // Initialize arrays for each scheduling criterion
    let arrivalTimes = [];
    let burstTimes = [];
    let completionTimes = [];
    let turnaroundTimes = [];
    let waitingTimes = [];
    let responseTimes = [];

    // Populate arrays with data from the process list
    for (let p of simulator_obj.getProcessList()) {
        // Provided metrics
        let arrivalTime = p.delay_time + p.new_time;
        arrivalTimes.push(arrivalTime);

        let burstTime = p.required_execution_time;
        burstTimes.push(burstTime);

        // Derived metrics
        // Completion Time = delay_time + execution_time
        let completionTime = p.delay_time + p.execution_time;
        completionTimes.push(completionTime);

        // Turnaround Time = Completion Time - Arrival Time
        let turnaroundTime = completionTime - arrivalTime;
        turnaroundTimes.push(turnaroundTime);

        // Waiting Time = Turnaround Time - Burst Time
        let waitingTime = turnaroundTime - burstTime;
        waitingTimes.push(waitingTime);

        // Response Time = First Response Time - Arrival Time
        let responseTime = (p.first_response_time || 0) - arrivalTime; // Use 0 if `first_response_time` is undefined
        responseTimes.push(responseTime);
    }

    // Create traces for each scheduling criterion
    const arrivalTrace = {
        y: arrivalTimes,
        type: 'box',
        name: 'Arrival Times'
    };

    const burstTrace = {
        y: burstTimes,
        type: 'box',
        name: 'Burst Times'
    };

    const completionTrace = {
        y: completionTimes,
        type: 'box',
        name: 'Completion Times'
    };

    const turnaroundTrace = {
        y: turnaroundTimes,
        type: 'box',
        name: 'Turnaround Times'
    };

    const waitingTrace = {
        y: waitingTimes,
        type: 'box',
        name: 'Waiting Times'
    };

    const responseTrace = {
        y: responseTimes,
        type: 'box',
        name: 'Response Times'
    };

    // Combine traces into an array for plotting
    const data = [arrivalTrace, burstTrace, completionTrace, turnaroundTrace, waitingTrace, responseTrace];

    // Define layout for visualization
    const layout = {
        title: 'CPU Scheduling Criteria Distribution',
        yaxis: {
            title: 'Time',
            showgrid: true
        },
        xaxis: {
            title: 'Criteria',
            showgrid: true
        },
        boxmode: 'group' // Group boxes by criteria
    };

    // Render the plot
    Plotly.newPlot('boxPlot2', data, layout);
}

