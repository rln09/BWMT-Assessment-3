**ME** WHAT NEEDS TO BE FIXED SO THAT THE STOCK SHOWS ON THE FRONTEND PAGE?
**AI** Looking at your code, I can identify several issues that need to be fixed to display stock on the frontend page:

## Main Issues:

1. **Missing `showError()` function** - The error handler calls `showError()` but this function isn't defined anywhere
2. **Potential CORS issues** - The API is on `localhost:4000` but the page might be served from a different port
3. **No error handling UI** - Users don't see any feedback when the stock fails to load

## Here's the fix for `stock.js`:

```javascript
// Stock display — fetches current pantry stock and renders to #stock-list

// API key for the stock service. The endpoint expects this in the header.
const STOCK_API_URL = 'http://localhost:4000/api/stock';

function levelClass(qty) {
    if (qty < 5) return 'level-low';
    if (qty < 15) return 'level-medium';
    return 'level-high';
}

// Add this missing function
function showError(message) {
    const container = document.getElementById('stock-list');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <p>⚠️ ${message}</p>
                <p>Please check your connection or try again later.</p>
            </div>
        `;
    }
    console.error('Stock error:', message);
}

function render(items) {
    const container = document.getElementById('stock-list');
    if (!container) return;
    
    if (!items || items.length === 0) {
        container.innerHTML = '<p>No stock items available at the moment.</p>';
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="stock-item ${levelClass(item.quantity)}">
            <h3>${escapeHtml(item.name)}</h3>
            <p class="qty">${item.quantity} ${escapeHtml(item.unit)} available</p>
        </div>
    `).join('');
}

// Helper function to prevent XSS attacks
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Enhanced fetch with error handling and timeout
async function loadStock() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
        const response = await fetch(STOCK_API_URL, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different possible response structures
        if (data.items && Array.isArray(data.items)) {
            render(data.items);
        } else if (Array.isArray(data)) {
            render(data);
        } else {
            console.error('Unexpected API response structure:', data);
            showError('Received unexpected data format from server');
        }
    } catch (err) {
        if (err.name === 'AbortError') {
            showError('Request timed out. Please check if the API server is running.');
        } else {
            showError('Could not load stock data. Please ensure the API server is running on localhost:4000');
        }
        console.error('Fetch error:', err);
    }
}

// Start loading stock when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadStock);
} else {
    loadStock();
}
```

## Additional Issues to Check:

### 1. **API Server Status**
Make sure your backend API server is actually running on `http://localhost:4000` with the `/api/stock` endpoint.

### 2. **CORS Configuration**
If the HTML page is being served from a different port (e.g., via Live Server on port 5500), you'll need CORS headers on your API server:

```javascript
// On your API server (Node.js/Express example)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
```

### 3. **Expected API Response Format**
Your API should return data in this format:

```json
{
    "items": [
        {
            "name": "Rice",
            "quantity": 20,
            "unit": "kg"
        },
        {
            "name": "Canned Beans",
            "quantity": 45,
            "unit": "cans"
        }
    ]
}
```

### 4. **Add CSS for Error Messages** (in your `main.css`):

```css
.error-message {
    background-color: #fee;
    border-left: 4px solid #c00;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
}

.error-message p:first-child {
    font-weight: bold;
    margin-bottom: 0.5rem;
}
```

## Quick Debugging Steps:

1. **Check if API is running**: Open browser console (F12) and run: `fetch('http://localhost:4000/api/stock').then(r => r.json()).then(console.log)`

2. **Check for console errors**: Look for any red error messages in the browser's developer console

3. **Verify network tab**: In Chrome DevTools > Network tab, check if the request to `localhost:4000` is being made and what response it returns

4. **Check file paths**: Ensure `stock.js` is in the correct location (`assets/js/stock.js`) and is being loaded after jQuery/DOM is ready

The main fixes needed are adding the `showError()` function and better error handling with proper debugging information.
