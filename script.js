
// Helper: simple typing effect
function typeText(el, text, speed = 30) {
    el.textContent = '';
    let i = 0;
    return new Promise(resolve => {
        const id = setInterval(() => {
            el.textContent += text.charAt(i);
            i++;
            if (i >= text.length) { clearInterval(id); resolve(); }
        }, speed);
    });
}

// Confetti (basic)
function runConfetti(duration = 2500) {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const ctx = canvas.getContext('2d');
    const pieces = [];
    const colors = ['#ff6b6b','#ffd93d','#6bcB77','#6bd1ff','#b56bff'];
    for (let i=0;i<80;i++) pieces.push({x:Math.random()*canvas.width,y:Math.random()*-canvas.height*2,vy:2+Math.random()*6,ax:Math.random()*0.6-0.3, size:4+Math.random()*8, color:colors[Math.floor(Math.random()*colors.length)]});
    let start = performance.now();
    function frame(t){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (const p of pieces){
            p.x += p.ax*2; p.y += p.vy; p.vy += 0.02;
            ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size*0.6);
        }
        if (t - start < duration) requestAnimationFrame(frame);
        else ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    requestAnimationFrame(frame);
}

document.addEventListener('DOMContentLoaded', ()=>{
    const surpriseBtn = document.getElementById('surpriseBtn');
    const messageEl = document.getElementById('surpriseMessage');
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    const surpriseOverlay = document.getElementById('surpriseOverlay');
    const openSurpriseBtn = document.getElementById('openSurpriseBtn');

    if (openSurpriseBtn && surpriseOverlay) {
        openSurpriseBtn.addEventListener('click', async () => {
            surpriseOverlay.classList.add('hidden');
            if (messageEl) {
                messageEl.classList.remove('hidden');
                await typeText(messageEl, 'Achu, happy birthday! Even from far away, you are in my heart — enjoy these memories and the little surprise. Love you! ❤️', 28);
            }
            runConfetti(3000);
            if (bgMusic) {
                try { await bgMusic.play(); musicBtn && (musicBtn.textContent = 'Pause Music ⏸'); } catch (e) {}
            }
        });
    }

    if (surpriseBtn && messageEl) {
        surpriseBtn.addEventListener('click', async function(){
            const isHidden = messageEl.classList.contains('hidden');
            if (isHidden) {
                messageEl.classList.remove('hidden');
                this.textContent = 'Close Surprise 🎈';
                const text = "Achu, happy birthday! Even from far away, you're in my heart — enjoy these memories and the little surprise. Love you! ❤️";
                await typeText(messageEl, text, 28);
                runConfetti(3000);
                // try to play music if available
                if (bgMusic && bgMusic.src && bgMusic.paused) {
                    try{ await bgMusic.play(); musicBtn && (musicBtn.textContent = 'Pause Music ⏸'); }catch(e){}
                }
            } else {
                messageEl.classList.add('hidden');
                this.textContent = 'Click for a Surprise 🎉';
                if (bgMusic && !bgMusic.paused) { bgMusic.pause(); musicBtn && (musicBtn.textContent = 'Play Music ♪'); }
            }
        });
    }

    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', async ()=>{
            if (bgMusic.paused) {
                try{ await bgMusic.play(); musicBtn.textContent = 'Pause Music ⏸'; }catch(e){ alert('Unable to autoplay. Tap Play on your phone.'); }
            } else { bgMusic.pause(); musicBtn.textContent = 'Play Music ♪'; }
        });
    }

    // Attempt autoplay once loaded.
    if (bgMusic) {
        bgMusic.loop = true;
        bgMusic.playsInline = true;
        const tryAutoplay = async () => {
            try {
                await bgMusic.play();
                if (musicBtn) musicBtn.textContent = 'Pause Music ⏸';
            } catch (error) {
                console.warn('Autoplay blocked by browser', error);
            }
        };
        tryAutoplay();

        // Fallback: resume playback on the first user interaction
        const resumeOnInteraction = async () => {
            if (bgMusic.paused) {
                try {
                    await bgMusic.play();
                    if (musicBtn) musicBtn.textContent = 'Pause Music ⏸';
                } catch (error) {
                    console.warn('Playback resume blocked:', error);
                }
            }
            document.body.removeEventListener('click', resumeOnInteraction);
            document.body.removeEventListener('touchstart', resumeOnInteraction);
        };
        document.body.addEventListener('click', resumeOnInteraction);
        document.body.addEventListener('touchstart', resumeOnInteraction);
    }
});