/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

/**
 * Get current page name from the URL
 */
function getCurrentPage() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    return page;
}

/**
 * Create floating hearts in the background
 */
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts-container');
    if (!container) return;

    // Clear existing hearts
    container.innerHTML = '';

    const hearts = ['❤️', '💕', '💖', '💗', '💝'];
    const heartCount = window.innerWidth > 768 ? 12 : 8;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
        const randomDelay = Math.random() * 5;
        const randomDuration = 6 + Math.random() * 4;
        const randomLeft = Math.random() * 100;
        const randomSize = 1.5 + Math.random() * 1.5;

        heart.className = 'heart-float';
        heart.textContent = randomHeart;
        heart.style.left = randomLeft + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.fontSize = randomSize + 'rem';
        heart.style.animationDelay = randomDelay + 's';
        heart.style.animationDuration = randomDuration + 's';
        heart.style.opacity = (0.4 + Math.random() * 0.3).toString();

        container.appendChild(heart);
    }
}

/**
 * Recreate floating hearts on window resize
 */
window.addEventListener('resize', createFloatingHearts);

/**
 * Initialize floating hearts on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    
    const currentPage = getCurrentPage();
    
    if (currentPage === 'index.html' || currentPage === '') {
        initProposalPage();
    } else if (currentPage === 'verify.html') {
        initVerifyPage();
    } else if (currentPage === 'gallery.html') {
        initGalleryPage();
    } else if (currentPage === 'final.html') {
        initFinalPage();
    }
});

/* ========================================
   PROPOSAL PAGE (index.html)
   ======================================== */

function initProposalPage() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    if (!yesBtn || !noBtn) return;

    // YES button - Heart explosion and transition
    yesBtn.addEventListener('click', () => {
        playHeartExplosion(yesBtn);
        playSound();
        
        setTimeout(() => {
            window.location.href = 'verify.html';
        }, 1000);
    });

    // NO button - Escape behavior
    noBtn.addEventListener('mouseover', () => {
        moveButtonAway(noBtn);
    });

    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButtonAway(noBtn);
    });
}

/**
 * Move NO button to random position when approached
 */
function moveButtonAway(btn) {
    const randomX = (Math.random() - 0.5) * 300;
    const randomY = (Math.random() - 0.5) * 300;
    
    btn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

/**
 * Create heart explosion effect from button
 */
function playHeartExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particleCount = 30;
    const hearts = ['❤️', '💕', '💖', '💗', '💝', '💞'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'heart-particle';
        particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Random angle and distance
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 150 + Math.random() * 150;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animation = `heartExplosion 1.5s ease-out forwards`;
        particle.style.animationDelay = (Math.random() * 0.3) + 's';

        document.body.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => particle.remove(), 2000);
    }
}

/**
 * Play romantic background music
 */
function playSound() {
    // Using Web Audio API to create romantic ambiance sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        // Create a simple romantic chord
        const notes = [261.63, 329.63, 392.00]; // C, E, G
        
        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
            
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            
            oscillator.start(now);
            oscillator.stop(now + 1);
        });
    } catch (e) {
        console.log('Audio API not available');
    }
}

/* ========================================
   VERIFY PAGE (verify.html)
   ======================================== */

function initVerifyPage() {
    const magicInput = document.getElementById('magicInput');
    const continueBtn = document.getElementById('continueBtn');
    const errorMessage = document.getElementById('errorMessage');

    if (!magicInput || !continueBtn) return;

    const magicWords = 'i love you too';

    // Focus on input on page load
    setTimeout(() => magicInput.focus(), 500);

    // Check input on every keystroke
    magicInput.addEventListener('input', () => {
        const inputValue = magicInput.value.trim().toLowerCase();
        errorMessage.textContent = '';

        if (inputValue === magicWords) {
            continueBtn.disabled = false;
            continueBtn.classList.add('success');
        } else {
            continueBtn.disabled = true;
            continueBtn.classList.remove('success');
        }
    });

    // Handle continue button click
    continueBtn.addEventListener('click', () => {
        if (!continueBtn.disabled) {
            playHeartBurst();
            
            setTimeout(() => {
                window.location.href = 'gallery.html';
            }, 800);
        }
    });

    // Handle incorrect input on button click attempt
    magicInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && continueBtn.disabled) {
            showError(magicInput, errorMessage);
        }
    });
}

/**
 * Show error message and shake input
 */
function showError(input, messageEl) {
    input.classList.add('shake');
    messageEl.textContent = "Ayy 😜 that's not the correct words";

    setTimeout(() => {
        input.classList.remove('shake');
    }, 500);

    setTimeout(() => {
        messageEl.textContent = '';
    }, 3000);
}

/**
 * Heart burst animation (smaller version of explosion)
 */
function playHeartBurst() {
    const particleCount = 20;
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'heart-particle';
        particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 100 + Math.random() * 120;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animation = `heartExplosion 1.2s ease-out forwards`;
        particle.style.animationDelay = (Math.random() * 0.2) + 's';

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1500);
    }
}

/* ========================================
   GALLERY PAGE (gallery.html)
   ======================================== */

