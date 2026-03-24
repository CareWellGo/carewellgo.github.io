// Initialize Lucide Icons
lucide.createIcons();

const vitalsData = [
    { id: 'hr', label: 'Heart Rate', value: 72, unit: 'BPM', icon: 'heart', status: 'Normal' },
    { id: 'bp', label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: 'gauge', status: 'Normal' },
    { id: 'spo2', label: 'Oxygen Level', value: 98, unit: '%', icon: 'wind', status: 'Normal' },
    { id: 'temp', label: 'Body Temp', value: 36.6, unit: '°C', icon: 'thermometer', status: 'Normal' }
];

// Initialize Vitals UI
function initVitals() {
    const container = document.getElementById('vitals-container');
    const template = document.getElementById('vital-card-template');

    vitalsData.forEach(vital => {
        const clone = template.content.cloneNode(true);
        
        clone.querySelector('.vital-label').textContent = vital.label;
        clone.querySelector('.vital-value').id = `val-${vital.id}`;
        clone.querySelector('.vital-value').textContent = vital.value;
        clone.querySelector('.vital-unit').textContent = vital.unit;
        
        const iconEl = clone.querySelector('.vital-icon');
        iconEl.setAttribute('data-lucide', vital.icon);
        
        const statusTag = clone.querySelector('.vital-status-tag');
        statusTag.classList.add('status-normal');
        clone.querySelector('.status-text').textContent = vital.status;

        container.appendChild(clone);
    });
    lucide.createIcons();
}

// Start Scan Simulation
function startScanning() {
    const btn = document.getElementById('start-scan-btn');
    const loader = document.getElementById('scanning-loader');
    const progress = document.getElementById('scan-progress');
    const statusText = document.getElementById('scan-status-text');

    btn.classList.add('hidden');
    loader.classList.remove('hidden');
    statusText.textContent = "Scanning...";
    
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            completeScan();
        } else {
            width += 2;
            progress.style.width = width + '%';
        }
    }, 50);
}

function completeScan() {
    document.getElementById('start-scan-btn').classList.remove('hidden');
    document.getElementById('scanning-loader').classList.add('hidden');
    document.getElementById('scan-status-text').textContent = "Ready";
    document.getElementById('last-scan-time').textContent = new Date().toLocaleTimeString();
    
    // Simulate data updates
    updateVital('val-hr', Math.floor(Math.random() * (90 - 60) + 60));
    updateVital('val-spo2', Math.floor(Math.random() * (100 - 95) + 95));
}

function updateVital(id, newVal) {
    const el = document.getElementById(id);
    if (el) el.textContent = newVal;
}

// Charts Configuration
const ctxHeart = document.getElementById('heartRateChart').getContext('2d');
new Chart(ctxHeart, {
    type: 'line',
    data: {
        labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm'],
        datasets: [{
            label: 'BPM',
            data: [65, 62, 78, 85, 82, 75],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

const ctxActivity = document.getElementById('activityChart').getContext('2d');
new Chart(ctxActivity, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Steps',
            data: [8000, 12000, 9500, 10500, 13000, 7000, 5000],
            backgroundColor: '#2563eb',
            borderRadius: 8
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

document.addEventListener('DOMContentLoaded', initVitals);