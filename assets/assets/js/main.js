/**
 * MAIN JAVASCRIPT - WEBSITE CÁ NHÂN ĐỖ VĂN NHẬT MINH
 * Trường Đại học Sư phạm TP. Hồ Chí Minh (HCMUE)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Toggle (Dark / Light Mode) ---
  const themeToggleBtn = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check stored theme or system preference
  const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // --- 2. Mobile Menu Navigation ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside or on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 3. Active Link Highlight Based on URL ---
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (path !== 'contact.html' && href.startsWith('#')) {
      // Keep in-page anchors active on scroll
    } else {
      link.classList.remove('active');
    }
  });

  // --- 4. Smooth In-Page Scrolling Spy for Index Page ---
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (link && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link[href^="#"]').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });
  }

  // --- 5. Contact Form Handler & Toast Notification ---
  const contactForm = document.getElementById('contactForm');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('fullName');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast('Vui lòng điền đầy đủ các thông tin bắt buộc!', 'error');
        return;
      }

      // Simple email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        showToast('Địa chỉ email không hợp lệ!', 'error');
        return;
      }

      // Button Loading State
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg> Đang gửi tin nhắn...
      `;

      // Simulate sending
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        contactForm.reset();
        showToast('Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công đến Nhật Minh.');
      }, 900);
    });
  }

  function showToast(message, type = 'success') {
    if (!toastNotification) return;

    if (toastMessage) toastMessage.textContent = message;

    if (type === 'error') {
      toastNotification.style.borderLeftColor = '#ef4444';
      const icon = toastNotification.querySelector('.toast-icon');
      if (icon) icon.innerHTML = '⚠️';
    } else {
      toastNotification.style.borderLeftColor = '#22c55e';
      const icon = toastNotification.querySelector('.toast-icon');
      if (icon) icon.innerHTML = '✅';
    }

    toastNotification.classList.add('show');

    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4500);
  }
});

// --- Avatar Lightbox Functions ---
function openAvatarLightbox() {
  const lightbox = document.getElementById('avatarLightbox');
  if (lightbox) {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }
}

function closeAvatarLightbox(event) {
  const lightbox = document.getElementById('avatarLightbox');
  if (!lightbox) return;

  // If called from clicking the overlay (not the content), or the close button
  if (!event || event.target === lightbox || event.currentTarget !== lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  }
}

// Close lightbox with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAvatarLightbox();
  }
});
