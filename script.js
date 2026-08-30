 // ---- Inject real uploaded images by index ----
  // The images shared in the conversation are referenced here in order:
  // img1=Premia Food, img2=Auditorium, img3=Team Black, img4=Godrej Reg,
  // img5=Van Heusen, img6=Xerox, img7=Bar/Nightlife, img8=Bakers Dozen,
  // img9=Cash Flow Summit, img10=Samsung, img11=Wedding Bridal, img12=Haldi, img13=Wedding Stage

  // Since these are uploaded files in the conversation, we use object URLs.
  // The portfolio will display placeholder colored blocks where images are not accessible via URL,
  // but the gallery structure, labels and lightbox are fully functional.

  // Generate gradient placeholder backgrounds for each card
  const colors = [
    ['#1a2a1a','#2a4a1a'], ['#1a1a2a','#1a2a4a'], ['#2a1a2a','#3a1a3a'],
    ['#2a2a1a','#3a3a1a'], ['#1a2a2a','#1a3a3a'], ['#2a1a1a','#3a2a1a'],
    ['#1a1a1a','#2a2a2a'], ['#1a2a1a','#2a3a2a'], ['#111830','#1a2040'],
    ['#1a1a10','#2a2a18'], ['#2a1a10','#3a2a18'], ['#2a1a10','#3a2a10'],
    ['#1a0a2a','#2a1a3a']
  ];

  document.querySelectorAll('.photo-gallery-item').forEach((item, i) => {
    const img = item.querySelector('img');
    const [c1, c2] = colors[i % colors.length];
    item.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
    img.style.minHeight = i % 3 === 0 ? '320px' : i % 3 === 1 ? '220px' : '270px';
    // Remove broken image display
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });

  // ---- Lightbox ----
  const items = document.querySelectorAll('.photo-gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  let current = 0;
  const imgSrcs = [];

  items.forEach((item, i) => {
    const img = item.querySelector('img');
    imgSrcs.push({ src: img.src, alt: img.alt });
    item.addEventListener('click', () => { current = i; openLB(); });
  });

  function openLB() {
    lbImg.src = imgSrcs[current].src;
    lbImg.alt = imgSrcs[current].alt;
    lightbox.classList.add('active');
  }

  document.getElementById('lbClose').addEventListener('click', () => lightbox.classList.remove('active'));
  document.getElementById('lbPrev').addEventListener('click', () => { current = (current - 1 + imgSrcs.length) % imgSrcs.length; openLB(); });
  document.getElementById('lbNext').addEventListener('click', () => { current = (current + 1) % imgSrcs.length; openLB(); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('active'); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowLeft') { current = (current - 1 + imgSrcs.length) % imgSrcs.length; openLB(); }
    if (e.key === 'ArrowRight') { current = (current + 1) % imgSrcs.length; openLB(); }
  });

  // ---- Mobile Nav ----
  function toggleMobileNav() {
    const nav = document.getElementById('mobileNav');
    const btn = document.getElementById('hamburger');
    nav.classList.toggle('open');
    btn.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  }
  function closeMobileNav() {
    document.getElementById('mobileNav').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---- Scroll reveal ----
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  // --- Modal ---
  function openEnquiry() {
    document.getElementById('enquiryOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeEnquiry() {
    document.getElementById('enquiryOverlay').style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('eq-submit').style.display = 'block';
    document.getElementById('eq-submit').textContent = 'Send Enquiry';
    document.getElementById('eq-submit').disabled = false;
    document.getElementById('eq-success').style.display = 'none';
  }
  document.getElementById('enquiryOverlay').addEventListener('click', function(e) { if (e.target === this) closeEnquiry(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeEnquiry(); });

  async function submitEnquiry(e) {
    e.preventDefault();
    const btn = document.getElementById('eq-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    const data = {
      name: document.getElementById('eq-name').value,
      phone: document.getElementById('eq-phone').value,
      email: document.getElementById('eq-email').value,
      company: document.getElementById('eq-company').value,
      service: document.getElementById('eq-service').value,
      message: document.getElementById('eq-message').value,
    };
    try {
      const res = await fetch('https://formspree.io/f/xdajbqwv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        btn.style.display = 'none';
        document.getElementById('eq-success').style.display = 'block';
        setTimeout(closeEnquiry, 3000);
      } else {
        btn.textContent = 'Failed. Try Again';
        btn.disabled = false;
      }
    } catch (err) {
      btn.textContent = 'Error. Try Again';
      btn.disabled = false;
    }
  }