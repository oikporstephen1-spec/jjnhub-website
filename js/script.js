/* -------------------------------------------------------------
 * JJN HUB - IMMERSIVE VISUAL INTERACTIVE ENGINE
 * Canvas Particle System, Scroll-Reveals, and 3D Tilts
 * ------------------------------------------------------------- */

// Mobile Navigation Toggle
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) {
    menu.classList.toggle("show");
  }
}

// -------------------------------------------------------------
// HTML5 CANVAS STAR-PARTICLE SYSTEM
// -------------------------------------------------------------
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const maxParticles = 70;
  
  // Mouse position tracker
  let mouse = { x: null, y: null, radius: 130 };

  // Track window resizing
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Mouse move listener
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Mouse leave listener
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 2.2 + 0.8;
      
      // Choose color based on division or champagne greige theme
      const colors = ['rgba(212, 178, 133, 0.4)', 'rgba(212, 178, 133, 0.2)', 'rgba(255, 255, 255, 0.15)'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around bounds
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Generate particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and connect particles
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();

      // Connect with mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (1 - (dist / mouse.radius)) * 0.15;
          ctx.strokeStyle = `rgba(212, 160, 23, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Connect with other particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const alpha = (1 - (dist / 100)) * 0.08;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// -------------------------------------------------------------
// SCROLL REVEAL ANIMATIONS (IntersectionObserver)
// -------------------------------------------------------------
function setupScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to track it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  elements.forEach(el => observer.observe(el));
}

// -------------------------------------------------------------
// 3D CARD TILT EFFECT (Mouse coordinates relative rotation)
// -------------------------------------------------------------
function setupCardTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Mouse x relative to card
      const y = e.clientY - rect.top;  // Mouse y relative to card
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles (max tilt angle is 10 degrees)
      const rotateX = ((centerY - y) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

// -------------------------------------------------------------
// IMMERSIVE TERMINAL MORPH TABS (Index Page Tab System)
// -------------------------------------------------------------
function morphIndexTab(division, button) {
  const container = document.getElementById('morphing-container');
  if (!container) return;

  // Remove existing theme classes
  container.className = 'morphing-console theme-' + division;

  // Update tabs buttons
  document.querySelectorAll('.morph-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  if (button) button.classList.add('active');

  // Slide content panels
  document.querySelectorAll('.console-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  const targetPanel = document.getElementById('console-' + division);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }
}

// -------------------------------------------------------------
// CENTRALIZED TAB SWITCHING SYSTEM FOR SERVICE PAGES
// -------------------------------------------------------------
function showMarine(service, button) {
  document.querySelectorAll('.marine-description').forEach(item => {
    item.classList.remove('active-marine-content');
  });
  document.querySelectorAll('.marine-btn').forEach(item => {
    item.classList.remove('active-marine');
  });
  
  const content = document.getElementById(service);
  if (content) content.classList.add('active-marine-content');
  if (button) button.classList.add('active-marine');
  
  const image = document.getElementById('marineImage');
  if (image) {
    const images = {
      'electrical': 'assets/marine1.jpg',
      'switchboard': 'assets/marine2.jpg',
      'navigation': 'assets/marine3.jpg',
      'communication': 'assets/marine4.jpg',
      'troubleshooting': 'assets/marine5.jpg',
      'dockyard': 'assets/marine1.jpg'
    };
    if (images[service]) image.src = images[service];
  }
}

function showLogistics(service, button) {
  document.querySelectorAll('.logistics-description').forEach(item => {
    item.classList.remove('active-logistics-content');
  });
  document.querySelectorAll('.logistics-btn').forEach(item => {
    item.classList.remove('active-logistics');
  });
  
  const content = document.getElementById(service);
  if (content) content.classList.add('active-logistics-content');
  if (button) button.classList.add('active-logistics');
  
  const image = document.getElementById('logisticsImage');
  if (image) {
    const images = {
      'freight': 'assets/logistics1.jpg',
      'shipping': 'assets/logistics2.jpg',
      'importexport': 'assets/logistics3.jpg',
      'procurement': 'assets/logistics4.jpg',
      'tracking': 'assets/logistics5.jpg',
      'project': 'assets/logistics1.jpg'
    };
    if (images[service]) image.src = images[service];
  }
}

function showProcurement(service, button) {
  document.querySelectorAll('.procurement-description').forEach(item => {
    item.classList.remove('active-procurement-content');
  });
  document.querySelectorAll('.procurement-btn').forEach(item => {
    item.classList.remove('active-procurement');
  });
  
  const content = document.getElementById(service);
  if (content) content.classList.add('active-procurement-content');
  if (button) button.classList.add('active-procurement');
  
  const image = document.getElementById('procurementImage');
  if (image) {
    const images = {
      'industrial': 'assets/procurement1.jpg',
      'marine': 'assets/procurement2.jpg',
      'automotive': 'assets/procurement3.jpg',
      'technical': 'assets/procurement4.jpg',
      'vendor': 'assets/procurement5.jpg',
      'strategic': 'assets/procurement1.jpg'
    };
    if (images[service]) image.src = images[service];
  }
}

function showEngineering(service, button) {
  document.querySelectorAll('.eng-content').forEach(item => {
    item.classList.remove('active-content');
  });
  document.querySelectorAll('.eng-btn').forEach(item => {
    item.classList.remove('active-eng');
  });
  
  const content = document.getElementById(service);
  if (content) content.classList.add('active-content');
  if (button) button.classList.add('active-eng');
  
  const image = document.getElementById('engineeringImage');
  if (image) {
    const images = {
      'marine': 'assets/engineering1.jpg',
      'switchboard': 'assets/engineering2.jpg',
      'calibration': 'assets/engineering3.jpg',
      'motor': 'assets/engineering4.jpg',
      'automation': 'assets/engineering5.jpg',
      'consultancy': 'assets/engineering1.jpg'
    };
    if (images[service]) image.src = images[service];
  }
}

// -------------------------------------------------------------
// TOAST NOTIFICATIONS & MODALS
// -------------------------------------------------------------
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : 'toast-success'}`;
  
  toast.innerHTML = `
    <div class="toast-message">${message}</div>
    <button class="toast-close">&times;</button>
  `;
  
  toast.querySelector('.toast-close').addEventListener('click', () => {
    dismissToast(toast);
  });
  
  container.appendChild(toast);
  
  setTimeout(() => {
    dismissToast(toast);
  }, 4000);
}

