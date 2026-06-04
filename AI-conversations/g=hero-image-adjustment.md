**ME** The hero image on the home page is too big, how best can I fix this?
**AI** Here are a few simple ways to fix the hero image being too large, depending on your preference:

## Option 1: CSS-only fix (add to your `assets/css/main.css`)

```css
/* Limit hero image height */
.hero img {
    width: 100%;
    max-height: 400px;  /* Adjust this value as needed */
    object-fit: cover;   /* Crops image to fit, maintains aspect ratio */
    object-position: center;
}
```

## Option 2: More responsive approach

```css
.hero {
    position: relative;
}

.hero img {
    width: 100%;
    height: auto;
    max-height: 60vh;  /* Takes up 60% of viewport height */
    object-fit: cover;
}

/* On mobile screens */
@media (max-width: 768px) {
    .hero img {
        max-height: 40vh;  /* Smaller on phones */
    }
}
```

## Option 3: Use image as background (recommended)

```css
.hero {
    background-image: url('assets/img/hero-pantry.jpg');
    background-size: cover;
    background-position: center 30%;
    background-repeat: no-repeat;
    min-height: 400px;
    display: flex;
    align-items: center;
}

.hero img {
    display: none;  /* Hide the actual img tag */
}

.hero-text {
    background-color: rgba(0,0,0,0.6);  /* Optional: dark overlay for text readability */
    padding: 2rem;
    color: white;
}
```

## Option 4: Simple inline style (quick fix)

Add directly to the `<img>` tag in your HTML:

```html
<img src="assets/img/hero-pantry.jpg" alt="Volunteers packing food parcels at Pantry Perth" style="max-height: 400px; width: 100%; object-fit: cover;">
```

**Recommendation:** Option 2 or 3 gives the best control across different screen sizes. Option 3 also makes text more readable by allowing a dark overlay behind the hero text.
