---
---

const chartjs = window.Chart.min;

window.onload = function() {
    generateGraphs();
};

function generateGraphs() {
    // @ts-ignore
    const data = {{ site.data.charts | jsonify }};
    const commitsData = data['commits']

    let ctx = document.getElementById('avgFPSChart').getContext('2d');
    generateMultiAPIGraph(ctx, 'Average FPS', data['AverageFPS'], commitsData);

    ctx = document.getElementById('peakMemUsg').getContext('2d');
    generateMultiAPIGraph(ctx, 'Peak Memory Usage (MB)', data['PeakMemoryUsage'], commitsData);
}

function generateMultiAPIGraph(ctx, title, chartData, commitsData) {
    const tooltips = createTooltips(chartData['commitIDs'], commitsData);
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData['commitIDs'],
            datasets: [
                {
                    data: chartData['vulkan'],
                    label: 'Vulkan',
                    backgroundColor: getVkBackgroundColor(ctx),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    data: chartData['directx11'],
                    label: 'DirectX 11',
                    backgroundColor: getDx11BackgroundColor(ctx),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: title,
                fontSize: 20,
                fontColor: '#f4f4f4'
            },
            responsive: true,
            maintainAspectRatio: false,
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
            legend: {
                labels: {
                    fontColor: '#9a9a9a'
                }
            },
            onResize: onChartResize,
            tooltips: {
                mode: 'index',
                callbacks: {
                    afterTitle: function(tooltipItem, _) {
                        return tooltips[tooltipItem[0].index];
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

function getDx11BackgroundColor(ctx) {
    const dx11BackgroundColor = ctx.createLinearGradient(0, 0, 0, ctx.canvas.parentNode.clientHeight);
    dx11BackgroundColor.addColorStop(0, 'rgba(54, 162, 235, 0.2)');
    dx11BackgroundColor.addColorStop(1, 'rgba(54, 162, 235, 0.0)');

    return dx11BackgroundColor;
}

function getVkBackgroundColor(ctx) {
    const vkBackgroundColor = ctx.createLinearGradient(0, 0, 0, ctx.canvas.parentNode.clientHeight);
    vkBackgroundColor.addColorStop(0, 'rgba(255, 99, 132, 0.2)');
    vkBackgroundColor.addColorStop(1, 'rgba(255, 99, 132, 0.0)');

    return vkBackgroundColor;
}

function onChartResize(chart, _) {
    for (const dataset of chart.data.datasets) {
        if (dataset.label == 'Vulkan') {
            dataset.backgroundColor = getVkBackgroundColor(chart.ctx);
        } else {
            dataset.backgroundColor = getDx11BackgroundColor(chart.ctx);
        }
    }
}
