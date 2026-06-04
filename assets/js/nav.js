// Mobile nav helper — adds a click handler to the nav toggle if present.
// (We don't have a hamburger yet, but the previous dev wired this up in case.)

document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.site-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
        nav.classList.toggle('is-open');
    });
});
