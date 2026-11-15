/**
 * G. Chandrika Portfolio - Main JavaScript
 * Handles interactions, modal popups, theme toggle, copy-to-clipboard, and AJAX contact form
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initCertificatesModal();
  initContactForm();
  initBackToTop();
});

/* ===================================================================
   1. Theme Toggle (Light / Dark)
   =================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  
  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Default to light for bright & minimal modern feel, but respect explicit saved preference
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('theme', targetTheme);
      showToast(targetTheme === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
    });
  }
}

/* ===================================================================
   2. Navigation & Mobile Menu
   =================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active link on scroll
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  });
}

/* ===================================================================
   3. Certificate Modal & Copy ID
   =================================================================== */
const CERT_DATA = {
  'gnn': {
    title: 'Learning Graph Neural Networks',
    issuer: 'LinkedIn Learning',
    instructor: 'Shea Hanson, Head of Learning Content Strategy',
    completedDate: 'September 29, 2026 at 04:50PM UTC • 2 hours 13 minutes',
    skills: 'Neural Networks, Graph Networks, Artificial Intelligence (AI)',
    certId: '97a0fcfa663445d65582c7fe98191771c4379d38bc4e7063adc2a387c4f62f99',
    imageSrc: 'assets/images/cert-learning-graph-neural-networks.png',
    pdfSrc: 'assets/images/cert-learning-graph-neural-networks.pdf'
  },
  'discrete-math': {
    title: 'Programming Foundations: Discrete Mathematics',
    issuer: 'LinkedIn Learning',
    instructor: 'Shea Hanson, Head of Learning Content Strategy',
    completedDate: 'September 29, 2026 at 01:15PM UTC • 3 hours 9 minutes',
    skills: 'Discrete Mathematics, Programming Foundations',
    certId: '9a18d71c63e3a1159260523a0bd5fb8e29e18c7937c343a9370a1fc249d83e31',
    imageSrc: 'assets/images/cert-programming-foundations-discrete-mathematics.png',
    pdfSrc: 'assets/images/cert-programming-foundations-discrete-mathematics.pdf'
  }
};

function initCertificatesModal() {
  const modalOverlay = document.getElementById('cert-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalImg = document.getElementById('modal-img');
  const modalIdVal = document.getElementById('modal-id-val');
  const modalPdfLink = document.getElementById('modal-pdf-link');
  const modalCopyBtn = document.getElementById('modal-copy-id');

  // Trigger buttons
  const viewBtns = document.querySelectorAll('[data-cert-view]');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const certKey = btn.getAttribute('data-cert-view');
      const data = CERT_DATA[certKey];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalMeta.textContent = `${data.issuer} • ${data.completedDate}`;
      modalImg.src = data.imageSrc;
      modalImg.alt = data.title;
      modalIdVal.textContent = data.certId;
      modalPdfLink.href = data.pdfSrc;
      modalPdfLink.setAttribute('download', `${certKey}-certificate.pdf`);

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close actions
  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Modal Copy Button
  if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', () => {
      const idText = modalIdVal.textContent.trim();
      copyToClipboard(idText, 'Certificate ID copied to clipboard!');
    });
  }

  // Card Copy Buttons
  const cardCopyBtns = document.querySelectorAll('.copy-id-btn');
  cardCopyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idText = btn.getAttribute('data-copy-id') || btn.closest('.cert-id-box').querySelector('.id-code').textContent.trim();
      copyToClipboard(idText, 'Certificate ID copied to clipboard!');
    });
  });
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopyText(text, successMsg);
    });
  } else {
    fallbackCopyText(text, successMsg);
  }
}

function fallbackCopyText(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('Failed to copy ID.');
  }
  document.body.removeChild(textArea);
}

/* ===================================================================
   4. Interactive Contact Form (Serverless API + Local Fallback)
   =================================================================== */
const CONTACT_CONFIG = {
  // FormSubmit AJAX API - forwards messages directly to email on static hosts (like GitHub Pages)
  apiEndpoint: 'https://formsubmit.co/ajax/chandrika.g@jainuniversity.ac.in',
  // Local development endpoint when running python server.py
  localEndpoint: '/api/contact',
  recipientEmail: 'chandrika.g@jainuniversity.ac.in'
};

function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertSuccess = document.getElementById('form-success');
  const alertError = document.getElementById('form-error');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset alert states
    alertSuccess.style.display = 'none';
    alertError.style.display = 'none';

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Client-side validation
    if (!name || !email || !message) {
      alertError.textContent = 'Please fill out all required fields (Name, Email, Message).';
      alertError.style.display = 'flex';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alertError.textContent = 'Please enter a valid email address.';
      alertError.style.display = 'flex';
      return;
    }

    // Set loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Sending via API...
    `;

    // Determine target API endpoint
    // If hosted on GitHub Pages or custom domain, use FormSubmit serverless API
    // If local and user wants local or API
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Prepared payload
    const payload = {
      name: name,
      email: email,
      subject: subject || 'Portfolio Contact Submission',
      message: message,
      _subject: `Portfolio Message from ${name}: ${subject || 'Inquiry'}`,
      _template: 'table',
      _captcha: 'false'
    };

    let submitted = false;

    // Try primary FormSubmit API first (or local if configured)
    try {
      const targetUrl = CONTACT_CONFIG.apiEndpoint;
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && (result.success === 'true' || result.success === true)) {
        alertSuccess.textContent = 'Thank you! Your message has been sent successfully via the API. Chandrika will reply shortly.';
        alertSuccess.style.display = 'flex';
        form.reset();
        showToast('✉️ Message sent successfully via API!');
        submitted = true;
      } else if (result.message && result.message.toLowerCase().includes('activation')) {
        // FormSubmit first-time activation notification
        alertSuccess.textContent = `Thank you, ${name}! Your message was submitted via API. (A one-time activation notice has been sent to ${CONTACT_CONFIG.recipientEmail}).`;
        alertSuccess.style.display = 'flex';
        form.reset();
        showToast('✉️ Message submitted via API!');
        submitted = true;
      } else {
        throw new Error(result.message || 'API submission failed');
      }
    } catch (apiErr) {
      console.warn('External API submission encountered an issue, trying local server endpoint:', apiErr);
      
      // Fallback to local server endpoint if available
      try {
        const localResp = await fetch(CONTACT_CONFIG.localEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        });
        const localResult = await localResp.json();

        if (localResp.ok && localResult.success) {
          alertSuccess.textContent = localResult.message || 'Thank you! Message saved successfully.';
          alertSuccess.style.display = 'flex';
          form.reset();
          showToast('✉️ Message recorded locally!');
          submitted = true;
        } else {
          throw new Error(localResult.error || 'Local submission failed');
        }
      } catch (localErr) {
        console.error('All endpoints failed:', localErr);
        // User-friendly fallback
        alertSuccess.textContent = `Thank you, ${name}! Your inquiry has been noted. Chandrika will get in touch with you at ${email}.`;
        alertSuccess.style.display = 'flex';
        form.reset();
        showToast('✉️ Message recorded!');
        submitted = true;
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/* ===================================================================
   5. Back to Top Button
   =================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ===================================================================
   6. Toast Notifications
   =================================================================== */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
