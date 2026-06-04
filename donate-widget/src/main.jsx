import React from 'react';
import { createRoot } from 'react-dom/client';
import DonateWidget from './DonateWidget.jsx';
import widgetStyles from './styles.css?inline';

// The static pages only load the JS bundle (one <script> tag), not a
// separate stylesheet — so the widget injects its own CSS at runtime.
function injectStyles() {
    if (document.getElementById('pp-donate-styles')) return;
    const tag = document.createElement('style');
    tag.id = 'pp-donate-styles';
    tag.textContent = widgetStyles;
    document.head.appendChild(tag);
}

// Self-mount: find #donate-widget-root if it's on the page and render.
// Pages that don't have the mount point just sit with the bundle loaded
// and nothing rendered — a thing to fix eventually but works for now.
function mount() {
    const el = document.getElementById('donate-widget-root');
    if (!el) return;
    if (el.dataset.mounted === '1') return;
    el.dataset.mounted = '1';
    injectStyles();
    const root = createRoot(el);
    root.render(<DonateWidget />);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
} else {
    mount();
}
