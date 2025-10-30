// scripts.js - Mascota 3D interactiva
document.addEventListener('DOMContentLoaded', function() {
    const mascot = document.getElementById('mascot');
    const wrapper = document.querySelector('.mascot-wrapper');
    const inner = document.querySelector('.mascot-inner');
    
    // Verificar que la mascota y wrappers existen
    if (!mascot || !wrapper || !inner) {
        console.log('Mascot element or wrapper not found');
        return;
    }
    
    console.log('🔍 Mascot element found:', mascot);
    
    // Debug para modelo 3D
    if (mascot.tagName === 'MODEL-VIEWER') {
        console.log('📁 Loading 3D model: imagenes/masacota3D.glb');
        
        mascot.addEventListener('load', () => {
            console.log('✅ Mascota 3D cargada correctamente!');
        });
        
        mascot.addEventListener('error', (event) => {
            console.error('❌ Error cargando modelo 3D:', event.detail);
        });
    }
    
    // --- Roaming (movimiento autónomo) ---
    // Variables de estado
    let roam = true; // por defecto se mueve
    let wrapperW = 160;
    let wrapperH = 160;

    // Añadir clase roam para que el CSS lo posicione fixed
    wrapper.classList.add('roam');

    // Estado físico simple
    let pos = { x: 50, y: window.innerHeight / 2 };
    let vel = { x: 90 + Math.random() * 50, y: (Math.random() - 0.5) * 40 }; // px por segundo
    let lastTime = null;

    // Cambia la dirección aleatoria cada 2-4s
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

            // tamaño del wrapper (actualizar si cambia tamaño de viewport)
            wrapperW = wrapper.offsetWidth || 140;
            wrapperH = wrapper.offsetHeight || 140;

            // límites ventana
            const minX = 8;
            const minY = 8;
            const maxX = window.innerWidth - wrapperW - 8;
            const maxY = window.innerHeight - wrapperH - 8;

            // Rebotes con pequeño ajuste
            if (pos.x < minX) { pos.x = minX; vel.x = Math.abs(vel.x); randomizeVelocity(); }
            if (pos.x > maxX) { pos.x = maxX; vel.x = -Math.abs(vel.x); randomizeVelocity(); }
            if (pos.y < minY) { pos.y = minY; vel.y = Math.abs(vel.y); }
            if (pos.y > maxY) { pos.y = maxY; vel.y = -Math.abs(vel.y); }

            // Actualizar posición
            wrapper.style.left = Math.round(pos.x) + 'px';
            wrapper.style.top = Math.round(pos.y) + 'px';

            // Flip visual según la dirección horizontal
            if (vel.x < 0) inner.classList.add('flip'); else inner.classList.remove('flip');

            // Añadir clase walking si va rápido
            const speed = Math.hypot(vel.x, vel.y);
            if (speed > 80) wrapper.classList.add('walking'); else wrapper.classList.remove('walking');

            // temporizador para cambiar velocidad
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

    // Toggle mediante botón flotante
    const btn = document.createElement('button');
    btn.className = 'mascot-toggle';
    btn.title = 'Activar/desactivar mascota ambulante';
    btn.textContent = 'Mascota: ON';
    document.body.appendChild(btn);
    btn.addEventListener('click', () => {
        roam = !roam;
        if (roam) { btn.textContent = 'Mascota: ON'; wrapper.classList.remove('walking'); } else { btn.textContent = 'Mascota: OFF'; wrapper.classList.remove('walking'); }
    });

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
    wrapper.addEventListener('pointerup', (e) => { dragging = false; roam = false; /* remain paused after drag */ });
    wrapper.addEventListener('pointercancel', () => { dragging = false; roam = false; });
});