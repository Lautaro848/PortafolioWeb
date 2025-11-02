/* particles-init.js
   - Initializes particles.js with a centralized config
   - Applies responsive particle counts (mobile reduced)
   - Adds toggle handling and persists preference in localStorage
*/
(function(){
  const STORAGE_KEY = 'particles-enabled';
  const containerId = 'particles-js';

  // configuration factory (adjusts number for mobile)
  function makeConfig(){
    const isMobile = window.innerWidth <= 640;
    return {
      particles: {
        number: { value: isMobile ? 18 : 45, density: { enable: true, value_area: 900 } },
        color: { value: '#0B69FF' }, // deep blue tone
        shape: { type: 'circle' },
        opacity: { value: 0.55 },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 140, color: '#0B69FF', opacity: 0.22, width: 1 },
        move: { enable: true, speed: 3.2, direction: 'none', random: false, straight: false, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { grab: { distance: 400 }, bubble: { distance: 400 }, repulse: { distance: 200 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
      },
      retina_detect: true
    };
  }

  // init particles (safe: check particlesJS function exists)
  function initParticles(){
    if(typeof particlesJS !== 'function') return;
    const cfg = makeConfig();
    try{ particlesJS(containerId, cfg); }catch(e){ console.warn('particles init error', e); }
  }

  // show/hide container and try to pause/play
  function setParticlesEnabled(enabled){
    const el = document.getElementById(containerId);
    const btn = document.querySelector('[data-particles-toggle]');
    if(!el) return;
    el.style.display = enabled ? '' : 'none';
    try{
      if(window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS && window.pJSDom[0].pJS.fn){
        if(enabled) window.pJSDom[0].pJS.fn.play(); else window.pJSDom[0].pJS.fn.pause();
      }
    }catch(e){}
    if(btn){ btn.setAttribute('aria-pressed', enabled ? 'true' : 'false'); }
    try{ localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0'); }catch(e){}
  }

  // Attach toggle handler and initialize
  function attachToggle(){
    const btn = document.querySelector('[data-particles-toggle]');
    if(!btn) return;
    btn.addEventListener('click', function(){
      const current = btn.getAttribute('aria-pressed') === 'true';
      setParticlesEnabled(!current);
    });
    // keyboard: space/enter already handled by button element
  }

  // On DOM ready: init and set state from storage
  function ready(){
    initParticles();
    attachToggle();
    // restore preference
    try{
      const stored = localStorage.getItem(STORAGE_KEY);
      const enabled = stored === null ? true : stored === '1';
      setParticlesEnabled(enabled);
    }catch(e){ setParticlesEnabled(true); }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();

  // Re-init on resize to adjust mobile/desktop particle count (simple approach)
  let resizeTimer = null;
  window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      // if particles already initialized, destroy and re-init with new config
      try{
        if(window.pJSDom && window.pJSDom.length){
          // remove existing instances
          while(window.pJSDom.length) window.pJSDom.pop();
        }
      }catch(e){}
      initParticles();
      // restore state
      try{ const stored = localStorage.getItem(STORAGE_KEY); const enabled = stored === null ? true : stored === '1'; setParticlesEnabled(enabled); }catch(e){}
    }, 300);
  });

})();
