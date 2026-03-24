document.addEventListener("DOMContentLoaded", () => {

    const Scan_Line = document.querySelector(".Scan_Line")

    let Scan_Pos = 0

    setInterval(() => {
        Scan_Pos += 2
        if (Scan_Pos > 100) Scan_Pos = 0
        Scan_Line.style.top = `${Scan_Pos}%`
    }, 30)
})

// Initialize Lucide Icons
// Ensure you have <script src="https://unpkg.com/lucide@latest"></script> in your HTML
lucide.createIcons();

/**
 * Trigger Emergency Protocol
 * Opens the emergency overlay and logs the event
 */
function triggerEmergency() {
    const overlay = document.getElementById('emergency-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
    
    // Log for system monitoring
    console.log("CRITICAL: Emergency signal initiated.");
}

/**
 * Cancel Emergency Protocol
 */
function cancelEmergency() {
    const overlay = document.getElementById('emergency-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

/**
 * Navbar Scroll Interaction
 * Adds a subtle scale and movement effect when scrolling
 */
window.addEventListener('scroll', () => {
    const navInner = document.querySelector('nav div.max-w-7xl');
    if (window.scrollY > 20) {
        navInner.classList.add('scale-95', 'translate-y-1');
    } else {
        navInner.classList.remove('scale-95', 'translate-y-1');
    }
});