const DISCORD_ID = "1017840122328252538";

// 1. DISCORD SYSTEM
async function getStatus() {
    try {
        const r = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const d = await r.json();
        const data = d.data;

        document.getElementById('discord-avatar').style.backgroundImage = `url(https://cdn.discordapp.com/avatars/${DISCORD_ID}/${data['discord_user']['avatar']}.png)`;
        document.getElementById('discord-name').innerText = data['discord_user']['username'].toUpperCase();

        const dot = document.getElementById('discord-status');
        const s = data['discord_status'];
        dot.style.background = s === 'online' ? '#23a55a' : s === 'dnd' ? '#f23f43' : s === 'idle' ? '#f0b232' : '#80848e';

        const act = data['activities'];
        const activityEl = document.getElementById('current-activity');
        if (act.length > 0) {
            activityEl.innerText = `DOING: ${act[act.length - 1].name.toUpperCase()}`;
        } else {
            activityEl.innerText = "STATUS: IDLE";
        }
    } catch (e) { console.log("Lanyard error. Check ID and ensure you are in the Lanyard Discord."); }
}

setInterval(getStatus, 10000);
getStatus().catch(console.error);

// 2. ANIMATED BACKGROUND
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for(let i=0; i<80; i++) {
    stars.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*2});
}

function draw() {
    ctx.fillStyle = '#020205';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = '#4b0082';
    stars.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI*2);
        ctx.fill();
        p.y -= 0.5;
        if(p.y < 0) p.y = canvas.height;
    });
    requestAnimationFrame(draw);
}
draw();

// 3. CURSOR
document.addEventListener('mousemove', (e) => {
    const c = document.getElementById('custom-cursor');
    c.style.left = e.clientX + 'px';
    c.style.top = e.clientY + 'px';
});