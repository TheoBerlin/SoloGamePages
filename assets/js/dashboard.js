---
---

const chartjs = window.Chart.min;

window.onload = function() {
    generateGraphs();
};

function generateGraphs() {
    // @ts-ignore
    let data = {{ site.data.charts | jsonify }};
    let commits = data['commits']

    let avgFPSData      = data['AverageFPS'];
    let avgFPSTooltips  = createTooltips(avgFPSData['commitIDs'], commits);
    var ctx = document.getElementById('avgFPSChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: avgFPSData['commitIDs'],
            datasets: [
                {
                    data: avgFPSData['vulkan'],
                    label: 'Vulkan',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    data: avgFPSData['directx11'],
                    label: 'DirectX 11',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Average FPS'
            },
            responsive: true,
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 77,
                        minRotation: 77
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            tooltips: {
                mode: 'index',
                callbacks: {
                    afterTitle: function(tooltipItem, _) {
                        return avgFPSTooltips[tooltipItem[0].index];
                    }
                }
            }
        }
    });

    let memUsageData        = data['PeakMemoryUsage'];
    let memUsageTooltips    = createTooltips(memUsageData['commitIDs'], commits);
    ctx = document.getElementById('peakMemUsg').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: memUsageData['commitIDs'],
            datasets: [
                {
                    data: memUsageData['vulkan'],
                    label: 'Vulkan',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    data: memUsageData['directx11'],
                    label: 'DirectX 11',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Peak Memory Usage (MB)'
            },
            responsive: true,
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 77,
                        minRotation: 77
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            tooltips: {
                mode: 'index',
                callbacks: {
                    afterTitle: function(tooltipItem, _) {
                        return memUsageTooltips[tooltipItem[0].index];
                    }
                }
            }
        }
    });
}

function createTooltips(commitIDs, commitData) {
    let tooltips = [];
    for (commitID of commitIDs) {
        let commit = commitData[commitID];
        console.log(Date.parse(commit['timestamp']));
        let localTimestamp = new Date(commit['timestamp']).toString();
        console.log(localTimestamp);

        tooltips.push(`${commit['message']}\n${localTimestamp}`)
    }

    return tooltips;
}
