// STATE MANAGEMENT
const state = {
    comments: [],
    leads: 0,
    reach: 0
};

// DOM ELEMENTS
const navItems = document.querySelectorAll('.nav-item');
const interactionFeed = document.getElementById('interaction-feed');
const replyModal = document.getElementById('reply-modal');
const closeModalBtn = document.getElementById('close-modal');

// NAVIGATION LOGIC
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        // Here you would switch views based on item.id
    });
});

// MODAL LOGIC
window.openReplyModal = (username) => {
    document.getElementById('target-user').innerText = username;
    replyModal.classList.remove('hidden');
}

closeModalBtn.addEventListener('click', () => {
    replyModal.classList.add('hidden');
});

// MOCK DATA INJECTION (FOR DEMO)
function renderMocks() {
    const mocks = [
        { id: 1, user: 'johndoe', text: 'Hey, I love this! How can I collaborate?', type: 'lead' },
        { id: 2, user: 'jane_smith', text: 'Nice post! 🔥', type: 'comment' }
    ];

    interactionFeed.innerHTML = mocks.map(item => `
        <div class="feed-item">
            <div class="item-content">
                <h4>@${item.user} ${item.type === 'lead' ? '⭐' : ''}</h4>
                <p>${item.text}</p>
            </div>
            <button class="btn secondary" onclick="openReplyModal('${item.user}')">Reply</button>
        </div>
    `).join('');

    // Update stats
    document.getElementById('stat-comments').innerText = mocks.length;
    document.getElementById('stat-leads').innerText = mocks.filter(m => m.type === 'lead').length;
    document.getElementById('stat-reach').innerText = '1.2k';
}

// Initialize
setTimeout(renderMocks, 1000);

/**
 * INTEGRATION NOTE:
 * Once the Backend is ready, we will use fetch('/api/comments') 
 * to get real data instead of these mocks.
 */
async function fetchComments() {
    try {
        const response = await fetch('/api/comments');
        const data = await response.json();
        console.log('Real data from backend:', data);
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}