function initGalleryPage() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const nextBtn = document.getElementById('nextBtn');

    if (!galleryItems.length || !lightbox) return;

    // Open lightbox on gallery item click
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imageUrl = item.querySelector('img').src;
            lightboxImage.src = imageUrl;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Next button navigation
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            window.location.href = 'final.html';
        });
    }
}

/* ========================================
   FINAL PAGE (final.html)
   ======================================== */

function initFinalPage() {
    startLoveLetterTypewriter();


    const finalYesBtn = document.getElementById('finalYesBtn');
    const thinkAgainBtn = document.getElementById('thinkAgainBtn');
    const typewriterText = document.getElementById('typewriterText');
    const finalMessage = document.getElementById('finalMessage');

    if (!finalYesBtn || !thinkAgainBtn) return;

    // Add some delay before enabling buttons (let typewriter finish)
    setTimeout(() => {
        // YES button - Fireworks and final message
        finalYesBtn.addEventListener('click', () => {
            playFireworks();
            showFinalMessage(finalMessage);
            finalYesBtn.disabled = true;
            thinkAgainBtn.disabled = true;
        });

        // THINK AGAIN button - Escape behavior
        thinkAgainBtn.addEventListener('mouseover', () => {
            moveButtonAway(thinkAgainBtn);
        });

        thinkAgainBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            moveButtonAway(thinkAgainBtn);
        });
    }, 1000);
}

/**
 * Create fireworks animation
 */
function playFireworks() {
    const fireworksContainer = document.querySelector('.fireworks-container');
    const burstCount = 8;
    const particlesPerBurst = 30;

    for (let burst = 0; burst < burstCount; burst++) {
        setTimeout(() => {
            const randomX = Math.random() * window.innerWidth;
            const randomY = Math.random() * (window.innerHeight * 0.6);

            for (let i = 0; i < particlesPerBurst; i++) {
                const firework = document.createElement('div');
                firework.className = 'firework';
                
                const emojis = ['✨', '💖', '💝', '💗', '⭐', '🎆'];
                firework.textContent = emojis[Math.floor(Math.random() * emojis.length)];

                const angle = (i / particlesPerBurst) * Math.PI * 2;
                const distance = 80 + Math.random() * 120;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;

                firework.style.left = randomX + 'px';
                firework.style.top = randomY + 'px';
                firework.style.setProperty('--tx', tx + 'px');
                firework.style.setProperty('--ty', ty + 'px');
                firework.style.fontSize = (1 + Math.random()) + 'rem';
                firework.style.animation = `firework 1.5s ease-out forwards`;
                firework.style.animationDelay = (Math.random() * 0.2) + 's';

                if (fireworksContainer) {
                    fireworksContainer.appendChild(firework);
                }

                setTimeout(() => firework.remove(), 2000);
            }
        }, burst * 200);
    }
}

/**
 * Show final romantic message
 */
function showFinalMessage(messageEl) {
    if (!messageEl) return;

    messageEl.textContent = 'You are officially my forever ❤️';
    messageEl.style.animation = 'none';
    
    // Trigger reflow to restart animation
    void messageEl.offsetWidth;
    messageEl.style.animation = 'slideDown 0.8s ease-out forwards';

    // Add heart rain effect
    playHeartRain();
}

/**
 * Create heart rain effect
 */
function playHeartRain() {
    const heartCount = 30;
    const hearts = ['❤️', '💕', '💖', '💗', '💝', '💞'];

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        const randomX = Math.random() * window.innerWidth;
        const fallDistance = window.innerHeight + 200;
        
        heart.style.left = randomX + 'px';
        heart.style.top = '-50px';
        heart.style.fontSize = (1.2 + Math.random() * 1.2) + 'rem';
        heart.style.opacity = '0.7';
        heart.style.animation = 'none';
        
        // Custom fall animation
        heart.style.transition = `all ${3 + Math.random() * 2}s linear`;

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.style.transform = `translateY(${fallDistance}px) rotate(${Math.random() * 360}deg)`;
            heart.style.opacity = '0';
        }, 50);

        setTimeout(() => heart.remove(), 5500);
    }
}

/* ========================================
   EVENT LISTENERS FOR PAGE VISIBILITY
   ======================================== */

/**
 * Refresh floating hearts when page becomes visible
 */
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        createFloatingHearts();
    }
});

/* ========================================
   PREVENT ACCIDENTAL NAVIGATION
   ======================================== */

/**
 * Warn user if they try to leave during animations
 */
window.addEventListener('beforeunload', (e) => {
    const currentPage = getCurrentPage();
    // Only prevent if animations are active
    if (currentPage === 'index.html' || currentPage === 'final.html') {
        // Don't show warning - let them navigate freely
        // This is just for clean exit
    }
});
/* ========================================
   TYPEWRITER LOVE LETTER (FINAL PAGE)
   ======================================== */

function startLoveLetterTypewriter() {
    const element = document.getElementById("typewriterText");
    if (!element) return;

    const text = `I don't know when you became
the most important part of my day.

Talking to you makes everything better.
Even a normal day feels special
when you are in it.

I may not be perfect,
but my feelings for you are real.

I just want to make you smile,
be there for you,
and stay beside you
for a very long time.

So… will you be mine Forever Ammu ?
❤️`;

    const speed = 50; // 50ms per character
    let i = 0;

    element.textContent = ""; // clear existing text

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}