function dismissToast(toast) {
  if (toast.classList.contains('toast-out')) return;
  toast.classList.add('toast-out');
  toast.addEventListener('animationend', () => {
    toast.remove();
  });
}

function openOrderForm(vehicle) {
  const popup = document.getElementById("orderPopup");
  const selectedVehicle = document.getElementById("selectedVehicle");
  if (selectedVehicle && vehicle) {
    selectedVehicle.value = vehicle;
  }
  if (popup) {
    popup.style.display = "flex";
  }
}

function closeOrderForm() {
  const popup = document.getElementById("orderPopup");
  if (popup) {
    popup.style.display = "none";
  }
}

function openImage(img) {
  const popup = document.getElementById("imagePopup");
  const popupImage = document.getElementById("popupImage");
  if (popup && popupImage) {
    popup.style.display = "flex";
    popupImage.src = img.src;
  }
}

// Close zoom popup
function closeImage() {
  const popup = document.getElementById("imagePopup");
  if (popup) {
    popup.style.display = "none";
  }
}

window.onclick = function(event) {
  const orderPopup = document.getElementById("orderPopup");
  const imagePopup = document.getElementById("imagePopup");
  if (orderPopup && event.target === orderPopup) {
    orderPopup.style.display = "none";
  }
  if (imagePopup && event.target === imagePopup) {
    imagePopup.style.display = "none";
  }
};

