/**
 * Afghan Canadian Capital Society (ACCS) - Interactive JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Global Setup & Selectors ---
  const htmlEl = document.documentElement;
  const bodyEl = document.body;
  const headerEl = document.querySelector('.site-header');

  // --- 2. Theme Toggle Logic (Light / Dark Mode) ---
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  
  // Set theme from localStorage or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Set initial state
  htmlEl.setAttribute('data-theme', initialTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  });

  // --- 3. Scroll Behavior for Header ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      headerEl.classList.add('scrolled');
    } else {
      headerEl.classList.remove('scrolled');
    }
  });

  // --- 4. Mobile Menu Navigation Drawer ---
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      // Change icon
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // --- 5. Scroll Animations (Intersection Observer) ---
  const animatedElements = document.querySelectorAll('.fade-in-scroll');
  
  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      animationObserver.observe(el);
    });
  } else {
    // Fallback if observer is not supported
    animatedElements.forEach(el => el.classList.add('visible'));
  }

  // --- 6. Services Page Real-time Filters & Search ---
  const searchInput = document.querySelector('.search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-grid-card');

  if (filterBtns.length > 0 && serviceCards.length > 0) {
    let activeCategory = 'all';
    let searchQuery = '';

    // Search input handler
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFilters();
      });
    }

    // Category button handler
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter');
        applyFilters();
      });
    });

    function applyFilters() {
      let visibleCount = 0;
      
      serviceCards.forEach(card => {
        const title = card.querySelector('.service-card-title').textContent.toLowerCase();
        const desc = card.querySelector('.service-card-desc').textContent.toLowerCase();
        const category = card.getAttribute('data-category');

        const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery);
        const matchesCategory = activeCategory === 'all' || category === activeCategory;

        if (matchesSearch && matchesCategory) {
          card.style.display = 'flex';
          // Force reflow for fade-in effect
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity var(--transition-normal)';
          }, 20);
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Show "No results" message if needed
      const noResultsMsg = document.getElementById('no-results-message');
      if (noResultsMsg) {
        noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }
  }

  // --- 7. Multi-Tab Form Switching (Contact / Portal Page) ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const formPanes = document.querySelectorAll('.portal-form-pane');

  if (tabBtns.length > 0 && formPanes.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        // Toggle active button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle active form pane
        formPanes.forEach(pane => {
          if (pane.id === `${targetTab}-pane`) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });
      });
    });
  }

  // --- 8. Interactive Forms Validation & Simulated Success Modal ---
  const forms = document.querySelectorAll('.portal-form');
  const modalOverlay = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (forms.length > 0 && modalOverlay) {
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent standard page reload

        // Simple validation check
        let isValid = true;
        const requiredInputs = form.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--primary)';
          } else {
            input.style.borderColor = 'var(--border-color)';
          }
        });

        // Special handling for checkboxes if needed
        const termsCheckbox = form.querySelector('.terms-checkbox');
        if (termsCheckbox && !termsCheckbox.checked) {
          isValid = false;
          termsCheckbox.style.outline = '2px solid var(--primary)';
        }

        if (isValid) {
          // Extract form details for personalized feedback
          const nameInput = form.querySelector('[name="name"]') || form.querySelector('[name="first-name"]');
          const emailInput = form.querySelector('[name="email"]');
          const userName = nameInput ? nameInput.value.trim() : 'Friend';
          const formType = form.getAttribute('data-form-type') || 'message';

          showSuccessModal(userName, formType);
          form.reset(); // Reset form fields
        }
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', hideSuccessModal);
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) hideSuccessModal();
      });
    }

    function showSuccessModal(name, type) {
      const modalTitleEl = document.getElementById('modal-display-title');
      const modalTextEl = document.getElementById('modal-display-text');
      
      let title = 'Submission Received!';
      let message = `Thank you, ${name}. We have received your request and our team will get back to you shortly.`;

      if (type === 'contact') {
        title = 'Message Sent Successfully!';
        message = `Thank you, ${name}. Your inquiry has been sent to our community coordinators. We will reply to your email within 24-48 hours.`;
      } else if (type === 'volunteer') {
        title = 'Volunteer Application Received!';
        message = `Tashakor / Thank you, ${name}! Your interest in volunteering with ACCS is highly valued. A coordinator from our Community Engagement Team will contact you to discuss matching opportunities.`;
      } else if (type === 'membership') {
        title = 'Membership Applied!';
        message = `Welcome, ${name}! Your application for ACCS Membership has been successfully filed. We have registered your details in accordance with our bylaws. A welcome email containing your membership orientation info has been dispatched.`;
      }

      if (modalTitleEl) modalTitleEl.textContent = title;
      if (modalTextEl) modalTextEl.textContent = message;

      modalOverlay.classList.add('active');
      bodyEl.style.overflow = 'hidden'; // Disable scroll under modal
    }

    function hideSuccessModal() {
      modalOverlay.classList.remove('active');
      bodyEl.style.overflow = ''; // Enable scroll
    }
  }
});
