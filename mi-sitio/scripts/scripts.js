document.addEventListener('DOMContentLoaded', function() {
    const mascot = document.getElementById('mascot');
    const wrapper = document.querySelector('.mascot-wrapper');
    const inner = document.querySelector('.mascot-inner');

    const hasMascot = (!!mascot && !!wrapper && !!inner);
    if (!hasMascot) {
        console.log('Mascot element or wrapper not found — mascot features disabled');
    }

    if (hasMascot) {
        console.log('🔍 Mascot element found:', mascot);

        if (mascot.tagName === 'MODEL-VIEWER') {
        console.log('📁 Loading 3D model:', mascot.getAttribute('src'));
        
        mascot.addEventListener('load', () => {
            console.log('✅ Mascota 3D cargada correctamente!');
            console.log('Buscando animaciones...');
            const animations = mascot.availableAnimations;
            console.log('Animaciones disponibles:', animations);
            
            if (animations && animations.length > 0) {
                const walkAnim = animations.find(name => 
                    name.toLowerCase().includes('walk') || 
                    name.toLowerCase().includes('run') ||
                    name.toLowerCase().includes('move'));
                
                if (walkAnim) {
                    console.log('¡Encontrada animación de caminar!:', walkAnim);
                    mascot.setAttribute('animation-name', walkAnim);
                    mascot.setAttribute('autoplay', true);
                } else {
                    console.log('No se encontró animación de caminar, usando primera disponible:', animations[0]);
                    mascot.setAttribute('animation-name', animations[0]);
                }
            } else {
                console.log('No se encontraron animaciones en el modelo');
            }
        });
        
        mascot.addEventListener('error', (event) => {
            console.error('❌ Error cargando modelo 3D:', event.detail);
            const errorMsg = document.createElement('div');
            errorMsg.style.color = '#dc2626';
            errorMsg.style.marginTop = '8px';
            errorMsg.textContent = 'Error cargando el modelo 3D. Por favor recarga la página.';
            wrapper.appendChild(errorMsg);
        });
    }
        
        let roam = true; 
        let wrapperW = 160;
        let wrapperH = 160;

        wrapper.classList.add('roam');

        let pos = { x: 50, y: window.innerHeight / 2 };
        let vel = { x: 90 + Math.random() * 50, y: (Math.random() - 0.5) * 40 }; // px por segundo
        let lastTime = null;

        function randomizeVelocity() {
            const speed = 60 + Math.random() * 140;
            const angle = (Math.random() - 0.5) * Math.PI / 3; // no sube/brinca demasiado
            const sign = Math.random() < 0.5 ? -1 : 1;
            vel.x = sign * speed;
            vel.y = Math.tan(angle) * speed;
        }
        let changeTimer = 0;

        function step(t) {
            if (!lastTime) lastTime = t;
            const dt = Math.min(0.05, (t - lastTime) / 1000); // cap dt
            lastTime = t;

            if (roam) {
                pos.x += vel.x * dt;
                pos.y += vel.y * dt;

                wrapperW = wrapper.offsetWidth || 140;
                wrapperH = wrapper.offsetHeight || 140;

                const minX = 8;
                const minY = 8;
                const maxX = window.innerWidth - wrapperW - 8;
                const maxY = window.innerHeight - wrapperH - 8;

                if (pos.x < minX) { pos.x = minX; vel.x = Math.abs(vel.x); randomizeVelocity(); }
                if (pos.x > maxX) { pos.x = maxX; vel.x = -Math.abs(vel.x); randomizeVelocity(); }
                if (pos.y < minY) { pos.y = minY; vel.y = Math.abs(vel.y); }
                if (pos.y > maxY) { pos.y = maxY; vel.y = -Math.abs(vel.y); }

                wrapper.style.left = Math.round(pos.x) + 'px';
                wrapper.style.top = Math.round(pos.y) + 'px';

                if (vel.x < 0) inner.classList.add('flip'); else inner.classList.remove('flip');

                const speed = Math.hypot(vel.x, vel.y);
                if (speed > 80) {
                    wrapper.classList.add('walking');
                    if (mascot.availableAnimations?.length > 0) {
                        mascot.setAttribute('autoplay', true);
                    }
                } else {
                    wrapper.classList.remove('walking');
                    if (mascot.availableAnimations?.length > 0) {
                        mascot.setAttribute('autoplay', false);
                    }
                }

                changeTimer -= dt;
                if (changeTimer <= 0) { changeTimer = 2 + Math.random() * 3; randomizeVelocity(); }
            }

            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);

        // Pausar en hover y permitir arrastre (para mover manualmente)
        let isPaused = false;
        wrapper.addEventListener('mouseenter', () => { isPaused = true; roam = false; wrapper.classList.remove('walking'); });
        wrapper.addEventListener('mouseleave', () => { isPaused = false; roam = true; });

        // Arrastrar manualmente la mascota con pointer events
        let dragging = false;
        let dragOffset = { x: 0, y: 0 };
        wrapper.style.touchAction = 'none';
        wrapper.addEventListener('pointerdown', (e) => {
            dragging = true; roam = false;
            dragOffset.x = e.clientX - wrapper.getBoundingClientRect().left;
            dragOffset.y = e.clientY - wrapper.getBoundingClientRect().top;
            wrapper.setPointerCapture(e.pointerId);
        });
        wrapper.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            pos.x = e.clientX - dragOffset.x;
            pos.y = e.clientY - dragOffset.y;
            wrapper.style.left = pos.x + 'px';
            wrapper.style.top = pos.y + 'px';
        });
        wrapper.addEventListener('pointerup', (e) => { 
            dragging = false; 
            roam = true; // Reactivar el movimiento después del arrastre
            randomizeVelocity(); // Dar nueva velocidad aleatoria
        });
        wrapper.addEventListener('pointercancel', () => { 
            dragging = false; 
            roam = true; // Reactivar el movimiento si se cancela el arrastre
            randomizeVelocity();
        });
    }

    // Gear (tuerca) panel behavior and mascot visibility toggle
    const gearButton = document.getElementById('gear-button');
    const gearPanel = document.getElementById('gear-panel');
    if (gearButton && gearPanel) {
        gearButton.addEventListener('click', (e) => {
            const shown = gearPanel.classList.toggle('show');
            gearButton.setAttribute('aria-expanded', shown ? 'true' : 'false');
        });
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!gearPanel.contains(e.target) && !gearButton.contains(e.target)) {
                if (gearPanel.classList.contains('show')) {
                    gearPanel.classList.remove('show');
                    gearButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    // Mascot visibility toggle (persisted)
    const mascotToggleBtn = document.querySelector('[data-mascot-toggle]');
    const mascotSizeBtn = document.querySelector('[data-mascot-small]');
    function setMascotSize(size) {
        const mWrap = document.querySelector('.mascot-wrapper');
        const mv = document.getElementById('mascot');
        if (!mWrap) return;
        if (size === 'small') {
            mWrap.classList.add('mascot-small');
            try { localStorage.setItem('mascot-size', 'small'); } catch(e) {}
            if (mascotSizeBtn) mascotSizeBtn.setAttribute('aria-pressed', 'true');
            if (mascotSizeBtn) mascotSizeBtn.textContent = 'Mascota pequeña ✓';
        } else {
            mWrap.classList.remove('mascot-small');
            try { localStorage.setItem('mascot-size', 'normal'); } catch(e) {}
            if (mascotSizeBtn) mascotSizeBtn.setAttribute('aria-pressed', 'false');
            if (mascotSizeBtn) mascotSizeBtn.textContent = 'Mascota pequeña';
        }
    }
    function setMascotVisible(visible) {
        const mWrap = document.querySelector('.mascot-wrapper');
        if (!mWrap) return;
        mWrap.style.display = visible ? '' : 'none';
        try { localStorage.setItem('mascot-visible', visible ? '1' : '0'); } catch(e) {}
        if (mascotToggleBtn) mascotToggleBtn.setAttribute('aria-pressed', visible ? 'true' : 'false');
        if (mascotToggleBtn) mascotToggleBtn.textContent = visible ? 'Ocultar mascota' : 'Mostrar mascota';
    }
    if (mascotToggleBtn) {
        mascotToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const current = mascotToggleBtn.getAttribute('aria-pressed') === 'true';
            setMascotVisible(!current);
        });
    }
    if (mascotSizeBtn) {
        mascotSizeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // toggle between normal and small
            const isSmall = mascotSizeBtn.getAttribute('aria-pressed') === 'true';
            setMascotSize(isSmall ? 'normal' : 'small');
        });
    }
    // Restore mascot visibility from storage
    try {
        const stored = localStorage.getItem('mascot-visible');
        const visible = stored === null ? true : stored === '1';
        setMascotVisible(visible);
    } catch(e) {}
    // Restore mascot size from storage
    try {
        const storedSize = localStorage.getItem('mascot-size');
        if (storedSize === 'small') setMascotSize('small');
        else setMascotSize('normal');
    } catch(e) {}
});