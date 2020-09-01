---
---

const chartjs = window.Chart.min;

window.onload = function() {
    generateGraphs();
};

function generateGraphs() {
    // @ts-ignore
    const data = {{ site.data.charts | jsonify }};
    const commits = data['commits']

    const avgFPSData      = data['AverageFPS'];
    const avgFPSTooltips  = createTooltips(avgFPSData['commitIDs'], commits);
    let ctx = document.getElementById('avgFPSChart').getContext('2d');
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

    const memUsageData        = data['PeakMemoryUsage'];
    const memUsageTooltips    = createTooltips(memUsageData['commitIDs'], commits);
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
        let localTimestamp = new Date(commit['timestamp']).toString();

        tooltips.push(`${commit['message']}\n${localTimestamp}`)
    }

    return tooltips;
}
