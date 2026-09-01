// EVENT COUNTDOWN + SLIDER — fully independent of script.js
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    initEvCountdown();
    initEvSlider();
  });

  // ---- Countdown to 6 September 2026, IST ----
  function initEvCountdown() {
    const daysEl = document.getElementById('evDays');
    const hoursEl = document.getElementById('evHours');
    const minutesEl = document.getElementById('evMinutes');
    const secondsEl = document.getElementById('evSeconds');
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // Change the date here if the event date ever changes
    const target = new Date('2026-09-06T00:00:00+05:30').getTime();

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      const now = Date.now();
      let diff = target - now;

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        const label = document.querySelector('.ev-countdown-label');
        if (label) label.textContent = "It's Event Day!";
        clearInterval(timer);
        return;
      }

      const d = Math.floor(diff / 86400000); diff -= d * 86400000;
      const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
      const m = Math.floor(diff / 60000);    diff -= m * 60000;
      const s = Math.floor(diff / 1000);

      daysEl.textContent = pad(d);
      hoursEl.textContent = pad(h);
      minutesEl.textContent = pad(m);
      secondsEl.textContent = pad(s);
    }

    tick();
    const timer = setInterval(tick, 1000);
  }

  // ---- Auto-sliding, swipeable photo slider ----
  function initEvSlider() {
    const slider = document.getElementById('evSlider');
    const track = document.getElementById('evSlidesTrack');
    const dotsWrap = document.getElementById('evDots');
    const prevBtn = document.getElementById('evPrev');
    const nextBtn = document.getElementById('evNext');
    if (!slider || !track || !dotsWrap) return;

    const slides = track.querySelectorAll('.ev-slide');
    const total = slides.length;
    if (total === 0) return;

    let index = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'ev-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('.ev-dot');

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }
    function goTo(i) { index = (i + total) % total; render(); resetAutoplay(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    let autoplay = setInterval(next, 4000);
    function resetAutoplay() { clearInterval(autoplay); autoplay = setInterval(next, 4000); }

    slider.addEventListener('mouseenter', () => clearInterval(autoplay));
    slider.addEventListener('mouseleave', resetAutoplay);

    // Swipe support (mobile)
    let startX = 0, dragging = false;
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      dragging = true;
    }, { passive: true });
    track.addEventListener('touchend', e => {
      if (!dragging) return;
      dragging = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    });

    render();
  }
})();