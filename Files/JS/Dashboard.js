let Heart_Chart, Activity_Chart;

const Vital_Config = [
    { Id: 'hr', Label: 'Heart Rate', Unit: 'BPM', Icon: '❤️', Min: 60, Max: 90, Normal: [60, 85] },
    { Id: 'bp', Label: 'Blood Pressure', Unit: 'mmHg', Icon: '🩺', Fixed: '120/80', Normal: true },
    { Id: 'spo2', Label: 'Oxygen Level', Unit: '%', Icon: '💨', Min: 95, Max: 100, Normal: [95, 100] },
    { Id: 'temp', Label: 'Body Temp', Unit: '°C', Icon: '🌡️', Min: 36.0, Max: 37.5, Normal: [36, 37.5] }
];

function Rand(Min, Max) { return +(Min + Math.random() * (Max - Min)).toFixed(1); }

function Get_Status(Vital, Value) {
    if (Vital.Fixed) return 'Normal';
    const [Low, High] = Vital.Normal;
    if (Value < Low || Value > High) return Value > High ? 'Alert' : 'Warning';
    return 'Normal';
}

function Render_Vitals(Data) {
    const Grid = document.getElementById('Vitals_Grid');
    if (!Grid) return;
    Grid.innerHTML = Vital_Config.map(V => {
        const Val = V.Fixed || Data[V.Id];
        const Status = Get_Status(V, parseFloat(Val));
        const Tag_Class = Status === 'Normal' ? 'Tag_Normal' : Status === 'Warning' ? 'Tag_Warning' : 'Tag_Alert';
        return `
            <div class="Vital_Card Glass_Card">
                <div class="Vital_Card_Top">
                    <div class="Vital_Icon">${V.Icon}</div>
                    <span class="Status_Tag ${Tag_Class}">${Status}</span>
                </div>
                <div class="Vital_Label">${V.Label}</div>
                <div>
                    <span class="Vital_Value" id="Val_${V.Id}">${Val}</span>
                    <span class="Vital_Unit">${V.Unit}</span>
                </div>
            </div>`;
    }).join('');
}

function Render_Patient() {
    const DB = DB_Get();
    const P = DB.Patient;
    const Fields = ['Name', 'Age', 'Blood_Group', 'Allergies', 'Emergency_Contact', 'ID'];
    Fields.forEach(F => {
        const El = document.getElementById('Patient_' + F);
        if (El) El.textContent = P[F] || '—';
    });
    const Blood = document.getElementById('Patient_Blood_Group');
    if (Blood) Blood.className = 'Patient_Val Blood_Val';
}

function Render_History_Dash() {
    const DB = DB_Get();
    const List = document.getElementById('Vitals_History_List');
    if (!List) return;
    const Hist = DB.Vitals_History.slice(0, 5);
    if (Hist.length === 0) {
        List.innerHTML = '<div style="color:var(--Clr_Text_Muted);font-size:0.8rem;padding:12px 0;">No Scans Yet. Run A Diagnostic.</div>';
        return;
    }
    List.innerHTML = Hist.map(H => `
        <div class="History_Entry Glass_Card">
            <div class="History_Entry_Left">${new Date(H.Timestamp).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
            <div class="History_Entry_Right">HR: ${H.hr} BPM | O₂: ${H.spo2}%</div>
        </div>`).join('');
}

