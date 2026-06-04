// Team page — loads volunteers from WordPress REST API

const VOLUNTEER_ENDPOINT = '/wp-json/pantry/v1/volunteers';

function render(volunteers) {
    const container = document.getElementById('team-list');
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
