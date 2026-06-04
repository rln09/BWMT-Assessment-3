**ME** If I adjust the main html file will this be sufficient to change the navigation?
**AI** The hamburger menu button needs to be added to the HTML. Here's exactly where to add it:

1. Add the Hamburger Button to ALL HTML Files
Add this button inside the <header> tag, right before the <nav> element in every HTML file (index.html, donate.html, stock.html, team.html, volunteer.html):
<header class="site-header">
    <div class="brand">
        <h1>Pantry Perth</h1>
        <p class="tagline">Food relief, dignity, community</p>
    </div>
    
    <!-- ADD THIS HAMBURGER BUTTON HERE -->
    <button class="nav-toggle" aria-label="Toggle navigation menu">
        <span></span>
        <span></span>
        <span></span>
    </button>
    
    <nav class="site-nav">
        <a href="index.html">Home</a>
        <a href="volunteer.html">Volunteer</a>
        <a href="stock.html">Today's Stock</a>
        <a href="team.html">Our Team</a>
        <a href="donate.html">Donate</a>
        <a href="/news/">News</a>
    </nav>
</header>
Summary of Where to Add Things:
HTML files (5 files: index.html, donate.html, stock.html, team.html, volunteer.html):

Add the <button class="nav-toggle"> inside <header>, before <nav>

CSS file (assets/css/main.css):

Add the complete .nav-toggle and @media CSS rules (replace or add to existing)

JavaScript file (assets/js/nav.js):

Replace the entire file with the enhanced version above

The hamburger menu will now:

✅ Appear only on screens smaller than 768px

✅ Animate smoothly from hamburger to X when clicked

✅ Slide the menu in from the right side

✅ Prevent background scrolling when menu is open

✅ Close when clicking a link or tapping outside

✅ Automatically reset when resizing to desktop view
