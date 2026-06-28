const ctx = document.getElementById('chart').getContext('2d');
let chart;

function createChart(labels, data1, data2) {
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'field1',
          data: data1,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.1)',
          tension: 0.2,
        },
        {
          label: 'field2',
          data: data2,
          borderColor: 'rgba(192,75,192,1)',
          backgroundColor: 'rgba(192,75,192,0.1)',
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: 'Time' },
        },
        y: {
          title: { display: true, text: 'Value' },
        },
      },
    },
  });
}

async function fetchData(limit = 200) {
  const res = await fetch(`/api/data?limit=${limit}`);
  const rows = await res.json();
  const labels = rows.map(r => r.ts);
  const d1 = rows.map(r => r.field1);
  const d2 = rows.map(r => r.field2);
  return { labels, d1, d2 };
}

let intervalId;

async function start() {
  const limitEl = document.getElementById('limit');
  const intervalEl = document.getElementById('interval');
  const applyBtn = document.getElementById('apply');

  async function tick() {
    try {
      const limit = parseInt(limitEl.value) || 200;
      const { labels, d1, d2 } = await fetchData(limit);
      createChart(labels, d1, d2);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  }

  applyBtn.addEventListener('click', () => {
    clearInterval(intervalId);
    tick();
    intervalId = setInterval(tick, Math.max(200, parseInt(intervalEl.value) || 2000));
  });

  // initial
  await tick();
  intervalId = setInterval(tick, Math.max(200, parseInt(intervalEl.value) || 2000));
}

start();
