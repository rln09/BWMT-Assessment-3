// Team page — loads volunteers from WordPress REST API

const VOLUNTEER_ENDPOINT = 'http://pantry.local/wp-json/pantry/v1/volunteers';

function render(volunteers) {
    const container = document.getElementById('team-list');
     if (!container) return;
    
    if (!volunteers || volunteers.length === 0) {
        container.innerHTML = '<p>No team members listed yet. Check back soon!</p>';
        return;
    }
    
    container.innerHTML = volunteers.map(v => `
        <div class="team-member">
            <h3>${v.name}</h3>
            <p class="suburb">${v.suburb || ''}</p>
        </div>
    `).join('');
}

fetch(VOLUNTEER_ENDPOINT)
    .then(response => response.json())
    .then(data => render(data));
