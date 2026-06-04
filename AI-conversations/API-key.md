**ME** Explain in detail the issue wiht this API key
**AI** ## Detailed Explanation: The API Key Security Issue in `stock.js`

This is a **critical security vulnerability** that exposes sensitive credentials to anyone who visits the website. Let me break down exactly why this is problematic:

### The Problem

```javascript
// This API key is visible to EVERYONE who visits the page
const STOCK_API_KEY = 'pk_live_pantry_2026_7f3a9b2e4d6c8a1f';
const STOCK_API_URL = 'http://localhost:4000/api/stock';

fetch(STOCK_API_URL, {
    headers: { 'X-API-Key': STOCK_API_KEY }
})
```

### Why This Is Dangerous

#### 1. **Client-Side Code is Public**
Any JavaScript file loaded by a web page is **completely readable** by anyone. Users can:
- Right-click → "View Page Source"
- Open DevTools → Sources tab
- Look at the Network tab to see the request headers

#### 2. **How Attackers Exploit This**

```
Scenario:
1. User visits pantryperth.org.au
2. User opens DevTools (F12)
3. User finds the API key in stock.js
4. User now has your API key forever
```

With that API key, an attacker can:
- **Make unlimited requests** to your stock API (costing you money/rate limits)
- **Delete or modify stock data** if the API allows write operations
- **Access other API endpoints** that use the same key
- **Sell the key** to other malicious actors
- **Launch denial-of-service attacks** against your API

#### 3. **The "Live" Naming Convention is Misleading**

```javascript
const STOCK_API_KEY = 'pk_live_pantry_2026_...'
//                    ^^ This suggests it's a PRODUCTION key!
```

The `pk_live` prefix conventionally means this is a **live/production key** for a payment service (like Stripe). If this were a real payment key, an attacker could:
- Process fraudulent payments
- Refund transactions
- Access customer payment information

### Visual Example of the Vulnerability

Here's what an attacker sees when they visit your page:

**View Source or DevTools:**
```javascript
// Clear as day - the secret is right there
const STOCK_API_KEY = 'pk_live_pantry_2026_7f3a9b2e4d6c8a1f';
```

**Network Tab:**
```
Request URL: http://localhost:4000/api/stock
Request Headers:
  X-API-Key: pk_live_pantry_2026_7f3a9b2e4d6c8a1f  ← Visible!
```

### What Makes This Particularly Bad

| Issue | Severity | Explanation |
|-------|----------|-------------|
| **No authentication required** | 🔴 Critical | Anyone with the key can access the API |
| **Key works from any origin** | 🔴 Critical | No CORS or referrer restrictions |
| **No rate limiting visible** | 🟠 High | Attacker could spam requests |
| **Key appears to be for live service** | 🟠 High | Suggests real production credentials |
| **No expiration mechanism** | 🟠 High | Key works indefinitely |

### The Correct Approach

#### Option 1: Proxy Pattern (Recommended)
```javascript
// FRONTEND - NO API KEY!
fetch('/api/stock')  // Requests YOUR server, not the API directly
    .then(response => response.json())
    .then(data => render(data.items));

// BACKEND (your server) - has the key safely
// server.js or proxy endpoint
app.get('/api/stock', (req, res) => {
    // Key is stored in environment variable, not in code
    const apiKey = process.env.STOCK_API_KEY;
    
    fetch('http://stock-api.internal/api/stock', {
        headers: { 'X-API-Key': apiKey }
    })
    .then(response => response.json())
    .then(data => res.json(data));
});
```

#### Option 2: Environment Variables (Build Time)
```javascript
// stock.js - during BUILD process only
// The key never reaches the browser
const STOCK_API_URL = process.env.VITE_STOCK_API_URL;
// The actual key is injected by your build tool/server
```

#### Option 3: Backend-for-Frontend (BFF)
```javascript
// Your server authenticates the user first
// Then makes authorized requests to the stock API
app.get('/api/stock', authenticateUser, (req, res) => {
    // User must be logged in
    // Use server-side session/token, not client-side API key
});
```

### Real-World Consequences

This exact vulnerability has led to:
- **$50,000+ in fraudulent charges** (when payment keys were exposed)
- **Data breaches** affecting millions of users
- **Complete API compromise** leading to service shutdown
- **Reputational damage** when security researchers disclose the issue

### The Previous Volunteer's Note Was Right

From `README.md`:
> "There's an 'API key' sitting in the stock page JavaScript. I know that's not really how you're supposed to do keys — anyone can read it in the browser."

The previous volunteer correctly identified this as a problem but didn't have time to fix it. The key should **never** be in frontend code.

### What You Should Do Immediately

1. **Revoke that API key** on your stock API service
2. **Generate a new key** and store it as an environment variable
3. **Create a backend proxy endpoint** that uses the key securely
4. **Update your frontend** to call your proxy instead of the API directly
5. **Add rate limiting and CORS restrictions** to your API

### Summary

**The core issue:** You're storing a secret credential in publicly accessible client-side code. This is like writing your bank PIN on a sticky note attached to your front door — anyone who looks can take it and use it.

**The fix:** Never put API keys in frontend JavaScript. Always keep them on a server you control, and use your server as a proxy between the browser and any service that requires authentication.
