export function doughnutChartOptions() {
    return {
        maintainAspectRatio: false,
        cutoutPercentage: 70,
        aspectRatio: 1,
        legend: {
            display: false
        }
    };
}

export function makeDougnutChartData() {
    const data = {
        labels: ['23%', '62%', '15%'],
        datasets: [
            {
                label: '# of Votes',
                data: [23, 62, 15],
                backgroundColor: [
                    '#d68b5c',
                    '#3485d5',
                    '#f3f3f3'
                ],
                borderWidth: 0
            }
        ],
        text: '70 ALERTS'
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
        },
        legend: {
            display: false
            // align: 'end',
            // labels: {
            //     boxWidth: 3,
            //     usePointStyle: true
            // }
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
                borderColor: '#d68b5c',
                pointBackgroundColor: '#d68b5c',
                hoverBackgroundColor: '#fff',
                fill: false,
                borderWidth: 2,
                pointRadius: 1,
                tension: 0
            },
            {
                label: 'Alerts Resolved',
                data: [13, 25, 10, 30, 5, 10, 20],
                borderColor: '#9ab87a',
                pointBackgroundColor: '#9ab87a',
                hoverBackgroundColor: '#fff',
                fill: false,
                borderWidth: 2,
                pointRadius: 1,
                tension: 0
            }
        ]
    };

    return data;
}

export function makeAssignedAlertsData() {
    const data = [
        {
            id: 1,
            name: 'Gergana Tsoneva',
            assignedAlerts: 23
        },
        {
            id: 2,
            name: 'Darren Hibbitt',
            assignedAlerts: 19
        },
        {
            id: 3,
            name: 'Mark Thomson',
            assignedAlerts: 24
        },
        {
            id: 4,
            name: 'Unassigned',
            assignedAlerts: 4
        }
    ];

    return data;
}

export function makeBehaviourTypesData() {
    const data = [
        {
            id: 1,
            label: 'Insider Trading',
            assignedAlerts: 12
        },
        {
            id: 2,
            label: 'Front Running',
            assignedAlerts: 8
        },
        {
            id: 3,
            label: 'Marking the Close',
            assignedAlerts: 15
        },
        {
            id: 4,
            label: 'Flash Execution / Order',
            assignedAlerts: 3
        },
        {
            id: 5,
            label: 'Away from the Market',
            assignedAlerts: 3
        },
        {
            id: 6,
            label: 'High Volume',
            assignedAlerts: 9
        },
        {
            id: 7,
            label: 'High Order Count',
            assignedAlerts: 4
        },
        {
            id: 8,
            label: 'Large Order',
            assignedAlerts: 6
        }
    ];

    return data;
}

export function makeStatusLevelAlertsData() {
    const data = [
        {
            id: 1,
            label: 'Open',
            color: 'bg-open',
            alerts: 30
        },
        {
            id: 2,
            label: 'In Review',
            color: 'bg-review',
            alerts: 25
        },
        {
            id: 3,
            label: 'Resolved',
            color: 'bg-resolve',
            alerts: 40
        },
        {
            id: 4,
            label: 'Done',
            color: 'bg-done',
            alerts: 15
        }
    ];

    return data;
}