// -------------------------------------------------------------
// DYNAMIC COST ESTIMATOR CALCULATIONS
// -------------------------------------------------------------
function setupCostCalculator() {
  const form = document.querySelector('.estimate-form');
  if (!form || !document.body.classList.contains('cost-page')) return;
  
  const estimateCards = document.querySelectorAll('.estimate-card');
  if (estimateCards.length < 2) return;
  
  const outputCard = estimateCards[1];
  
  // Inject live breakdown card if not present
  if (!document.querySelector('.estimator-results')) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'estimator-results';
    resultsContainer.innerHTML = `
      <h3>Instant Cost Breakdown</h3>
      <div class="result-row"><span>Base Vehicle Cost:</span><span id="calc-base">₦0</span></div>
      <div class="result-row"><span>Shipping & Insurance:</span><span id="calc-shipping">₦0</span></div>
      <div class="result-row"><span>Customs clearing duty:</span><span id="calc-clearing">₦0</span></div>
      <div class="result-row"><span>Local delivery:</span><span id="calc-delivery">₦0</span></div>
      <div class="result-row total"><span>Grand Total:</span><span id="calc-total">₦0</span></div>
    `;
    outputCard.prepend(resultsContainer);
  }
  
  const makeInput = form.querySelector('input[name="Vehicle Make"]');
  const modelInput = form.querySelector('input[name="Vehicle Model"]');
  const yearInput = form.querySelector('input[name="Year"]');
  const countryInput = form.querySelector('input[name="Country"]');
  const portInput = form.querySelector('input[name="Destination Port"]');
  const budgetInput = form.querySelector('input[name="Budget"]');
  
  function calculateCost() {
    const make = makeInput.value.trim().toLowerCase();
    const model = modelInput.value.trim().toLowerCase();
    const year = parseInt(yearInput.value) || new Date().getFullYear();
    const country = countryInput.value.trim().toLowerCase();
    
    if (!make && !model) {
      document.getElementById('calc-base').textContent = '₦0';
      document.getElementById('calc-shipping').textContent = '₦0';
      document.getElementById('calc-clearing').textContent = '₦0';
      document.getElementById('calc-delivery').textContent = '₦0';
      document.getElementById('calc-total').textContent = '₦0';
      return;
    }
    
    let baseVal = 18000000;
    if (make.includes('lexus')) {
      baseVal = model.includes('rx') ? 35000000 : 25000000;
    } else if (make.includes('toyota')) {
      baseVal = model.includes('prado') ? 48000000 : model.includes('camry') ? 16000000 : 20000000;
    } else if (make.includes('honda')) {
      baseVal = 14000000;
    } else if (make.includes('mercedes') || make.includes('benz')) {
      baseVal = 40000000;
    }
    
    const currentYear = new Date().getFullYear();
    const age = Math.max(0, currentYear - year);
    if (age > 0) {
      baseVal = baseVal * Math.max(0.4, 1 - (age * 0.08));
    }
    
    let shippingVal = 3200000;
    if (country.includes('usa') || country.includes('america') || country.includes('united states')) {
      shippingVal = 3800000;
    } else if (country.includes('germany') || country.includes('europe') || country.includes('uk') || country.includes('london')) {
      shippingVal = 2900000;
    } else if (country.includes('japan') || country.includes('china') || country.includes('tokyo')) {
      shippingVal = 4200000;
    }
    
    const clearingVal = baseVal * 0.35;
    const deliveryVal = 250000;
    const grandTotal = baseVal + shippingVal + clearingVal + deliveryVal;
    
    document.getElementById('calc-base').textContent = `₦${Math.round(baseVal).toLocaleString()}`;
    document.getElementById('calc-shipping').textContent = `₦${Math.round(shippingVal).toLocaleString()}`;
    document.getElementById('calc-clearing').textContent = `₦${Math.round(clearingVal).toLocaleString()}`;
    document.getElementById('calc-delivery').textContent = `₦${Math.round(deliveryVal).toLocaleString()}`;
    document.getElementById('calc-total').textContent = `₦${Math.round(grandTotal).toLocaleString()}`;
  }
  
  [makeInput, modelInput, yearInput, countryInput, portInput, budgetInput].forEach(input => {
    if (input) {
      input.addEventListener('input', calculateCost);
      input.addEventListener('change', calculateCost);
    }
  });
}

// Setup Form Interceptions
function setupFormSubmissions() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const action = form.getAttribute('action') || '';
      if (action.includes('formsubmit.co')) {
        e.preventDefault();
        showToast('Submitting request securely to JJN HUB...', 'info');
        
        const formData = new FormData(form);
        fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        }).then(response => {
          if (response.ok) {
            showToast('Your inquiry has been successfully sent to Jesse & Jeslyn Limited!', 'success');
            form.reset();
            const calcTotal = document.getElementById('calc-total');
            if (calcTotal) {
              document.getElementById('calc-base').textContent = '₦0';
              document.getElementById('calc-shipping').textContent = '₦0';
              document.getElementById('calc-clearing').textContent = '₦0';
              document.getElementById('calc-delivery').textContent = '₦0';
              calcTotal.textContent = '₦0';
            }
            closeOrderForm();
          } else {
            showToast('Transmission error. Please try again.', 'error');
          }
        }).catch(() => {
          showToast('Inquiry logged successfully (local simulation).', 'success');
          form.reset();
          closeOrderForm();
        });
      }
    });
  });
}

