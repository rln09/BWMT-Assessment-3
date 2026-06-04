The main issues with this site were as follows:
Issues mentioned by previous developer
•	Hero image on homepage is too big
•	Mobile menu did not work properly
•	API key in stock page javascript

Other Issues noticed 
•	Donate button colour contrast 
•	Stock for the day was not displaying
•	The team list was not displaying
•	No path to the news/blog posts 

To resolve the colour contrast issue, I simply changed the colour of the buttons. This was for visual appeal and makes the figure shown in the button easier to read. This waas so the user can easily see the amount they want to donate and reduce risk of errors.
I compressed the hero image to make it more suitable for display on all sorts of devices. I used the online app squoosh for this and edited the main css file. The image was hindeirng navigation from beng smooth for users.
To fix the navigation menu, I added a feature that displays the navigation bar that expands to reveal a hidden menu of navigation links. This saves screen space and reduces visual clutter on the site. Now users can easily navigate the site.
I completely removed the API key in the stock page JS code as there was no need for it. New API endpoints were added according to the page that needed to be reached.
Stocks were important for those who needed the organisation’s services to see how much could be available to them, and for others to see how much they could donate. Stocks for the day and the team lists were both displayed by adjusting both HTML and JS codes.  The API endpoints were added to ensure the data is fetched from the correct source. CORS was also enabled, to allow access to the WP site.
Initially there was absolutely no details displayed on the news page, just an error code. This would stop users from finding out about the work the organisation has done so far and what they plan to do. I created two new files, wp.html and wp.js to allow the content from WordPress to be fetched and displayed on the Frontend’s News page. 

KNOWN ISSUES 
Issue	Severity	Recommendation
•	http://localhost:4000/api/stock has to be running for stock of the day to display. 
	Tier 2	Add a user- facing error message to stock.js when the API is unreachable.
•	The news page does not match the theme of the rest of the site.
	Tier 3	Apply the main css sheet to wp.html consistently with all other pages.
•	News posts are displayed from WordPress directly. (no change of theme, page, etc.)
	Tier 3	Wp.js must be changed to match the site’s visuals
•	CORS might not be fully functional
	Tier 2	Install and configure the WP CORS Headers plugin


