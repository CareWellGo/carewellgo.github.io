const viewport = document.getElementById('app-viewport');

// 1. View Templates
const views = {
    welcome: `
        <div class="robot-card">
            <div class="bot-eye animate-pulse">
                <i data-lucide="bot" style="width: 50px; height: 50px;"></i>
            </div>
            <h1 style="letter-spacing: 4px;">CAREWELL<span style="color: var(--bot-cyan)">GO</span></h1>
            <p style="opacity: 0.7; margin: 15px 0;">Medical Assistance System v2.0</p>
            <button class="btn-cyber" onclick="navigateTo('chat')">Initialize Core</button>
        </div>
    `,
    chat: `
        <div class="chat-window">
            <div style="padding: 20px; border-bottom: 1px solid var(--glass); display: flex; justify-content: space-between;">
                <span>SYSTEM: ONLINE</span>
                <button onclick="navigateTo('welcome')" style="background:none; border:none; color:white; cursor:pointer;">[EXIT]</button>
            </div>
            <div id="chat-logs" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column;">
                <div class="msg-ai">CareWellGo Online. How may I assist your recovery today?</div>
            </div>
            <div style="padding: 20px; border-top: 1px solid var(--glass);">
                <input type="text" id="user-msg" placeholder="Command input..." 
                       style="width: 100%; background: var(--glass); border: 1px solid var(--bot-cyan); padding: 15px; color: white; border-radius: 10px; outline: none;">
            </div>
        </div>
    `
};

// 2. Navigation Function
function navigateTo(viewName) {
    viewport.innerHTML = views[viewName]; // This replaces everything inside the container
    lucide.createIcons(); // Re-render icons for the new HTML
    
    if(viewName === 'chat') {
        setupChatLogic();
    }
}

// 3. Chat Interaction Logic
function setupChatLogic() {
    const input = document.getElementById('user-msg');
    const logs = document.getElementById('chat-logs');

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== "") {
            // User Message
            const uMsg = document.createElement('div');
            uMsg.className = 'msg-user';
            uMsg.innerText = input.value;
            logs.appendChild(uMsg);
            
            const val = input.value;
            input.value = "";

            // Bot Response
            setTimeout(() => {
                const bMsg = document.createElement('div');
                bMsg.className = 'msg-ai';
                bMsg.innerText = `Analyzing "${val}"... Vital signs normal. Proceeding with assistance.`;
                logs.appendChild(bMsg);
                logs.scrollTop = logs.scrollHeight;
            }, 800);
        }
    });
}

// Initial Load
navigateTo('welcome');S