// -------------------------------------------------------------
// DYNAMIC BACKGROUND SLIDESHOW CYCLER
// -------------------------------------------------------------
function initBackgroundSlideshow() {
  const images = [
    'assets/jjn_generated_bg.png',
    'assets/jjn_automotive_bg.png',
    'assets/jjn_engineering_bg.png',
    'assets/jjn_marine_bg.png',
    'assets/jjn_logistics_bg.png',
    'assets/jjn_procurement_bg.png'
  ];
  
  // Choose initial slide randomly
  let currentIdx = Math.floor(Math.random() * images.length);

  // Create ambient glows overlay container
  const glowOverlay = document.createElement('div');
  glowOverlay.className = 'bg-glow-overlay';
  document.body.appendChild(glowOverlay);

  // Create slideshow layers
  const slide1 = document.createElement('div');
  slide1.className = 'bg-slideshow-layer';
  slide1.style.backgroundImage = `url('${images[currentIdx]}')`;
  slide1.style.opacity = 1;
  document.body.appendChild(slide1);

  // Choose next distinct slide index randomly
  let nextIdx;
  do {
    nextIdx = Math.floor(Math.random() * images.length);
  } while (nextIdx === currentIdx && images.length > 1);

  const slide2 = document.createElement('div');
  slide2.className = 'bg-slideshow-layer';
  slide2.style.backgroundImage = `url('${images[nextIdx]}')`;
  slide2.style.opacity = 0;
  document.body.appendChild(slide2);

  let activeSlide = slide1;
  let inactiveSlide = slide2;

  // Track next index selection
  currentIdx = nextIdx;

  setInterval(() => {
    // Crossfade opacity
    activeSlide.style.opacity = 0;
    inactiveSlide.style.opacity = 1;

    // Swap references
    const temp = activeSlide;
    activeSlide = inactiveSlide;
    inactiveSlide = temp;

    // Pick next random slide index that is different from the newly active slide index
    let newIdx;
    do {
      newIdx = Math.floor(Math.random() * images.length);
    } while (newIdx === currentIdx && images.length > 1);
    
    currentIdx = newIdx;
    
    // Preload next image on hidden slide
    setTimeout(() => {
      inactiveSlide.style.backgroundImage = `url('${images[currentIdx]}')`;
    }, 2000); // Wait for crossfade to finish before swapping hidden background
  }, 6000);
}

const marineZones = {
  'bridge': {
    title: 'Bridge System Console',
    code: 'SYS-NAV-01',
    status: 'ACTIVE SLA',
    desc: 'Navigation, GPS radar calibration, and HF/VHF communication arrays installation.',
    bullets: [
      'GMDSS Radio diagnostics & safety surveys',
      'Gyrocompass & autopilot interface checks',
      'Electronic Chart Display (ECDIS) audits',
      'Satellite VSAT terminal alignments'
    ],
    enquiry: 'Bridge Navigation & Communications'
  },
  'engine': {
    title: 'Engine Power Grid',
    code: 'SYS-ENG-02',
    status: 'ACTIVE SLA',
    desc: 'Inspecting main switchboards, breaker injection thresholds, and busbar calibration.',
    bullets: [
      'Air Circuit Breaker (ACB) trip testing',
      'Generators load sharing calibrations',
      'Shore-power panel connection refits',
      'Thermal camera hot-spot diagnostics'
    ],
    enquiry: 'Switchboard Power Distribution'
  },
  'auxiliary': {
    title: 'Auxiliary Room Automation',
    code: 'SYS-AUX-03',
    status: 'STANDBY',
    desc: 'Tuning motor control centers, cooling starter coils, and bilge level automation loops.',
    bullets: [
      'VFD speed control parameters checking',
      'Solenoid valve diagnostic loops',
      'Alarm & monitoring panel validation',
      'Bilge/Ballast float sensor calibrating'
    ],
    enquiry: 'Vessel Troubleshooting & Automation'
  },
  'hull': {
    title: 'Hull & Drydock Diagnostics',
    code: 'SYS-HUL-04',
    status: 'AUDIT STAGE',
    desc: 'Support during dry-dock refits, ICCP inspection, and shaft ground validations.',
    bullets: [
      'Cathodic protection voltage checking',
      'Propeller shaft grounding slip-ring checks',
      'Bow thruster control wiring audits',
      'Under-water lighting circuit inspections'
    ],
    enquiry: 'Dockyard Support & Cathodic Protection'
  }
};

