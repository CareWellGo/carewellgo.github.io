document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ultra Pro Max: Server Simulation State
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="ph-bold ph-spinner-gap"></i> Transmitting to Satellite...`;

        // Gather Data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        try {
            // Simulated API call with 2-second delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Logic for "Server Level" success
            console.log("Packet Sent to CareWell HQ:", formData);
            
            // Visual Feedback
            submitBtn.style.background = '#2ecc71';
            submitBtn.innerHTML = `<i class="ph-bold ph-check-circle"></i> Message Transmitted Successfully`;
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.style.background = 'linear-gradient(to right, #00b4db, #0083b0)';
                submitBtn.innerHTML = `<i class="ph ph-paper-plane-tilt"></i> Transmit Message`;
            }, 3000);

        } catch (error) {
            submitBtn.style.background = '#e74c3c';
            submitBtn.innerHTML = `<i class="ph-bold ph-warning-circle"></i> Transmission Failed`;
        }
    });

    // Bonus: Input interaction effects
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
            input.parentElement.style.transition = '0.3s';
        });
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });
});