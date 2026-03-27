document.addEventListener('DOMContentLoaded', () => {
    const Stats = document.querySelectorAll('.Stat_Num[data-target]');

    const Count_Up = (El, Target, Suffix) => {
        let Count = 0;
        const Step = Target / 60;
        const Timer = setInterval(() => {
            Count += Step;
            if (Count >= Target) {
                El.textContent = Target % 1 === 0 ? Target + Suffix : Target + Suffix;
                clearInterval(Timer);
            } else {
                El.textContent = (Target % 1 === 0 ? Math.floor(Count) : Count.toFixed(1)) + Suffix;
            }
        }, 25);
    };

    const Observer = new IntersectionObserver((Entries) => {
        Entries.forEach(Entry => {
            if (Entry.isIntersecting) {
                const El = Entry.target;
                const Target = parseFloat(El.dataset.target);
                const Suffix = El.dataset.suffix || '';
                Count_Up(El, Target, Suffix);
                Observer.unobserve(El);
            }
        });
    }, { threshold: 0.5 });

    Stats.forEach(S => Observer.observe(S));

    const Scan_Line_El = document.querySelector('.Scan_Line');
    let Pos = 0;
    if (Scan_Line_El) {
        setInterval(() => {
            Pos += 1.5;
            if (Pos > 100) Pos = 0;
            Scan_Line_El.style.top = Pos + '%';
        }, 25);
    }

    const Node_Temp = document.querySelector('.Node_Temp');
    const Node_Heart = document.querySelector('.Node_Heart');
    if (Node_Temp && Node_Heart) {
        setInterval(() => {
            Node_Temp.textContent = 'Temp: ' + (36 + Math.random()).toFixed(2) + '°C';
            Node_Heart.textContent = 'Heart: ' + Math.floor(65 + Math.random() * 15) + ' BPM';
        }, 1800);
    }

    setTimeout(() => {
        const Alert = document.getElementById('Discount_Alert');
        if (Alert) Alert.style.display = 'block';
    }, 6000);
});

function Close_Alert() {
    const Alert = document.getElementById('Discount_Alert');
    if (Alert) {
        Alert.style.transition = '0.4s ease';
        Alert.style.transform = 'translateX(120%)';
        Alert.style.opacity = '0';
        setTimeout(() => Alert.remove(), 400);
    }
}

function Claim_Offer() {
    Close_Alert();
    Show_Toast('Offer Claimed! Check Your Email Shortly.', 'success');
}
