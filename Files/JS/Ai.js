const AI_State = { Active: false };

const AI_Responses = [
    { Keys: ['hello', 'hi', 'hey'], Reply: 'Hello! I Am CareWellGO Medical AI. How Can I Assist You Today?' },
    { Keys: ['pain', 'hurt', 'ache'], Reply: 'I Understand You Are In Pain. Please Rate It From 1 To 10 And Describe The Location.' },
    { Keys: ['temp', 'fever', 'temperature'], Reply: 'A Fever Above 38°C Requires Attention. Please Stay Hydrated And Rest. Shall I Alert Emergency Services?' },
    { Keys: ['heart', 'chest', 'pulse'], Reply: 'Cardiac Symptoms Are Serious. Please Use The Emergency Page For Immediate Assistance.' },
    { Keys: ['vitals', 'scan', 'health'], Reply: 'Your Dashboard Has Real-Time Vitals. Head To The Dashboard To Start A Full Diagnostic Scan.' },
    { Keys: ['emergency', 'sos', 'help'], Reply: 'For Emergencies, Please Visit The Emergency Page Immediately To Activate SOS Protocol.' },
    { Keys: ['medication', 'medicine', 'drug'], Reply: 'Please Consult A Certified Medical Professional Before Taking Any Medication.' },
    { Keys: ['allergy', 'allergies'], Reply: 'I Can See Your Allergy Profile In The Database. Please Check Your Dashboard For Details.' },
    { Keys: ['status', 'online', 'system'], Reply: 'All CareWellGO Systems Are Operational. Monitoring Is Active. Your Safety Is Our Priority.' }
];

function Get_AI_Response(Text) {
    const Lower = Text.toLowerCase();
    for (const Item of AI_Responses) {
        if (Item.Keys.some(K => Lower.includes(K))) return Item.Reply;
    }
    return 'I Have Logged Your Query. Please Consult Our Medical Team For Personalized Advice. Is There Anything Else I Can Help With?';
}

function Format_Time(ISO) {
    return new Date(ISO).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function Append_Msg(Role, Text, Time) {
    const Log = document.getElementById('AI_Messages');
    if (!Log) return;

    const Is_User = Role === 'user';
    const Div = document.createElement('div');
    Div.className = Is_User ? 'Msg Msg_User' : 'Msg';
    Div.innerHTML = `
        <div class="Msg_Avatar">${Is_User ? 'You' : 'AI'}</div>
        <div class="Msg_Bubble">
            ${Text}
            <span class="Msg_Time">${Time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>`;
    Log.appendChild(Div);
    Log.scrollTop = Log.scrollHeight;
}

function Show_Typing() {
    const Log = document.getElementById('AI_Messages');
    if (!Log) return null;
    const Typing = document.createElement('div');
    Typing.className = 'Msg';
    Typing.id = 'Typing_Indicator';
    Typing.innerHTML = `<div class="Msg_Avatar">AI</div><div class="Msg_Bubble"><div class="Typing_Indicator"><div class="Typing_Dot"></div><div class="Typing_Dot"></div><div class="Typing_Dot"></div></div></div>`;
    Log.appendChild(Typing);
    Log.scrollTop = Log.scrollHeight;
    return Typing;
}

function Init_AI_Chat() {
    document.getElementById('AI_Welcome').style.display = 'none';
    document.getElementById('AI_Chat_View').style.display = 'flex';

    const DB = DB_Get();
    const History = DB.AI_Chat || [];
    if (History.length > 0) {
        History.slice(-30).forEach(M => Append_Msg(M.Role, M.Message, Format_Time(M.Time)));
    } else {
        const Greet = 'CareWellGO Medical AI Online. How May I Assist Your Recovery Today?';
        Append_Msg('ai', Greet);
        DB_Add_AI_Chat('ai', Greet);
    }

    AI_State.Active = true;
}

function Send_AI_Message() {
    const Input = document.getElementById('AI_Input');
    const Text = Input.value.trim();
    if (!Text) return;

    Input.value = '';
    Append_Msg('user', Text);
    DB_Add_AI_Chat('user', Text);

    const Typing = Show_Typing();
    setTimeout(() => {
        if (Typing) Typing.remove();
        const Reply = Get_AI_Response(Text);
        Append_Msg('ai', Reply);
        DB_Add_AI_Chat('ai', Reply);
    }, 900 + Math.random() * 600);
}

function Clear_AI_History() {
    DB_Clear_AI_Chat();
    const Log = document.getElementById('AI_Messages');
    if (Log) { Log.innerHTML = ''; }
    const Greet = 'Chat History Cleared. How May I Help You?';
    Append_Msg('ai', Greet);
    DB_Add_AI_Chat('ai', Greet);
    Show_Toast('Chat History Cleared', 'info');
}

document.addEventListener('DOMContentLoaded', () => {
    const Input = document.getElementById('AI_Input');
    if (Input) {
        Input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); Send_AI_Message(); }
        });
    }
});