function activateMarineHotspot(zone, button) {
  const data = marineZones[zone];
  if (!data) return;

  // Toggle active hotspots
  document.querySelectorAll('.radar-hotspot').forEach(el => {
    el.classList.remove('active');
  });
  if (button) button.add ? button.classList.add('active') : button.classList.add('active');

  // Update terminal elements
  const titleEl = document.getElementById('term-title');
  const codeEl = document.getElementById('term-code');
  const statusEl = document.getElementById('term-status');
  const descEl = document.getElementById('term-desc');
  const listEl = document.getElementById('term-list');
  const actionBtn = document.getElementById('term-action-btn');

  if (titleEl) titleEl.textContent = data.title;
  if (codeEl) codeEl.textContent = data.code;
  if (statusEl) {
    statusEl.textContent = data.status;
    statusEl.className = data.status === 'ACTIVE SLA' ? 'status-active' : '';
  }
  if (descEl) descEl.textContent = data.desc;
  
  if (listEl) {
    listEl.innerHTML = '';
    data.bullets.forEach(bullet => {
      const li = document.createElement('li');
      li.textContent = bullet;
      listEl.appendChild(li);
    });
  }

  if (actionBtn) {
    actionBtn.setAttribute('onclick', `openOrderForm('${data.enquiry}')`);
  }
}

// -------------------------------------------------------------
// 3D PERSPECTIVE CAROUSEL FOR PROCUREMENT
// -------------------------------------------------------------
function initProcurementCarousel() {
  const cards = document.querySelectorAll('.procure-card');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!cards.length) return;

  let activeIdx = 0;

  function updateCarousel() {
    cards.forEach((card, idx) => {
      card.className = 'procure-card';
      
      const diff = (idx - activeIdx + cards.length) % cards.length;
      
      if (diff === 0) {
        card.classList.add('card-state-center');
      } else if (diff === 1) {
        card.classList.add('card-state-right');
      } else if (diff === cards.length - 1) {
        card.classList.add('card-state-left');
      } else {
        if (diff === 2) {
          card.classList.add('card-state-far-right');
        } else {
          card.classList.add('card-state-far-left');
        }
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === activeIdx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      activeIdx = (activeIdx - 1 + cards.length) % cards.length;
      updateCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      activeIdx = (activeIdx + 1) % cards.length;
      updateCarousel();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      activeIdx = idx;
      updateCarousel();
    });
  });

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (idx !== activeIdx) {
        activeIdx = idx;
        updateCarousel();
      }
    });
  });

  updateCarousel();
}

function toggleEngCard(card) {
  card.classList.toggle('flipped');
}

function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const easeOutQuad = t => t * (2 - t);

    const animate = () => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const currentValue = Math.round(target * progress);
      
      element.textContent = currentValue + suffix;

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target + suffix;
      }
    };

    requestAnimationFrame(animate);
  };

  const statsSection = document.querySelector('.stats-grid-about');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => countUp(num));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    statsObserver.observe(statsSection);
  }
}

function initializeApp() {
  initBackgroundSlideshow();
  initParticleCanvas();
  setupScrollReveal();
  setupCardTilt();
  initProcurementCarousel();
  setupCostCalculator();
  setupFormSubmissions();
  initStatsCounter();
  initLogisticsFeatures();
}

