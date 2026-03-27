let Countdown_Timer;
let Time_Left = 10;

const El = {
    Sos_Btn: () => document.getElementById('Sos_Btn'),
    Sos_Content: () => document.getElementById('Sos_Content'),
    Timer_Display: () => document.getElementById('Timer_Display'),
    Cancel_Btn: () => document.getElementById('Cancel_Btn'),
    Calling_Banner: () => document.getElementById('Calling_Banner'),
    Initial_Prompt: () => document.getElementById('Initial_Prompt'),
    Robot_Status: () => document.getElementById('Robot_Status'),
    Online_Dot: () => document.querySelector('.Online_Dot'),
    Online_Text: () => document.querySelector('.Online_Text')
};

function Load_Patient_Bio() {
    const DB = DB_Get();
    const P = DB.Patient;
    const Map = {
        'Bio_Blood': P.Blood_Group,
        'Bio_Allergies': P.Allergies,
        'Bio_Contact': P.Emergency_Contact,
        'Bio_ID': P.ID,
        'Bio_Name': P.Name
    };
    Object.entries(Map).forEach(([Id, Val]) => {
        const El_Ref = document.getElementById(Id);
        if (El_Ref) El_Ref.textContent = Val || '—';
    });
}

function startEmergencyTimer() {
    if (Countdown_Timer) return;
    Time_Left = 10;

    const Sos = El.Sos_Content();
    const Timer = El.Timer_Display();
    const Cancel = El.Cancel_Btn();
    const Btn = El.Sos_Btn();

    if (Sos) Sos.style.display = 'none';
    if (Timer) { Timer.style.display = 'flex'; Timer.textContent = Time_Left; }
    if (Cancel) Cancel.style.display = 'flex';
    if (Btn) Btn.classList.replace('bg-red', 'bg-dark');

    Set_Status_Emergency();

    Countdown_Timer = setInterval(() => {
        Time_Left--;
        if (Timer) Timer.textContent = Time_Left;
        if (Time_Left <= 0) {
            clearInterval(Countdown_Timer);
            Countdown_Timer = null;
            Connect_Operator();
        }
    }, 1000);
}

function Connect_Operator() {
    const Banner = El.Calling_Banner();
    const Prompt = El.Initial_Prompt();
    if (Banner) Banner.classList.add('Visible');
    if (Prompt) Prompt.style.display = 'none';
}

function cancelEmergency() {
    clearInterval(Countdown_Timer);
    Countdown_Timer = null;
    Reset_SOS_UI();
    Show_Toast('Emergency Cancelled.', 'info');
}

function endCall() {
    const Banner = El.Calling_Banner();
    const Prompt = El.Initial_Prompt();
    if (Banner) Banner.classList.remove('Visible');
    if (Prompt) Prompt.style.display = 'block';
    Reset_SOS_UI();
}

function Reset_SOS_UI() {
    Time_Left = 10;
    const Sos = El.Sos_Content();
    const Timer = El.Timer_Display();
    const Cancel = El.Cancel_Btn();
    if (Sos) Sos.style.display = 'flex';
    if (Timer) { Timer.style.display = 'none'; Timer.textContent = '10'; }
    if (Cancel) Cancel.style.display = 'none';
    Set_Status_Online();
}

function Set_Status_Emergency() {
    const Dot = El.Online_Dot();
    const Text = El.Online_Text();
    if (Dot) { Dot.style.background = 'var(--Clr_Red)'; Dot.style.animation = 'none'; }
    if (Text) { Text.textContent = 'CareWellGo: EMERGENCY MODE'; Text.style.color = 'var(--Clr_Red)'; }
}

function Set_Status_Online() {
    const Dot = El.Online_Dot();
    const Text = El.Online_Text();
    if (Dot) { Dot.style.background = 'var(--Clr_Green)'; Dot.style.animation = ''; }
    if (Text) { Text.textContent = 'CareWellGo Unit: Online'; Text.style.color = ''; }
}

document.addEventListener('DOMContentLoaded', Load_Patient_Bio);
