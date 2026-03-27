document.addEventListener('DOMContentLoaded', () => {
    Render_History();
});

function Validate_Form() {
    let Valid = true;
    const Fields = [
        { Id: 'Name', Err: 'Err_Name', Msg: 'Name Is Required' },
        { Id: 'Email', Err: 'Err_Email', Msg: 'Valid Email Is Required' },
        { Id: 'Subject', Err: 'Err_Subject', Msg: 'Please Select A Subject' },
        { Id: 'Message', Err: 'Err_Message', Msg: 'Message Cannot Be Empty' }
    ];

    Fields.forEach(F => {
        const Input = document.getElementById(F.Id);
        const Err = document.getElementById(F.Err);
        const Is_Empty = !Input || !Input.value.trim();
        const Is_Email = F.Id === 'Email' && Input && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Input.value);

        if (Is_Empty || Is_Email) {
            if (Input) Input.classList.add('Error');
            if (Err) { Err.textContent = Is_Email ? 'Enter A Valid Email Address' : F.Msg; Err.classList.add('Visible'); }
            Valid = false;
        } else {
            if (Input) Input.classList.remove('Error');
            if (Err) Err.classList.remove('Visible');
        }
    });

    return Valid;
}

async function Submit_Contact(e) {
    e.preventDefault();
    if (!Validate_Form()) return;

    const Btn = document.getElementById('Submit_Btn');
    Btn.disabled = true;
    Btn.textContent = 'Transmitting To Satellite...';

    await new Promise(r => setTimeout(r, 1800));

    const Data = {
        Name: document.getElementById('Name').value.trim(),
        Email: document.getElementById('Email').value.trim(),
        Phone: document.getElementById('Phone').value.trim(),
        Subject: document.getElementById('Subject').value,
        Message: document.getElementById('Message').value.trim()
    };

    DB_Add_Message(Data);
    Show_Toast('Message Transmitted Successfully!', 'success');

    Btn.textContent = '✓ Message Transmitted Successfully';
    Btn.style.background = 'linear-gradient(135deg, #00e676, #00c853)';

    setTimeout(() => {
        document.getElementById('Contact_Form').reset();
        Btn.disabled = false;
        Btn.textContent = 'Transmit Message';
        Btn.style.background = '';
        Render_History();
    }, 3000);
}

function Render_History() {
    const Panel = document.getElementById('History_Panel');
    if (!Panel) return;
    const DB = DB_Get();
    const Messages = DB.Contact_Messages || [];

    if (Messages.length === 0) {
        Panel.innerHTML = '<p style="color: var(--Clr_Text_Muted); font-size: 0.84rem; text-align: center; padding: 24px;">No Submissions Yet.</p>';
        return;
    }

    Panel.innerHTML = Messages.slice(0, 5).map(M => `
        <div class="History_Item Glass_Card">
            <div>
                <div class="History_Subject">${M.Subject.charAt(0).toUpperCase() + M.Subject.slice(1)}</div>
                <div class="History_Name">${M.Name} · ${M.Email}</div>
            </div>
            <div class="History_Time">${new Date(M.Timestamp).toLocaleDateString()}</div>
        </div>`).join('');
}

function Toggle_History() {
    const Panel = document.getElementById('History_Panel');
    const Btn = document.getElementById('History_Btn');
    const Is_Hidden = Panel.style.display === 'none' || !Panel.style.display;
    Panel.style.display = Is_Hidden ? 'block' : 'none';
    if (Btn) Btn.textContent = Is_Hidden ? 'Hide History' : 'View Submissions';
}
