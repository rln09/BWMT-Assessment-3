// Simple privacy-friendly analytics — counts page views only, no cookies.
// Posts to a local endpoint that just logs to console for now.

(function () {
    var pageData = {
        path: window.location.pathname,
        referrer: document.referrer || 'direct',
        ts: Date.now()
    };

    try {
        // Fire and forget. Console-only for now until we hook up a real backend.
        console.log('[analytics] pageview', pageData);
    } catch (e) {
        // Swallow — analytics must never break the page.
    }
})();
