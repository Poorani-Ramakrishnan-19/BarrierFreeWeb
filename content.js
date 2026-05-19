/**
 * BarrierFreeWeb - Content Script Loader
 * Chrome Extension: Initializes the accessibility widget
 * Author: Poorani Ramakrishnan
 * License: MIT
 */

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (typeof createFloatingAccessWidget === 'function') createFloatingAccessWidget();
} else {
    window.addEventListener('DOMContentLoaded', () => {
        if (typeof createFloatingAccessWidget === 'function') createFloatingAccessWidget();
    });
}
