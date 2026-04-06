(function () {
  'use strict';

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      this.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
      nav.classList.toggle('is-open', !expanded);
    });
  }

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox && lightbox.querySelector('.lightbox-img');

  function openLightbox(webpSrc, jpgFallback, altText) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.alt = altText || '';
    lightboxImg.src = webpSrc;
    lightboxImg.onerror = function () {
      lightboxImg.onerror = null;
      lightboxImg.src = jpgFallback;
    };
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    var closeBtn = lightbox.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.setAttribute('hidden', '');
    lightboxImg.src = '';
    lightboxImg.alt = '';
    lightboxImg.onerror = null;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-card[data-lightbox]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var webp = this.getAttribute('data-lightbox');
      var jpg = this.getAttribute('data-lightbox-fallback') || '';
      var innerImg = this.querySelector('img');
      var altText = innerImg ? innerImg.getAttribute('alt') : '';
      openLightbox(webp, jpg, altText);
    });
  });

  if (lightbox) {
    lightbox.querySelectorAll('[data-lightbox-close], .lightbox-close').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox && !lightbox.hasAttribute('hidden')) {
        closeLightbox();
      }
    });
  }
})();