function Init_Charts() {
    const CD = { borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3 };
    const DB = DB_Get();
    const Hist = DB.Vitals_History.slice(0, 6).reverse();
    const Labels = Hist.length > 0 ? Hist.map(H => new Date(H.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : ['12am','4am','8am','12pm','4pm','Now'];
    const HR_Data = Hist.length > 0 ? Hist.map(H => H.hr) : [65, 72, 78, 85, 80, 75];
    const O2_Data = Hist.length > 0 ? Hist.map(H => H.spo2) : [97, 98, 98, 99, 97, 98];

    const Opts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#546e7a', font: { size: 11 } }, grid: { color: 'rgba(0,229,255,0.05)' } }, y: { ticks: { color: '#546e7a', font: { size: 11 } }, grid: { color: 'rgba(0,229,255,0.05)' } } } };

    const Ctx1 = document.getElementById('Heart_Chart');
    if (Ctx1) { if (Heart_Chart) Heart_Chart.destroy(); Heart_Chart = new Chart(Ctx1, { type: 'line', data: { labels: Labels, datasets: [{ ...CD, label: 'BPM', data: HR_Data, borderColor: '#ff1744', backgroundColor: 'rgba(255,23,68,0.08)' }] }, options: Opts }); }

    const Ctx2 = document.getElementById('Activity_Chart');
    if (Ctx2) { if (Activity_Chart) Activity_Chart.destroy(); Activity_Chart = new Chart(Ctx2, { type: 'bar', data: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ label: 'Steps', data: [8000,12000,9500,10500,13000,7000,5500], backgroundColor: 'rgba(0,229,255,0.2)', borderColor: 'var(--Clr_Cyan)', borderRadius: 6, borderWidth: 1 }] }, options: { ...Opts, plugins: { legend: { display: false } } } }); }
}

function Start_Scan() {
    const Btn = document.getElementById('Scan_Btn');
    const Progress = document.getElementById('Scan_Fill');
    const Label = document.getElementById('Scan_Label');
    const Status = document.getElementById('Scan_Status_Text');

    if (Btn) Btn.disabled = true;
    if (Status) Status.textContent = 'Scanning...';

    let W = 0;
    const Timer = setInterval(() => {
        W += 2;
        if (Progress) Progress.style.width = W + '%';
        if (Label) Label.textContent = W + '% Complete';
        if (W >= 100) {
            clearInterval(Timer);
            Complete_Scan();
            if (Btn) Btn.disabled = false;
            if (Status) Status.textContent = 'Ready';
        }
    }, 40);
}

function Complete_Scan() {
    const New_Vitals = { hr: Math.floor(Rand(62, 88)), spo2: Math.floor(Rand(95, 100)), temp: Rand(36.0, 37.4), bp: '120/80' };

    Render_Vitals(New_Vitals);
    DB_Add_Vital(New_Vitals);
    Render_History_Dash();
    Init_Charts();

    const Time_El = document.getElementById('Last_Scan_Time');
    if (Time_El) Time_El.textContent = new Date().toLocaleTimeString();

    Show_Toast('Diagnostic Scan Complete. Vitals Updated.', 'success');
}

function Open_Edit_Modal() { document.getElementById('Edit_Modal').classList.add('Visible'); }
function Close_Edit_Modal() { document.getElementById('Edit_Modal').classList.remove('Visible'); }

function Save_Patient() {
    const Fields = ['Name', 'Age', 'Blood_Group', 'Allergies', 'Emergency_Contact', 'Location'];
    const Data = {};
    Fields.forEach(F => {
        const El = document.getElementById('Edit_' + F);
        if (El) Data[F] = El.value.trim();
    });
    DB_Update_Patient(Data);
    Render_Patient();
    Close_Edit_Modal();
    Show_Toast('Patient Profile Saved.', 'success');
}

function Prefill_Edit_Modal() {
    const DB = DB_Get();
    const P = DB.Patient;
    ['Name', 'Age', 'Blood_Group', 'Allergies', 'Emergency_Contact', 'Location'].forEach(F => {
        const El = document.getElementById('Edit_' + F);
        if (El) El.value = P[F] || '';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const Vitals = { hr: 72, spo2: 98, temp: 36.6 };
    Render_Vitals(Vitals);
    Render_Patient();
    Render_History_Dash();
    Init_Charts();

    const Edit_Btn = document.getElementById('Edit_Patient_Btn');
    if (Edit_Btn) Edit_Btn.addEventListener('click', () => { Prefill_Edit_Modal(); Open_Edit_Modal(); });

    const Scan_Btn = document.getElementById('Scan_Btn');
    if (Scan_Btn) Scan_Btn.addEventListener('click', Start_Scan);

    document.getElementById('Edit_Modal')?.addEventListener('click', (e) => { if (e.target.id === 'Edit_Modal') Close_Edit_Modal(); });
});