function initLogisticsFeatures() {
  // 1. Local/International Toggles
  const toggleBtns = document.querySelectorAll('.mode-toggle-btn');
  const modeContents = document.querySelectorAll('.logistics-mode-content');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetMode = btn.getAttribute('data-mode');
      
      toggleBtns.forEach(b => b.classList.remove('active-mode'));
      btn.classList.add('active-mode');
      
      modeContents.forEach(content => {
        content.classList.remove('active-content');
        if (content.id === `logistics-${targetMode}`) {
          content.classList.add('active-content');
        }
      });
    });
  });

  // 2. Mock Shipment Database & Tracking Logic
  const trackBtn = document.getElementById('trackShipmentBtn');
  const trackInput = document.getElementById('shipmentTrackId');
  const resultsDiv = document.getElementById('trackingResults');
  
  if (trackBtn && trackInput && resultsDiv) {
    const mockDatabase = {
      'JJN-TRACK-LOCAL': {
        type: 'local dispatch',
        origin: 'Warri Central Hub',
        destination: 'Effurun Depot, Delta State',
        eta: 'Today, 2:30 PM',
        courier: 'Rider #204 (Motorcycle Courier)',
        status: 'Out for Delivery',
        location: 'Avenue Junction',
        step: 3 // Out for Delivery
      },
      'JJN-TRACK-GLOBAL': {
        type: 'international freight',
        origin: 'Port of Rotterdam (NL)',
        destination: 'Lagos Apapa Port (NG)',
        eta: 'August 12, 2026',
        courier: 'Ocean Line - Vessel MV Vanguard',
        status: 'In Transit',
        location: 'Mid-Atlantic Transit',
        step: 2 // In Transit
      }
    };

    trackBtn.addEventListener('click', () => {
      const queryId = trackInput.value.trim().toUpperCase();
      if (!queryId) {
        alert('Please enter a tracking ID');
        return;
      }

      resultsDiv.classList.remove('show-results');
      
      setTimeout(() => {
        const item = mockDatabase[queryId];
        
        if (item) {
          // Fill details
          document.getElementById('resType').innerHTML = `<strong>Type</strong> ${item.type.toUpperCase()}`;
          document.getElementById('resRoute').innerHTML = `<strong>Route</strong> ${item.origin} &rarr; ${item.destination}`;
          document.getElementById('resEta').innerHTML = `<strong>Estimated Arrival</strong> ${item.eta}`;
          document.getElementById('resStatus').innerHTML = `<strong>Current Status</strong> <span style="color:#10b981">${item.status}</span>`;
          document.getElementById('resCourier').innerHTML = `<strong>Courier/Vessel</strong> ${item.courier}`;
          document.getElementById('resLocation').innerHTML = `<strong>Last Location</strong> ${item.location}`;
          
          // Set progress bar & steps
          const stepsNodes = document.querySelectorAll('.tracker-steps .step-node');
          const progressLine = document.querySelector('.tracker-progress-line');
          
          // Reset classes
          stepsNodes.forEach(node => {
            node.classList.remove('completed', 'active');
          });

          // Update active step nodes
          stepsNodes.forEach((node, index) => {
            const stepNum = index + 1;
            if (stepNum < item.step) {
              node.classList.add('completed');
            } else if (stepNum === item.step) {
              node.classList.add('active');
            }
          });

          // Calculate percentage width (e.g. step 1 -> 0%, step 2 -> 33%, step 3 -> 66%, step 4 -> 100%)
          const widthPct = ((item.step - 1) / (stepsNodes.length - 1)) * 100;
          progressLine.style.width = `${widthPct}%`;

          resultsDiv.classList.add('show-results');
          resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          // Fallback if not found
          alert('Tracking ID not found. Try testing with "JJN-TRACK-LOCAL" or "JJN-TRACK-GLOBAL".');
        }
      }, 300);
    });
  }

  // 3. Form Modals
  const closeFeedbackBtns = document.querySelectorAll('.close-feedback-btn');
  closeFeedbackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.form-feedback-modal').forEach(modal => {
        modal.classList.remove('show-modal');
      });
    });
  });

  // 4. Rider Registration Form
  const riderForm = document.getElementById('riderRegistrationForm');
  const riderModal = document.getElementById('riderFeedbackModal');
  if (riderForm && riderModal) {
    riderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const riderName = document.getElementById('riderName').value;
      const vehicle = document.getElementById('riderVehicle').value;
      const randomId = 'JJN-RIDER-' + Math.floor(1000 + Math.random() * 9000);
      
      document.getElementById('riderModalText').innerHTML = `Thank you, <strong>${riderName}</strong>. Your application as a <strong>${vehicle} dispatch rider</strong> has been received. Your registration reference is <strong>${randomId}</strong>. We will review your license credentials shortly.`;
      
      riderModal.classList.add('show-modal');
      riderForm.reset();
    });
  }

  // 5. Corporate Subscription Form
  const companyForm = document.getElementById('companySubscriptionForm');
  const companyModal = document.getElementById('companyFeedbackModal');
  if (companyForm && companyModal) {
    companyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const compName = document.getElementById('compName').value;
      const plan = document.getElementById('compPlan').value;
      const volume = document.getElementById('compVolume').value;
      
      // Calculate mock pricing
      let price = '$99/mo';
      if (plan === 'Pro') price = '$249/mo';
      if (plan === 'Enterprise') price = '$599/mo';
      
      document.getElementById('compModalText').innerHTML = `Success! <strong>${compName}</strong> has subscribed to the <strong>${plan} plan</strong> (Est. Volume: ${volume} dispatches/mo). Your billing rate is set to <strong>${price}</strong>. Our logistics integration lead will contact you soon.`;
      
      companyModal.classList.add('show-modal');
      companyForm.reset();
    });
  }
}

function toggleDropdown(e) {
  if (window.innerWidth <= 900) {
    e.preventDefault();
    const dropdown = e.currentTarget.closest('.nav-item-dropdown');
    dropdown.classList.toggle('open');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}



