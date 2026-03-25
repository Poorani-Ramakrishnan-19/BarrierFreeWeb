if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (typeof createFloatingAccessWidget === 'function') createFloatingAccessWidget();
} else {
    window.addEventListener('DOMContentLoaded', () => {
        if (typeof createFloatingAccessWidget === 'function') createFloatingAccessWidget();
    });
}
