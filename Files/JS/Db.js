const DB_Key = 'CareWellGO_DB';

const DB_Defaults = {
    Patient: {
        Name: 'Patient',
        Age: 25,
        Blood_Group: 'O+',
        Allergies: 'None',
        Emergency_Contact: '+91 555 000 0000',
        Location: 'Not Set',
        ID: 'HRB-' + Math.floor(1000 + Math.random() * 9000)
    },
    Vitals_History: [],
    AI_Chat: [],
    Bot_Chat: [],
    Contact_Messages: []
};

function DB_Init() {
    if (!localStorage.getItem(DB_Key)) {
        localStorage.setItem(DB_Key, JSON.stringify(DB_Defaults));
    }
}

function DB_Get() {
    try {
        return JSON.parse(localStorage.getItem(DB_Key)) || DB_Defaults;
    } catch (_) {
        return DB_Defaults;
    }
}

function DB_Set(Data) {
    localStorage.setItem(DB_Key, JSON.stringify(Data));
}

function DB_Update_Patient(Fields) {
    const DB = DB_Get();
    DB.Patient = { ...DB.Patient, ...Fields };
    DB_Set(DB);
}

function DB_Add_Vital(Record) {
    const DB = DB_Get();
    DB.Vitals_History.unshift({ ...Record, Timestamp: new Date().toISOString() });
    if (DB.Vitals_History.length > 50) DB.Vitals_History = DB.Vitals_History.slice(0, 50);
    DB_Set(DB);
}

function DB_Add_AI_Chat(Role, Message) {
    const DB = DB_Get();
    DB.AI_Chat.push({ Role, Message, Time: new Date().toISOString() });
    if (DB.AI_Chat.length > 100) DB.AI_Chat = DB.AI_Chat.slice(-100);
    DB_Set(DB);
}

function DB_Clear_AI_Chat() {
    const DB = DB_Get();
    DB.AI_Chat = [];
    DB_Set(DB);
}

function DB_Add_Bot_Chat(Role, Message) {
    const DB = DB_Get();
    DB.Bot_Chat.push({ Role, Message, Time: new Date().toISOString() });
    if (DB.Bot_Chat.length > 100) DB.Bot_Chat = DB.Bot_Chat.slice(-100);
    DB_Set(DB);
}

function DB_Clear_Bot_Chat() {
    const DB = DB_Get();
    DB.Bot_Chat = [];
    DB_Set(DB);
}

function DB_Add_Message(Form_Data) {
    const DB = DB_Get();
    DB.Contact_Messages.unshift({ ...Form_Data, Timestamp: new Date().toISOString() });
    DB_Set(DB);
}

function Show_Toast(Message, Type = 'info') {
    let Container = document.querySelector('.Toast_Container');
    if (!Container) {
        Container = document.createElement('div');
        Container.className = 'Toast_Container';
        document.body.appendChild(Container);
    }
    const Toast = document.createElement('div');
    Toast.className = `Toast Toast_${Type.charAt(0).toUpperCase() + Type.slice(1)}`;
    Toast.textContent = Message;
    Container.appendChild(Toast);
    setTimeout(() => {
        Toast.classList.add('Toast_Out');
        setTimeout(() => Toast.remove(), 400);
    }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
    DB_Init();

    const Nav_Toggle = document.getElementById('Nav_Toggle');
    const Nav_Links_El = document.getElementById('Nav_Links');

    if (Nav_Toggle && Nav_Links_El) {
        Nav_Toggle.addEventListener('click', () => {
            const Is_Open = Nav_Links_El.classList.toggle('Nav_Open');
            Nav_Toggle.classList.toggle('Is_Active', Is_Open);
        });
        Nav_Links_El.querySelectorAll('a').forEach(Link => {
            Link.addEventListener('click', () => {
                Nav_Links_El.classList.remove('Nav_Open');
                Nav_Toggle.classList.remove('Is_Active');
            });
        });
    }

    window.addEventListener('scroll', () => {
        const Nav = document.getElementById('Main_Nav');
        if (Nav) Nav.classList.toggle('Nav_Scrolled', window.scrollY > 20);
    });
});
