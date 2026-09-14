/**
 * DEVELOPER MINIGAMES & INTERACTIVE ARCADE ENGINE
 * Features:
 * 1. Cyber Code Breaker (Hacking & Logic Puzzle)
 * 2. Binary Snake (Retro Cyber Grid & Touch D-Pad)
 * 3. 3D Particle Blaster (Three.js WebGL Laser Action)
 * 4. Web Audio Synthesizer (Procedural Retro Arcade Sound FX)
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. SOUND SYNTHESIZER (WEB AUDIO API)
    // =========================================================================
    let audioCtx = null;
    let isMuted = localStorage.getItem('games_sound_muted') === 'true';

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
    }

    function playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.08) {
        if (isMuted) return;
        try {
            initAudio();
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {}
    }

    const soundFX = {
        blip: () => playTone(540, 'sine', 0.06, 0.06),
        key: () => playTone(680, 'triangle', 0.05, 0.05),
        success: () => {
            playTone(523.25, 'triangle', 0.12, 0.08);
            setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.08), 100);
            setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.1), 220);
        },
        error: () => {
            playTone(180, 'sawtooth', 0.18, 0.09);
            setTimeout(() => playTone(140, 'sawtooth', 0.2, 0.09), 120);
        },
        laser: () => {
            if (isMuted) return;
            try {
                initAudio();
                if (!audioCtx) return;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(880, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.15);
            } catch (e) {}
        },
        blast: () => {
            if (isMuted) return;
            try {
                initAudio();
                if (!audioCtx) return;
                const bufferSize = audioCtx.sampleRate * 0.2;
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = audioCtx.createBufferSource();
                noise.buffer = buffer;
                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
                noise.connect(gain);
                gain.connect(audioCtx.destination);
                noise.start();
            } catch (e) {}
        }
    };

    // Sound toggle button
    const soundBtn = document.getElementById('btn-sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    function updateSoundBtnUI() {
        if (!soundIcon) return;
        soundIcon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }
    updateSoundBtnUI();

    soundBtn?.addEventListener('click', () => {
        isMuted = !isMuted;
        localStorage.setItem('games_sound_muted', isMuted);
        updateSoundBtnUI();
        if (!isMuted) soundFX.blip();
    });

    // =========================================================================
    // 2. THEME & GLOBAL NAVIGATION
    // =========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark') document.body.classList.add('dark-theme');

    themeToggleBtn?.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
        soundFX.blip();
    });

    // Mobile Hamburger Toggle
    const navHamburger = document.getElementById('nav-hamburger');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    const mobileClose = document.getElementById('mobile-menu-close');

    function openMobileMenu() {
        mobileOverlay?.classList.add('open');
        mobileDrawer?.classList.add('open');
        navHamburger?.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileOverlay?.classList.remove('open');
        mobileDrawer?.classList.remove('open');
        navHamburger?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    navHamburger?.addEventListener('click', openMobileMenu);
    mobileClose?.addEventListener('click', closeMobileMenu);
    mobileOverlay?.addEventListener('click', closeMobileMenu);

    // =========================================================================
    // 3. HIGH SCORE PERSISTENCE
    // =========================================================================
    function getHighScore(gameId) {
        return parseInt(localStorage.getItem(`hs_${gameId}`) || '0', 10);
    }

    function saveHighScore(gameId, score) {
        const current = getHighScore(gameId);
        if (score > current) {
            localStorage.setItem(`hs_${gameId}`, score);
            updateCardHighScores();
            return true;
        }
        return false;
    }

    function updateCardHighScores() {
        ['code-breaker', 'binary-snake', 'particle-blaster'].forEach(id => {
            const hs = getHighScore(id);
            const el = document.getElementById(`card-hs-${id}`);
            if (el) el.textContent = hs.toLocaleString();
        });
    }
    updateCardHighScores();

    // =========================================================================
    // 4. ARCADE ARENA MANAGER
    // =========================================================================
    let activeGame = 'code-breaker';
    const arenaTitle = document.getElementById('arena-game-title');
    const arenaStatus = document.getElementById('arena-status-badge');
    const arenaInstructions = document.getElementById('arena-instructions');
    const hudScoreEl = document.getElementById('hud-score');
    const hudBestEl = document.getElementById('hud-best');
    const hudExtraLabel = document.getElementById('hud-extra-label');
    const hudExtraVal = document.getElementById('hud-extra-val');
    const restartBtn = document.getElementById('btn-restart-game');

    const gameMeta = {
        'code-breaker': {
            title: 'Cyber Code Breaker',
            instructions: 'Crack the 4-digit security PIN. Green = correct digit & position, Yellow = correct digit in wrong position, Gray = digit not in PIN.',
            extraLabel: 'ATTEMPTS',
            init: () => initCodeBreaker()
        },
        'binary-snake': {
            title: 'Binary Snake',
            instructions: 'Use Arrow Keys, WASD, or the D-Pad to steer the binary snake. Devour software bugs 🐛 to grow and rack up points!',
            extraLabel: 'LENGTH',
            init: () => initBinarySnake()
        },
        'particle-blaster': {
            title: '3D Particle Blaster',
            instructions: 'Hover crosshair over rotating 3D nodes & click to shoot laser beams! Destroy as many spatial nodes as you can in 30 seconds.',
            extraLabel: 'TIME',
            init: () => initParticleBlaster()
        }
    };

    window.launchGame = function(gameId, shouldScroll = true) {
        if (!gameMeta[gameId]) return;
        activeGame = gameId;

        // Highlight active card
        document.querySelectorAll('.game-showcase-card').forEach(card => {
            card.classList.toggle('active-selected', card.id === `card-${gameId}`);
        });

        // Hide all stages, show target stage
        document.querySelectorAll('.game-stage').forEach(stage => stage.style.display = 'none');
        const targetStage = document.getElementById(`stage-${gameId}`);
        if (targetStage) targetStage.style.display = 'block';

        // Update Arena Header
        if (arenaTitle) arenaTitle.textContent = gameMeta[gameId].title;
        if (arenaInstructions) arenaInstructions.textContent = gameMeta[gameId].instructions;
        if (arenaStatus) {
            arenaStatus.textContent = 'GAME ACTIVE';
            arenaStatus.className = 'arcade-status-pill in-game';
        }
        if (hudBestEl) hudBestEl.textContent = getHighScore(gameId).toLocaleString();
        if (hudScoreEl) hudScoreEl.textContent = '0';
        if (hudExtraLabel) hudExtraLabel.textContent = gameMeta[gameId].extraLabel;

        // Initialize selected game
        gameMeta[gameId].init();
        if (shouldScroll) soundFX.blip();

        // Smooth scroll to arena only if requested
        if (shouldScroll) {
            const arenaSection = document.getElementById('game-arena');
            if (arenaSection) {
                arenaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    restartBtn?.addEventListener('click', () => {
        soundFX.blip();
        if (gameMeta[activeGame]) gameMeta[activeGame].init();
    });

    // =========================================================================
    // 5. GAME 1: CYBER CODE BREAKER
    // =========================================================================
    let cbSecretCode = [];
    let cbCurrentInput = [];
    let cbAttemptsLeft = 6;
    let cbIsOver = false;
    let cbScore = 0;

    function initCodeBreaker() {
        cbIsOver = false;
        cbCurrentInput = [];
        cbAttemptsLeft = 6;
        cbScore = 0;

        // Generate 4 unique random digits
        const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        cbSecretCode = [];
        for (let i = 0; i < 4; i++) {
            const idx = Math.floor(Math.random() * pool.length);
            cbSecretCode.push(pool.splice(idx, 1)[0]);
        }

        // Reset Secret Slots UI
        for (let i = 0; i < 4; i++) {
            const slot = document.getElementById(`slot-${i}`);
            if (slot) {
                slot.textContent = '?';
                slot.className = 'cb-slot';
            }
        }

        // Reset Current Input preview
        updateCbInputUI();

        // Reset Attempts
        const attEl = document.getElementById('cb-attempts-left');
        if (attEl) attEl.textContent = `ATTEMPTS LEFT: ${cbAttemptsLeft}`;
        if (hudExtraVal) hudExtraVal.textContent = `${cbAttemptsLeft} Left`;
        if (hudScoreEl) hudScoreEl.textContent = '0';
        if (hudBestEl) hudBestEl.textContent = getHighScore('code-breaker').toLocaleString();

        // Reset Log
        const logBody = document.getElementById('cb-terminal-log');
        if (logBody) {
            logBody.innerHTML = `
                <div class="log-line text-muted">[INIT] CYBERNET FIREWALL v4.18 LOCKED</div>
                <div class="log-line text-muted">[SYS] PIN HAS 4 UNIQUE DIGITS (0-9)</div>
                <div class="log-line text-mint">&gt; ENTER 4-DIGIT GUESS ON KEYPAD OR KEYBOARD...</div>
            `;
        }

        if (arenaStatus) {
            arenaStatus.textContent = 'FIREWALL LOCKED';
            arenaStatus.className = 'arcade-status-pill in-game';
        }
    }

    function updateCbInputUI() {
        const previewEl = document.getElementById('cb-input-preview');
        if (!previewEl) return;
        previewEl.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const span = document.createElement('span');
            if (i < cbCurrentInput.length) {
                span.className = 'cb-char active';
                span.textContent = cbCurrentInput[i];
            } else {
                span.className = 'cb-char placeholder';
                span.textContent = '_';
            }
            previewEl.appendChild(span);
        }
    }

    function handleCbInput(digit) {
        if (cbIsOver) return;
        if (cbCurrentInput.length < 4 && !cbCurrentInput.includes(digit)) {
            cbCurrentInput.push(digit);
            soundFX.key();
            updateCbInputUI();
        }
    }

    function handleCbBackspace() {
        if (cbIsOver || cbCurrentInput.length === 0) return;
        cbCurrentInput.pop();
        soundFX.key();
        updateCbInputUI();
    }

    function handleCbSubmit() {
        if (cbIsOver) return;
        if (cbCurrentInput.length !== 4) {
            soundFX.error();
            appendCbLog('[ERROR] GUESS MUST BE EXACTLY 4 UNIQUE DIGITS', 'text-red');
            return;
        }

        cbAttemptsLeft--;
        const guess = [...cbCurrentInput];
        cbCurrentInput = [];
        updateCbInputUI();

        // Calculate Bulls (exact match) and Cows (misplaced)
        let exact = 0;
        let misplaced = 0;

        for (let i = 0; i < 4; i++) {
            if (guess[i] === cbSecretCode[i]) {
                exact++;
            } else if (cbSecretCode.includes(guess[i])) {
                misplaced++;
            }
        }

        // Update HUD Attempts
        const attEl = document.getElementById('cb-attempts-left');
        if (attEl) attEl.textContent = `ATTEMPTS LEFT: ${cbAttemptsLeft}`;
        if (hudExtraVal) hudExtraVal.textContent = `${cbAttemptsLeft} Left`;

        // Check Victory
        if (exact === 4) {
            cbIsOver = true;
            soundFX.success();
            revealCbSecret(true);

            cbScore = 1000 + (cbAttemptsLeft * 250);
            if (hudScoreEl) hudScoreEl.textContent = cbScore.toLocaleString();
            saveHighScore('code-breaker', cbScore);

            appendCbLog(`[ACCESS GRANTED] PIN [${guess.join('')}] IS CORRECT!`, 'text-mint');
            appendCbLog(`[BREACH COMPLETE] SCORE: +${cbScore} PTS EARNED`, 'text-mint');
            
            if (arenaStatus) {
                arenaStatus.textContent = 'ACCESS GRANTED 🎉';
                arenaStatus.className = 'arcade-status-pill win';
            }
            return;
        }

        // Normal Feedback Log
        soundFX.blip();
        const guessStr = guess.join(' ');
        appendCbLog(`GUESS [${guessStr}] ➔ ${exact} EXACT (🟢), ${misplaced} MISPLACED (🟡)`, 'text-yellow');

        // Check Defeat
        if (cbAttemptsLeft <= 0) {
            cbIsOver = true;
            soundFX.error();
            revealCbSecret(false);
            appendCbLog(`[LOCKDOWN] OUT OF ATTEMPTS! CODE WAS: ${cbSecretCode.join('')}`, 'text-red');
            if (arenaStatus) {
                arenaStatus.textContent = 'ACCESS DENIED 🛑';
                arenaStatus.className = 'arcade-status-pill lose';
            }
        }
    }

    function revealCbSecret(isWin) {
        for (let i = 0; i < 4; i++) {
            const slot = document.getElementById(`slot-${i}`);
            if (slot) {
                slot.textContent = cbSecretCode[i];
                slot.className = `cb-slot ${isWin ? 'win' : 'lose'}`;
            }
        }
    }

    function appendCbLog(text, colorClass = '') {
        const logBody = document.getElementById('cb-terminal-log');
        if (!logBody) return;
        const line = document.createElement('div');
        line.className = `log-line ${colorClass}`;
        line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        logBody.appendChild(line);
        logBody.scrollTop = logBody.scrollHeight;
    }

    // Keypad Event Listeners
    document.querySelectorAll('.cb-key[data-val]').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = parseInt(btn.getAttribute('data-val'), 10);
            handleCbInput(val);
        });
    });
    document.getElementById('cb-key-back')?.addEventListener('click', handleCbBackspace);
    document.getElementById('cb-key-enter')?.addEventListener('click', handleCbSubmit);

    // Keyboard support when Code Breaker is active
    document.addEventListener('keydown', (e) => {
        if (activeGame !== 'code-breaker' || cbIsOver) return;
        if (e.key >= '0' && e.key <= '9') {
            handleCbInput(parseInt(e.key, 10));
        } else if (e.key === 'Backspace') {
            handleCbBackspace();
        } else if (e.key === 'Enter') {
            handleCbSubmit();
        }
    });

    // =========================================================================
    // 6. GAME 2: BINARY SNAKE
    // =========================================================================
    const snakeCanvas = document.getElementById('snake-canvas');
    const snakeCtx = snakeCanvas?.getContext('2d');
    const snakeOverlay = document.getElementById('snake-overlay');
    const snakeOverlayTitle = document.getElementById('snake-overlay-title');
    const snakeOverlayMsg = document.getElementById('snake-overlay-msg');
    const startSnakeBtn = document.getElementById('btn-start-snake');

    let snake = [];
    let snakeDir = 'RIGHT';
    let nextSnakeDir = 'RIGHT';
    let snakeFood = { x: 0, y: 0, type: 'bug' };
    let snakeScore = 0;
    let snakeLoopId = null;
    let snakeSpeed = 120;
    let isSnakeRunning = false;
    const snakeGridSize = 20;
    const tileCount = 24; // 480 / 20 = 24

    function initBinarySnake() {
        if (snakeLoopId) clearTimeout(snakeLoopId);
        isSnakeRunning = false;
        snakeScore = 0;
        snakeSpeed = 125;
        snakeDir = 'RIGHT';
        nextSnakeDir = 'RIGHT';

        // Initial 4-segment snake with binary labels
        snake = [
            { x: 10, y: 12, char: '1' },
            { x: 9,  y: 12, char: '0' },
            { x: 8,  y: 12, char: '1' },
            { x: 7,  y: 12, char: '0' }
        ];

        spawnSnakeFood();
        drawSnakeScene();

        // Show Overlay
        if (snakeOverlay) snakeOverlay.style.display = 'flex';
        if (snakeOverlayTitle) snakeOverlayTitle.textContent = 'BINARY SNAKE';
        if (snakeOverlayMsg) snakeOverlayMsg.textContent = 'Navigate through cyberspace & eat software bugs to compile your binary chain!';
        if (startSnakeBtn) startSnakeBtn.textContent = 'Start Game';

        if (hudScoreEl) hudScoreEl.textContent = '0';
        if (hudExtraVal) hudExtraVal.textContent = '4 Bits';
        if (hudBestEl) hudBestEl.textContent = getHighScore('binary-snake').toLocaleString();
        if (arenaStatus) {
            arenaStatus.textContent = 'READY TO PLAY';
            arenaStatus.className = 'arcade-status-pill';
        }
    }

    function spawnSnakeFood() {
        let valid = false;
        while (!valid) {
            snakeFood.x = Math.floor(Math.random() * tileCount);
            snakeFood.y = Math.floor(Math.random() * tileCount);
            valid = !snake.some(seg => seg.x === snakeFood.x && seg.y === snakeFood.y);
        }
        const r = Math.random();
        snakeFood.type = r > 0.85 ? 'core' : (r > 0.65 ? 'disk' : 'bug');
    }

    function startSnakeGame() {
        if (snakeOverlay) snakeOverlay.style.display = 'none';
        isSnakeRunning = true;
        if (arenaStatus) {
            arenaStatus.textContent = 'STREAM ACTIVE';
            arenaStatus.className = 'arcade-status-pill in-game';
        }
        soundFX.blip();
        runSnakeTick();
    }

    startSnakeBtn?.addEventListener('click', startSnakeGame);

    function runSnakeTick() {
        if (!isSnakeRunning) return;

        snakeDir = nextSnakeDir;
        const head = { ...snake[0] };

        if (snakeDir === 'UP') head.y--;
        else if (snakeDir === 'DOWN') head.y++;
        else if (snakeDir === 'LEFT') head.x--;
        else if (snakeDir === 'RIGHT') head.x++;

        // Collision with walls
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOverSnake();
            return;
        }

        // Collision with self
        if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            gameOverSnake();
            return;
        }

        // Add next binary character
        head.char = head.char === '1' ? '0' : '1';
        snake.unshift(head);

        // Check Food
        if (head.x === snakeFood.x && head.y === snakeFood.y) {
            let pts = 100;
            if (snakeFood.type === 'disk') pts = 250;
            else if (snakeFood.type === 'core') pts = 500;

            snakeScore += pts;
            soundFX.success();

            if (hudScoreEl) hudScoreEl.textContent = snakeScore.toLocaleString();
            if (hudExtraVal) hudExtraVal.textContent = `${snake.length} Bits`;
            saveHighScore('binary-snake', snakeScore);

            spawnSnakeFood();
            // Slight acceleration
            snakeSpeed = Math.max(70, 125 - Math.floor(snake.length * 1.5));
        } else {
            snake.pop();
        }

        drawSnakeScene();
        snakeLoopId = setTimeout(runSnakeTick, snakeSpeed);
    }

    function gameOverSnake() {
        isSnakeRunning = false;
        soundFX.error();

        if (snakeOverlay) snakeOverlay.style.display = 'flex';
        if (snakeOverlayTitle) snakeOverlayTitle.textContent = 'SYSTEM CRASH';
        if (snakeOverlayMsg) snakeOverlayMsg.textContent = `Packet Corrupted! Final Score: ${snakeScore.toLocaleString()} pts (Length: ${snake.length} bits).`;
        if (startSnakeBtn) startSnakeBtn.textContent = 'Play Again';

        if (arenaStatus) {
            arenaStatus.textContent = 'CRASH DETECTED';
            arenaStatus.className = 'arcade-status-pill lose';
        }
    }

    function drawSnakeScene() {
        if (!snakeCtx || !snakeCanvas) return;

        const isDark = document.body.classList.contains('dark-theme');

        // Background
        snakeCtx.fillStyle = isDark ? '#06150f' : '#f0faf5';
        snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

        // Grid Lines
        snakeCtx.strokeStyle = isDark ? 'rgba(82, 183, 136, 0.08)' : 'rgba(27, 67, 50, 0.06)';
        snakeCtx.lineWidth = 1;
        for (let i = 0; i <= tileCount; i++) {
            snakeCtx.beginPath();
            snakeCtx.moveTo(i * snakeGridSize, 0);
            snakeCtx.lineTo(i * snakeGridSize, snakeCanvas.height);
            snakeCtx.stroke();

            snakeCtx.beginPath();
            snakeCtx.moveTo(0, i * snakeGridSize);
            snakeCtx.lineTo(snakeCanvas.width, i * snakeGridSize);
            snakeCtx.stroke();
        }

        // Draw Food
        const fx = snakeFood.x * snakeGridSize;
        const fy = snakeFood.y * snakeGridSize;
        snakeCtx.font = '14px monospace';
        snakeCtx.textAlign = 'center';
        snakeCtx.textBaseline = 'middle';

        if (snakeFood.type === 'core') {
            snakeCtx.fillStyle = '#fbbf24';
            snakeCtx.fillText('⚡', fx + 10, fy + 10);
        } else if (snakeFood.type === 'disk') {
            snakeCtx.fillStyle = '#60a5fa';
            snakeCtx.fillText('💾', fx + 10, fy + 10);
        } else {
            snakeCtx.fillStyle = '#ec4899';
            snakeCtx.fillText('🐛', fx + 10, fy + 10);
        }

        // Draw Snake
        snake.forEach((seg, idx) => {
            const px = seg.x * snakeGridSize;
            const py = seg.y * snakeGridSize;

            if (idx === 0) {
                // Head
                snakeCtx.fillStyle = isDark ? '#52b788' : '#1b4332';
                snakeCtx.beginPath();
                snakeCtx.roundRect(px + 1, py + 1, snakeGridSize - 2, snakeGridSize - 2, 5);
                snakeCtx.fill();

                snakeCtx.fillStyle = '#ffffff';
                snakeCtx.font = 'bold 11px JetBrains Mono, monospace';
                snakeCtx.fillText(seg.char, px + 10, py + 10);
            } else {
                // Body
                const opacity = Math.max(0.35, 1 - (idx / (snake.length + 5)));
                snakeCtx.fillStyle = isDark ? `rgba(82, 183, 136, ${opacity})` : `rgba(45, 106, 79, ${opacity})`;
                snakeCtx.beginPath();
                snakeCtx.roundRect(px + 2, py + 2, snakeGridSize - 4, snakeGridSize - 4, 3);
                snakeCtx.fill();

                snakeCtx.fillStyle = isDark ? '#ffffff' : '#ffffff';
                snakeCtx.font = '10px JetBrains Mono, monospace';
                snakeCtx.fillText(seg.char, px + 10, py + 10);
            }
        });
    }

    // Direction handler
    function changeSnakeDirection(newDir) {
        if (!isSnakeRunning) return;
        if (newDir === 'UP' && snakeDir !== 'DOWN') nextSnakeDir = 'UP';
        else if (newDir === 'DOWN' && snakeDir !== 'UP') nextSnakeDir = 'DOWN';
        else if (newDir === 'LEFT' && snakeDir !== 'RIGHT') nextSnakeDir = 'LEFT';
        else if (newDir === 'RIGHT' && snakeDir !== 'LEFT') nextSnakeDir = 'RIGHT';
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (activeGame !== 'binary-snake') return;
        if (['ArrowUp', 'KeyW'].includes(e.code)) {
            e.preventDefault();
            changeSnakeDirection('UP');
        } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
            e.preventDefault();
            changeSnakeDirection('DOWN');
        } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
            e.preventDefault();
            changeSnakeDirection('LEFT');
        } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
            e.preventDefault();
            changeSnakeDirection('RIGHT');
        }
    });

    // Touch D-Pad buttons
    document.querySelectorAll('.dpad-btn[data-dir]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const dir = btn.getAttribute('data-dir');
            changeSnakeDirection(dir);
            soundFX.blip();
        });
    });

    // =========================================================================
    // 7. GAME 3: 3D PARTICLE BLASTER (THREE.JS WEBL ENGINE)
    // =========================================================================
    const blasterCanvas = document.getElementById('blaster-canvas');
    const blasterContainer = document.getElementById('blaster-container');
    const blasterOverlay = document.getElementById('blaster-overlay');
    const blasterOverlayTitle = document.getElementById('blaster-overlay-title');
    const blasterOverlayMsg = document.getElementById('blaster-overlay-msg');
    const startBlasterBtn = document.getElementById('btn-start-blaster');
    const crosshairEl = document.getElementById('blaster-crosshair');
    const comboEl = document.getElementById('blaster-combo-display');
    const hitsEl = document.getElementById('blaster-hits-display');

    let bScene, bCamera, bRenderer;
    let bTargets = [];
    let bParticles = [];
    let bScore = 0;
    let bHits = 0;
    let bCombo = 1;
    let bComboTimer = null;
    let bTimeLeft = 30;
    let bTimerInterval = null;
    let isBlasterRunning = false;
    let bAnimId = null;
    let bMouse = new THREE.Vector2();
    let bRaycaster = new THREE.Raycaster();

    function initParticleBlaster() {
        if (bTimerInterval) clearInterval(bTimerInterval);
        if (bAnimId) cancelAnimationFrame(bAnimId);
        isBlasterRunning = false;
        bScore = 0;
        bHits = 0;
        bCombo = 1;
        bTimeLeft = 30;

        if (blasterOverlay) blasterOverlay.style.display = 'flex';
        if (blasterOverlayTitle) blasterOverlayTitle.textContent = '3D PARTICLE BLASTER';
        if (blasterOverlayMsg) blasterOverlayMsg.textContent = 'Aim with cursor & click to blast floating 3D spatial nodes into particle explosions within 30 seconds!';
        if (startBlasterBtn) startBlasterBtn.textContent = 'Launch Mission';

        if (hudScoreEl) hudScoreEl.textContent = '0';
        if (hudExtraVal) hudExtraVal.textContent = '30s';
        if (hudBestEl) hudBestEl.textContent = getHighScore('particle-blaster').toLocaleString();
        if (arenaStatus) {
            arenaStatus.textContent = 'READY TO BLAST';
            arenaStatus.className = 'arcade-status-pill';
        }
        if (comboEl) comboEl.textContent = 'COMBO x1';
        if (hitsEl) hitsEl.textContent = 'TARGETS DESTROYED: 0';

        setupThreeBlasterScene();
    }

    function setupThreeBlasterScene() {
        if (!blasterCanvas || !blasterContainer || typeof THREE === 'undefined') return;

        const width = blasterContainer.clientWidth || 700;
        const height = 460;

        if (!bScene) {
            bScene = new THREE.Scene();
            bCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
            bCamera.position.z = 160;

            bRenderer = new THREE.WebGLRenderer({ canvas: blasterCanvas, alpha: true, antialias: true });
            bRenderer.setSize(width, height);
            bRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Ambient Light
            const ambient = new THREE.AmbientLight(0xffffff, 0.8);
            bScene.add(ambient);

            // Pointer tracker on canvas
            blasterContainer.addEventListener('mousemove', (e) => {
                const rect = blasterContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Move custom crosshair
                if (crosshairEl) {
                    crosshairEl.style.left = `${x}px`;
                    crosshairEl.style.top = `${y}px`;
                }

                // Three.js normalized mouse
                bMouse.x = (x / rect.width) * 2 - 1;
                bMouse.y = -(y / rect.height) * 2 + 1;
            });

            blasterContainer.addEventListener('click', onBlasterClick);
        }

        // Clean previous objects
        bTargets.forEach(t => bScene.remove(t.mesh));
        bTargets = [];
        bParticles.forEach(p => bScene.remove(p.mesh));
        bParticles = [];

        // Spawn initial targets
        for (let i = 0; i < 7; i++) {
            spawnTargetNode();
        }

        renderBlasterLoop();
    }

    function spawnTargetNode() {
        const isDark = document.body.classList.contains('dark-theme');
        const color = isDark ? 0x52b788 : 0x1b4332;

        const geometries = [
            new THREE.IcosahedronGeometry(12, 1),
            new THREE.DodecahedronGeometry(13, 0),
            new THREE.OctahedronGeometry(14, 0),
            new THREE.TorusGeometry(11, 4, 12, 24)
        ];
        const geo = geometries[Math.floor(Math.random() * geometries.length)];

        const mat = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.85
        });
        const mesh = new THREE.Mesh(geo, mat);

        mesh.position.x = (Math.random() - 0.5) * 170;
        mesh.position.y = (Math.random() - 0.5) * 110;
        mesh.position.z = (Math.random() - 0.5) * 80;

        const target = {
            mesh: mesh,
            rotSpeedX: (Math.random() - 0.5) * 0.04,
            rotSpeedY: (Math.random() - 0.5) * 0.04,
            floatSpeed: (Math.random() - 0.5) * 0.02
        };

        bScene.add(mesh);
        bTargets.push(target);
    }

    function startBlasterGame() {
        if (blasterOverlay) blasterOverlay.style.display = 'none';
        isBlasterRunning = true;
        bTimeLeft = 30;
        soundFX.laser();

        if (arenaStatus) {
            arenaStatus.textContent = 'MISSION IN PROGRESS';
            arenaStatus.className = 'arcade-status-pill in-game';
        }

        bTimerInterval = setInterval(() => {
            bTimeLeft--;
            if (hudExtraVal) hudExtraVal.textContent = `${bTimeLeft}s`;

            if (bTimeLeft <= 0) {
                gameOverBlaster();
            }
        }, 1000);
    }

    startBlasterBtn?.addEventListener('click', startBlasterGame);

    function onBlasterClick() {
        if (!isBlasterRunning) return;
        soundFX.laser();

        bRaycaster.setFromCamera(bMouse, bCamera);
        const meshes = bTargets.map(t => t.mesh);
        const intersects = bRaycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const hitMesh = intersects[0].object;
            const hitPos = hitMesh.position.clone();

            // Find target object
            const tIdx = bTargets.findIndex(t => t.mesh === hitMesh);
            if (tIdx !== -1) {
                bScene.remove(hitMesh);
                bTargets.splice(tIdx, 1);
            }

            // Explode particles!
            soundFX.blast();
            createParticleExplosion(hitPos);

            // Score & Combo
            bHits++;
            bScore += (150 * bCombo);
            bCombo = Math.min(5, bCombo + 1);

            if (hudScoreEl) hudScoreEl.textContent = bScore.toLocaleString();
            if (hitsEl) hitsEl.textContent = `TARGETS DESTROYED: ${bHits}`;
            if (comboEl) {
                comboEl.textContent = `COMBO x${bCombo}!`;
                comboEl.classList.add('pulse');
                setTimeout(() => comboEl.classList.remove('pulse'), 300);
            }
            saveHighScore('particle-blaster', bScore);

            // Reset combo timer
            if (bComboTimer) clearTimeout(bComboTimer);
            bComboTimer = setTimeout(() => {
                bCombo = 1;
                if (comboEl) comboEl.textContent = 'COMBO x1';
            }, 2500);

            // Respawn
            setTimeout(spawnTargetNode, 200);
        } else {
            // Missed
            bCombo = 1;
            if (comboEl) comboEl.textContent = 'COMBO x1';
        }
    }

    function createParticleExplosion(pos) {
        const count = 45;
        const pGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = [];

        for (let i = 0; i < count; i++) {
            positions[i * 3]     = pos.x;
            positions[i * 3 + 1] = pos.y;
            positions[i * 3 + 2] = pos.z;

            velocities.push({
                x: (Math.random() - 0.5) * 3.5,
                y: (Math.random() - 0.5) * 3.5,
                z: (Math.random() - 0.5) * 3.5
            });
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const isDark = document.body.classList.contains('dark-theme');
        const pMat = new THREE.PointsMaterial({
            color: isDark ? 0x52b788 : 0x2d6a4f,
            size: 3.5,
            transparent: true,
            opacity: 1
        });

        const pMesh = new THREE.Points(pGeo, pMat);
        bScene.add(pMesh);

        bParticles.push({
            mesh: pMesh,
            geo: pGeo,
            mat: pMat,
            velocities: velocities,
            life: 1.0
        });
    }

    function gameOverBlaster() {
        if (bTimerInterval) clearInterval(bTimerInterval);
        isBlasterRunning = false;
        soundFX.success();

        if (blasterOverlay) blasterOverlay.style.display = 'flex';
        if (blasterOverlayTitle) blasterOverlayTitle.textContent = 'MISSION COMPLETE';
        if (blasterOverlayMsg) blasterOverlayMsg.textContent = `Time's Up! Final Score: ${bScore.toLocaleString()} pts (${bHits} nodes blasted).`;
        if (startBlasterBtn) startBlasterBtn.textContent = 'Play Again';

        if (arenaStatus) {
            arenaStatus.textContent = 'MISSION DEBRIEF';
            arenaStatus.className = 'arcade-status-pill win';
        }
    }

    function renderBlasterLoop() {
        bAnimId = requestAnimationFrame(renderBlasterLoop);

        // Animate Targets
        bTargets.forEach(t => {
            t.mesh.rotation.x += t.rotSpeedX;
            t.mesh.rotation.y += t.rotSpeedY;
            t.mesh.position.y += Math.sin(Date.now() * 0.002) * t.floatSpeed;
        });

        // Animate Particle Debris
        for (let i = bParticles.length - 1; i >= 0; i--) {
            const p = bParticles[i];
            p.life -= 0.025;
            p.mat.opacity = p.life;

            const posArr = p.geo.attributes.position.array;
            for (let j = 0; j < p.velocities.length; j++) {
                posArr[j * 3]     += p.velocities[j].x;
                posArr[j * 3 + 1] += p.velocities[j].y;
                posArr[j * 3 + 2] += p.velocities[j].z;
            }
            p.geo.attributes.position.needsUpdate = true;

            if (p.life <= 0) {
                bScene.remove(p.mesh);
                bParticles.splice(i, 1);
            }
        }

        bRenderer?.render(bScene, bCamera);
    }

    // Window resize handler for Three.js Blaster
    window.addEventListener('resize', () => {
        if (!bCamera || !bRenderer || !blasterContainer) return;
        const w = blasterContainer.clientWidth;
        const h = 460;
        bCamera.aspect = w / h;
        bCamera.updateProjectionMatrix();
        bRenderer.setSize(w, h);
    });

    // Automatically launch initial game without scrolling (Cyber Code Breaker)
    launchGame('code-breaker', false);

});
