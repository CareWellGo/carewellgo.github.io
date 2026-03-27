const Bot = {
    Online: true,
    Responses: [
        { Keys: ['hello', 'hi', 'hey', 'greet'], Reply: 'Hello! I Am CareWellGO Assistant. How Can I Help You Today?' },
        { Keys: ['status', 'system', 'check'], Reply: 'All Systems Are Operational. Monitoring Is Active And Running Smoothly.' },
        { Keys: ['help', 'assist', 'support'], Reply: 'I Am Here To Assist You. You Can Ask Me About Vitals, Emergency Contacts, Or General Health Queries.' },
        { Keys: ['emergency', 'sos', 'urgent', 'danger'], Reply: 'Please Navigate To The Emergency Page Immediately. Your Safety Is The Priority!' },
        { Keys: ['vitals', 'health', 'scan'], Reply: 'Head Over To The Dashboard Page To View And Scan Your Real-Time Vitals.' },
        { Keys: ['contact', 'reach', 'message'], Reply: 'You Can Reach Our Support Team Via The Contact Page. We Respond Within 24 Hours.' },
        { Keys: ['ai', 'medical ai', 'diagnosis'], Reply: 'Our Medical AI Can Help With Symptom Analysis. Visit The AI Page For A Detailed Consultation.' },
        { Keys: ['bye', 'goodbye', 'exit', 'quit'], Reply: 'Goodbye! Stay Safe And Healthy. CareWellGO Is Always Here For You.' }
    ]
};

function Bot_Get_Response(Text) {
    const Lower = Text.toLowerCase();
    for (const Item of Bot.Responses) {
        if (Item.Keys.some(K => Lower.includes(K))) return Item.Reply;
    }
    return 'Command Received. Processing Your Request... For Detailed Assistance, Please Contact Our Support Team.';
}

function Bot_Append(Role, Text) {
    const Body = document.getElementById('Bot_Messages');
    if (!Body) return;
    const Is_User = Role === 'user';
    const Div = document.createElement('div');
    Div.className = `Msg ${Is_User ? 'Msg_User' : ''}`;
    Div.innerHTML = `
        <div class="Msg_Avatar ${Is_User ? 'Msg_User_Avatar' : 'Msg_Bot_Avatar'}">${Is_User ? 'You' : 'AI'}</div>
        <div class="Msg_Bubble ${Is_User ? 'Msg_User_Bubble' : 'Msg_Bot_Bubble'}">${Text}</div>`;
    Body.appendChild(Div);
    Body.scrollTop = Body.scrollHeight;
}

function Bot_Process() {
    if (!Bot.Online) { Show_Toast('Bot Is Offline. Power It On First.', 'error'); return; }

    const Input = document.getElementById('Bot_Input');
    const Text = Input.value.trim();
    if (!Text) return;

    Input.value = '';
    Bot_Append('user', Text);
    DB_Add_Bot_Chat('user', Text);

    setTimeout(() => {
        const Reply = Bot_Get_Response(Text);
        Bot_Append('bot', Reply);
        DB_Add_Bot_Chat('bot', Reply);
    }, 500);
}

function Toggle_Power() {
    Bot.Online = !Bot.Online;
    const Dot = document.querySelector('.Bot_Status_Dot')?.parentElement;
    const Label = document.querySelector('.Bot_Status_Label');
    const Btn = document.getElementById('Power_Btn');
    const Body_El = document.getElementById('Bot_Messages')?.parentElement;

    if (Bot.Online) {
        if (Dot) Dot.classList.remove('Bot_Status_Offline');
        if (Label) label.textContent = 'AI ONLINE';
        if (Btn) { Btn.textContent = 'POWER ON'; Btn.className = 'Btn_Power Btn_Power_On'; }
        Bot_Append('bot', 'System Booted Successfully. Ready To Assist.');
        DB_Add_Bot_Chat('bot', 'System Booted Successfully. Ready To Assist.');
    } else {
        if (Dot) Dot.classList.add('Bot_Status_Offline');
        if (Label) Label.textContent = 'AI OFFLINE';
        if (Btn) { Btn.textContent = 'POWER OFF'; Btn.className = 'Btn_Power Btn_Power_Off'; }
        Bot_Append('bot', 'System Shutdown Initiated. Goodbye.');
        DB_Add_Bot_Chat('bot', 'System Shutdown Initiated. Goodbye.');
    }
}

function Clear_Bot_Chat() {
    DB_Clear_Bot_Chat();
    const Body = document.getElementById('Bot_Messages');
    if (Body) Body.innerHTML = '';
    Bot_Append('bot', 'Chat Cleared. How Can I Help You?');
    Show_Toast('Chat History Cleared', 'info');
}

document.addEventListener('DOMContentLoaded', () => {
    const DB = DB_Get();
    const History = DB.Bot_Chat || [];
    if (History.length > 0) {
        History.slice(-30).forEach(M => Bot_Append(M.Role, M.Message));
    } else {
        Bot_Append('bot', 'Hello! I Am CareWellGO Assistant. Type A Message To Begin.');
    }

    const Input = document.getElementById('Bot_Input');
    const Send = document.getElementById('Bot_Send');

    if (Input) Input.addEventListener('keydown', (e) => { if (e.key === 'Enter') Bot_Process(); });
    if (Send) Send.addEventListener('click', Bot_Process);
});
