export function doughnutChartOptions() {
    return {
        maintainAspectRatio: false
    };
}

export function makeDougnutChartData() {
    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    return data;
}

export function lineChartOptions() {
    return {
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 50,
                    min: 0,
                    stepSize: 10
                },
                scaleLabel: {
                    display: true,
                    labelString: 'No. of Alerts'
                }
            }]
        }
    };
}

export function makeLineChartData() {
    const data = {
        labels: ['01/10', '01/11', '01/12', '01/13', '01/14', '01/15', '01/16'],
        datasets: [
            {
                label: 'Alerts Received',
                data: [23, 10, 20, 10, 10, 13, 20],
                borderColor: 'rgb(250,128,114)',
                pointBackgroundColor: 'rgb(250,128,114)',
                hoverBackgroundColor: '#fff',
                fill: false,
                borderWidth: 1,
                tension: 0
            },
            {
                label: 'Alerts Resolved',
                data: [13, 25, 10, 30, 5, 10, 20],
                borderColor: 'rgb(50,205,50)',
                pointBackgroundColor: 'rgb(50,205,50)',
                hoverBackgroundColor: '#fff',
                fill: false,
                borderWidth: 1,
                tension: 0
            }
        ]
    };

    return data;
}
