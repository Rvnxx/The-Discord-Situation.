// --- CONFIGURATION ---
const DISCORD_ID = "1017840122328252538";
const BIN_ID = "69d9531836566621a89d2233"; // Get this from JSONBin.io
let player;
let playerReady = false;

// --- 1. GLOBAL ANNOUNCEMENT SYSTEM (JSONBin Version) ---
async function checkAnnouncements() {
    try {
        // Fetches your message from the online bin
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Bin-Meta': false }
        });
        const data = await response.json();
        const bar = document.getElementById('global-announcement');

        if (data.msg && data.msg !== "NONE" && data.msg !== "") {
            document.getElementById('announcement-text').innerText = data.msg.toUpperCase();
            bar.classList.remove('hidden');
        } else {
            bar.classList.add('hidden');
        }
    } catch (e) {
        console.log("Announcement system offline.");
    }
}

// Check for updates every 60 seconds
setInterval(checkAnnouncements, 60000);
checkAnnouncements();

// --- 2. INSTANT AUDIO ENGINE ---
function onYouTubeIframeAPIReady() {
    player = new YT.Player('lofi-player', {
        height: '0', width: '0', videoId: 'jfKfPfyJRdk',
        playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': 'jfKfPfyJRdk' },
        events: { 'onReady': () => { playerReady = true; } }
    });
}

function startVibe() {
    document.getElementById('vibe-overlay').style.display = 'none';
    if (playerReady) {
        player.playVideo();
        player.setVolume(document.getElementById('volume-control').value);
    } else {
        const check = setInterval(() => {
            if (playerReady) {
                player.playVideo();
                player.setVolume(document.getElementById('volume-control').value);
                clearInterval(check);
            }
        }, 100);
    }
}

document.getElementById('volume-control').addEventListener('input', (e) => {
    if (player && player.setVolume) player.setVolume(e.target.value);
});

// --- 3. DISCORD STATUS SYSTEM ---
async function getStatus() {
    try {
        const r = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const d = await r.json();
        const data = d['data'];
        if (!data) return;

        const user = data['discord_user'];
        const activities = data['activities'];
        const spotify = data['spotify'];

        document.getElementById('discord-avatar').style.backgroundImage = `url(https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user['avatar']}.png)`;
        document.getElementById('discord-name').innerText = user['username'].toUpperCase();

        const dot = document.getElementById('discord-status');
        const s = data['discord_status'];
        dot.style.background = s === 'online' ? '#23a55a' : s === 'dnd' ? '#f23f43' : s === 'idle' ? '#f0b232' : '#80848e';

        const activityEl = document.getElementById('current-activity');
        if (data['listening_to_spotify'] && spotify) {
            activityEl.innerHTML = `LISTENING TO: <span style="color:#1DB954">${spotify.track.toUpperCase()}</span>`;
        } else if (activities && activities.length > 0) {
            const game = activities.find(a => a.type === 0);
            activityEl.innerText = game ? `PLAYING: ${game.name.toUpperCase()}` : `DOING: ${activities[0].name.toUpperCase()}`;
        } else {
            activityEl.innerText = "STATUS: SYSTEM_IDLE";
        }
    } catch (e) { console.log("Lanyard sync failed."); }
}
setInterval(getStatus, 5000);
getStatus().catch(console.error);

// --- 4. MIDNIGHT STARS BACKGROUND ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

let stars = [];
for(let i=0; i<80; i++) {
    stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, s: Math.random() * 2, v: Math.random() * 0.5 + 0.2 });
}

function draw() {
    ctx.fillStyle = '#020205'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4b0082';
    stars.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill();
        p.y -= p.v; if(p.y < 0) p.y = canvas.height;
    });
    requestAnimationFrame(draw);
}
draw();

// --- 5. CURSOR & VAMP INTERACTION ---
document.addEventListener('mousemove', (e) => {
    const c = document.getElementById('custom-cursor');
    c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px'; ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
    const c = document.getElementById('custom-cursor');
    c.style.width = '20px'; c.style.height = '20px'; c.style.background = '#ffffff';
});

document.addEventListener('mouseup', () => {
    const c = document.getElementById('custom-cursor');
    c.style.width = '12px'; c.style.height = '12px'; c.style.background = '#ff0055';
});

// --- 6. THE LOCKOUT (Anti-Inspect) ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
});
