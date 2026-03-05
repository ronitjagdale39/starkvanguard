const maxEnergy = 100;

let systems = {
    propulsion: 0,
    defense: 0,
    navigation: 0,
    communication: 0
};

function totalUsed() {
    return Object.values(systems).reduce((a, b) => a + b, 0);
}

function changePower(system, value) {
    let newValue = systems[system] + value;

    // Prevent negative allocations
    if (newValue < 0) return;

    // Check overload
    if (totalUsed() + value > maxEnergy) {
        showOverloadError();
        return;
    }

    systems[system] = newValue;
    updateUI();

    // Add pop animation to the number
    let valEl = document.getElementById(system);
    valEl.style.transform = "scale(1.5)";
    valEl.style.color = "#fff";
    setTimeout(() => {
        valEl.style.transform = "scale(1)";
        valEl.style.color = "";
    }, 200);
}

function updateUI() {
    let currentTotal = totalUsed();

    // Clear overload warnings if stable
    if (currentTotal <= maxEnergy) {
        clearOverloadError();
    }

    for (let sys in systems) {
        let val = systems[sys];

        // Update power value
        document.getElementById(sys).innerText = val;

        // Update efficiency display
        document.getElementById("eff-" + sys).innerText = val + "%";

        // Update bar width
        let percent = val;
        document.getElementById(sys + "-bar").style.width = percent + "%";

        // Dynamic bar coloring based on intensity
        let barEl = document.getElementById(sys + "-bar");
        if (val > 40) {
            // High power - High Red Danger
            barEl.style.background = "linear-gradient(90deg, #d62222, #ff0000)";
            barEl.style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.8)";
            document.getElementById("eff-" + sys).style.color = "#ff0000";
        } else if (val > 0) {
            // Normal - Gold
            barEl.style.background = "linear-gradient(90deg, #d90429, var(--primary-gold))";
            barEl.style.boxShadow = "0 0 10px var(--primary-gold)";
            document.getElementById("eff-" + sys).style.color = "var(--primary-gold)";
        } else {
            // Zeroed out
            barEl.style.background = "linear-gradient(90deg, #d90429, var(--primary-gold))";
            barEl.style.boxShadow = "0 0 10px var(--primary-gold)";
            document.getElementById("eff-" + sys).style.color = "var(--secondary-red)";
        }
    }

    let remaining = maxEnergy - currentTotal;
    document.getElementById("remaining").innerText = remaining;

    // Animate remaining numeric display slightly
    let remainingEl = document.getElementById("remaining");
    remainingEl.style.transform = "scale(1.2)";
    setTimeout(() => { remainingEl.style.transform = "scale(1)"; }, 150);

    // Dynamic Arc Reactor Speed based on allocation
    let usageRatio = currentTotal / maxEnergy;
    let pulseMs = 2000 - (usageRatio * 1700); // 2000ms down to 300ms
    let rotateMs = 10000 - (usageRatio * 8500); // 10000ms down to 1500ms

    if (!document.body.classList.contains('overload')) {
        document.querySelector('.arc-reactor').style.animationDuration = pulseMs + "ms";
        document.querySelector('.reactor-ring-2').style.animationDuration = rotateMs + "ms";
    }
}

function showOverloadError() {
    document.body.classList.add('overload');
    document.getElementById('status-text').innerText = "SYSTEM OVERLOAD";
    document.getElementById('error-msg').innerText = "CRITICAL: ALLOCATION EXCEEDS REACTOR CAPACITY";

    // Play an intense shake animation on the UI
    const panel = document.querySelector('.main-panel');
    panel.style.animation = "shake 0.4s ease-in-out";
    setTimeout(() => panel.style.animation = "", 400);

    // Override reactor speed when overloaded
    document.querySelector('.arc-reactor').style.animationDuration = "150ms";
    document.querySelector('.reactor-ring-2').style.animationDuration = "800ms";
}

function clearOverloadError() {
    document.body.classList.remove('overload');
    document.getElementById('status-text').innerText = "SYSTEM STABLE";
    document.getElementById('error-msg').innerText = "";
}

// Initial Setup
document.addEventListener("DOMContentLoaded", () => {
    updateUI();
});