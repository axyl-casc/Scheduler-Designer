

function generateRGB(id) {
    id = id + 1;
    const red = (id * 137) % 256;
    const green = (id * 149) % 256; 
    const blue = (id * 157) % 256; 

    return `rgb(${red},${green},${blue})`;
}

function display_results(simulator_obj) {
    console.log("Displaying results window...");
    simulator_obj.play();
    simulator_obj.forceComplete()
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
            y: [""],
            name: `${processInfo.name} (P${processInfo.id})`,
            orientation: 'h',
            marker: {
                color: generateRGB(segment.process), // Generate color based on the process
                width: 1
            },
            hovertemplate: `
            <b>Process:</b> ${processInfo.name} (P${processInfo.id})<br>
            <b>Start Time:</b> ${segment.startTime}<br>
            <b>End Time:</b> ${segment.endTime}<br>
            <b>Duration:</b> ${segment.duration}<extra></extra>
        `,  // Hover template for displaying detailed information
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
            title: 'CPU Running Time',
            showgrid: true
        },
        yaxis: {
            title: 'Processes',
            showgrid: true
        },
        responsive: true
    };

    // Plot the chart
    Plotly.newPlot('ganttChart', data, layout);

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
        name: 'New State'
    };

    const ReadyTrace = {
        y: readyTimes,
        type: 'box',
        name: 'Ready State'
    };

    const RunningTrace = {
        y: runningTimes,
        type: 'box',
        name: 'Running State'
    };

    const WaitingTrace = {
        y: waitingTimes,
        type: 'box',
        name: 'Waiting State'
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
    Plotly.newPlot('boxPlot', data, layout);
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
        let arrivalTime = p.time_to_arrival + p.new_time;
        let burstTime = p.required_execution_time;
        let completionTime = p.ready_time+p.wait_time+p.new_time+p.execution_time+p.time_to_arrival;
        let turnaroundTime = completionTime - arrivalTime;
        let waitTime = turnaroundTime - burstTime;
        let responseTime = p.first_execution_time - arrivalTime;

        console.log("--------------\nCPU CRITERIA:")
        console.log(p);
        console.log(arrivalTime);
        console.log(burstTime);
        console.log(completionTime);
        console.log(turnaroundTime);
        console.log(waitTime);
        console.log(responseTime);
        console.log("--------------")

        arrivalTimes.push(arrivalTime);
        burstTimes.push(burstTime);
        completionTimes.push(completionTime);
        turnaroundTimes.push(turnaroundTime);
        waitingTimes.push(waitTime);
        responseTimes.push(responseTime);
    }

    // Create traces for each scheduling criterion
    const traces = [
        {
            y: arrivalTimes,
            type: 'box',
            name: 'Arrival Times'
        },
        {
            y: burstTimes,
            type: 'box',
            name: 'Burst Times'
        },
        {
            y: completionTimes,
            type: 'box',
            name: 'Completion Times'
        },
        {
            y: turnaroundTimes,
            type: 'box',
            name: 'Turnaround Times'
        },
        {
            y: waitingTimes,
            type: 'box',
            name: 'Waiting Times'
        },
        {
            y: responseTimes,
            type: 'box',
            name: 'Response Times'
        }
    ];

    // Define layout for visualization
    const layout = {
        title: 'CPU Scheduling Criteria Distribution',
        yaxis: {
            title: 'Time',
            showgrid: true
        },
        xaxis: {
            title: 'Criteria',
            showgrid: true,
            tickvals: [0, 1, 2, 3, 4, 5],
            ticktext: ['Arrival', 'Burst', 'Completion', 'Turnaround', 'Waiting', 'Response']
        },
        boxmode: 'group' // Group boxes by criteria
    };

    // Render the plot
    Plotly.newPlot('boxPlot2', traces, layout);

    additionalStats(simulator_obj);
}


function additionalStats(simulator_obj){
    const div = $("#additionalStats");
    div.innerHTML = "<br>";

    const cpu_util_div = document.createElement("p");
    let cpu_usage = simulator_obj.getCpuUsage();
    cpu_util_div.textContent = `CPU Utilization: ${cpu_usage}%`;
    div.appendChild(cpu_util_div);

    const cpu_through_div = document.createElement("p");
    let cpu_throughput = simulator_obj.getCpuThroughput();
    cpu_through_div.textContent = `CPU Throughput: ${cpu_throughput} processes per time unit`;
    div.appendChild(cpu_through_div);

}
