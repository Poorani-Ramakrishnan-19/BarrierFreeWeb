document.getElementById("apply").addEventListener("click", () => {
    const settings = {
        fontSize: document.getElementById("fontSize").value,
        lineHeight: document.getElementById("lineHeight").value,
        spacing: document.getElementById("spacing").value
    };
    const fontFamily = document.getElementById("fontFamily").value;
    if (fontFamily) {
        settings.fontFamily = fontFamily;
    }
    const cursorSize = document.getElementById("cursorSize").value;
    if (cursorSize && cursorSize !== "default") {
        settings.cursorSize = cursorSize;
    }
    // Ensure letter spacing is always a number, defaulting to 0 if the value is empty
    const spacingValue = document.getElementById("spacing").value;
    settings.spacing = spacingValue === '' ? 0 : parseFloat(spacingValue);
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, settings);
    });
});

document.getElementById("reset").addEventListener("click", () => {
    // Reset UI controls to default values
    document.getElementById("fontSize").value = 16;
    document.getElementById("lineHeight").value = 1.5;
    document.getElementById("spacing").value = 0;
    document.getElementById("fontFamily").value = "";
    document.getElementById("cursorSize").value = "default";

    // Send reset message to content script
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { reset: true });
    });
});

// Toggle slider/dropdown visibility for each setting
const toggleButtons = document.querySelectorAll('.toggle-slider');
toggleButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        const container = document.getElementById(target + '-container');
        // Hide all other sliders and dropdowns
        document.querySelectorAll('.slider-container, .dropdown-container').forEach(c => {
            if (c !== container) c.style.display = 'none';
        });
        document.querySelectorAll('.toggle-slider').forEach(b => {
            if (b !== this) b.classList.remove('active');
        });
        // Toggle this slider/dropdown
        if (container.style.display === 'none' || container.style.display === '') {
            container.style.display = 'block';
            this.classList.add('active');
        } else {
            container.style.display = 'none';
            this.classList.remove('active');
        }
    });
});
// Hide sliders/dropdowns if clicking outside
window.addEventListener('click', function(e) {
    if (!e.target.classList.contains('toggle-slider')) {
        document.querySelectorAll('.slider-container, .dropdown-container').forEach(c => c.style.display = 'none');
        document.querySelectorAll('.toggle-slider').forEach(b => b.classList.remove('active'));
    }
});
// Prevent window click from closing when clicking inside slider/dropdown
const containers = document.querySelectorAll('.slider-container, .dropdown-container');
containers.forEach(c => {
    c.addEventListener('click', function(e) { e.stopPropagation(); });
});