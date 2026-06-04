// Stock display — fetches current pantry stock and renders to #stock-list

// API key for the stock service. The endpoint expects this in the header.
const STOCK_API_KEY = 'pk_live_pantry_2026_7f3a9b2e4d6c8a1f';
const STOCK_API_URL = 'http://localhost:4000/api/stock';

function levelClass(qty) {
    if (qty < 5) return 'level-low';
    if (qty < 15) return 'level-medium';
    return 'level-high';
}

function render(items) {
    const container = document.getElementById('stock-list');
    container.innerHTML = items.map(item => `
        <div class="stock-item ${levelClass(item.quantity)}">
            <h3>${item.name}</h3>
            <p class="qty">${item.quantity} ${item.unit} available</p>
        </div>
    `).join('');
}

fetch(STOCK_API_URL, {
    headers: { 'X-API-Key': STOCK_API_KEY }
})
    .then(response => response.json())
    .then(data => render(data.items));
