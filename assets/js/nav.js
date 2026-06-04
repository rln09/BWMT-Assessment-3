// Mobile nav helper — adds a click handler to the nav toggle if present.
// (We don't have a hamburger yet, but the previous dev wired this up in case.)

// Mobile nav helper - handles hamburger menu toggle
document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.site-nav');
    
    if (!toggle || !nav) return;
    
    // Function to toggle menu
    function toggleMenu() {
        nav.classList.toggle('is-open');
        toggle.classList.toggle('is-open');
        
        // Prevent body scroll when menu is open
        if (nav.classList.contains('is-open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Click handler for hamburger button
    toggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a link
    var links = nav.querySelectorAll('a');
    links.forEach(function(link) {
        link.addEventListener('click', function() {
            if (nav.classList.contains('is-open')) {
                nav.classList.remove('is-open');
                toggle.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav.classList.contains('is-open') && 
            !nav.contains(event.target) && 
            !toggle.contains(event.target)) {
            nav.classList.remove('is-open');
            toggle.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    });
    
    // Handle window resize - if resizing to desktop while menu is open, reset
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav.classList.contains('is-open')) {
            nav.classList.remove('is-open');
            toggle.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    });
});