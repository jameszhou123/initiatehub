/**
 * InitiateHUB Main JavaScript
 * Handles dark mode, scroll animations, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================
  // 1. Dark Mode Logic
  // ============================================
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Function to apply theme
  const setTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  // Check Local Storage or System Preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (systemPrefersDark) {
    setTheme('dark');
  }

  // Toggle Event Listener
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }

  // ============================================
  // 2. Navbar Scroll Effect (Glassmorphism trigger)
  // ============================================
  const navbar = document.getElementById('mainNav');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check on load

  // ============================================
  // 3. Intersection Observer for "Fade Up" Animations
  // ============================================
  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // Offset slightly so it triggers before bottom
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Target all elements with class 'fade-up'
  const animateElements = document.querySelectorAll('.fade-up');
  animateElements.forEach(el => observer.observe(el));

  // ============================================
  // 4. Mobile Menu Auto-Close
  // ============================================
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.getElementById('navbarNav');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });

  // ============================================
  // 5. Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        // Offset for fixed header
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // 6. reCAPTCHA v3 Form Protection
  // ============================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      grecaptcha.ready(function() {
        grecaptcha.execute('6LfWCBcsAAAAANmIBL6LnLeShaTxvXUQG93MgYPS', {action: 'submit'}).then(function(token) {
          // Add reCAPTCHA token to form
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'g-recaptcha-response';
          input.value = token;
          contactForm.appendChild(input);

          // Submit the form
          contactForm.submit();
        });
      });
    });
  }

});