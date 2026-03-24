let countdown;
let timeLeft = 10;

const sosButton = document.getElementById('sosButton');
const sosText = document.getElementById('sosText');
const timerDisplay = document.getElementById('timerDisplay');
const cancelBtn = document.getElementById('cancelBtn');
const callingBanner = document.getElementById('callingBanner');
const initialPrompt = document.getElementById('initialPrompt');
const robotStatus = document.getElementById('robotStatus');

function startEmergencyTimer() {
    if (countdown) return;

    timeLeft = 10;
    sosText.classList.add('hidden');
    timerDisplay.classList.remove('hidden');
    timerDisplay.innerText = timeLeft;
    cancelBtn.classList.remove('hidden');
    
    // Change UI state to "Critical"
    sosButton.classList.replace('bg-red-600', 'bg-slate-900');
    robotStatus.innerHTML = `
        <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span class="text-xs font-medium text-red-600">CareWellGo: EMERGENCY MODE</span>
    `;

    countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            connectToOperator();
        }
    }, 1000);
}

function connectToOperator() {
    clearInterval(countdown);
    countdown = null;
    
    initialPrompt.classList.add('hidden');
    callingBanner.classList.remove('hidden');
}

function cancelEmergency() {
    clearInterval(countdown);
    countdown = null;
    resetUI();
}

function endCall() {
    callingBanner.classList.add('hidden');
    initialPrompt.classList.remove('hidden');
    resetUI();
}

function resetUI() {
    timeLeft = 10;
    sosText.classList.remove('hidden');
    timerDisplay.classList.add('hidden');
    cancelBtn.classList.add('hidden');
    sosButton.classList.replace('bg-slate-900', 'bg-red-600');
    robotStatus.innerHTML = `
        <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span class="text-xs font-medium text-slate-600">CareWellGo Unit: Online</span>
    `;
}