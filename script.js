(function () {
  'use strict';

  /** Paste your Meta Pixel ID when ready (Events Manager). Leave empty to skip loading fbevents.js. */
  var META_PIXEL_ID = '';

  var CONSENT_STORAGE_KEY = 'villa_sinodium_marketing_consent';

  function getMarketingConsent() {
    try {
      return localStorage.getItem(CONSENT_STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setMarketingConsent(value) {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch (e) {}
  }

  function loadMetaPixel(pixelId) {
    if (!pixelId || window.fbq) return;
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }

  function bindContactIntentTracking() {
    var contact = document.getElementById('contact');
    if (!contact) return;

    contact.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || !contact.contains(a)) return;
      if (typeof window.fbq !== 'function') return;
      var href = (a.getAttribute('href') || '').trim();
      if (href.indexOf('maps.app.goo.gl') !== -1) {
        window.fbq('trackCustom', 'LocationMapClick');
        return;
      }
      if (href.indexOf('mailto:') === 0) {
        window.fbq('trackCustom', 'ContactEmailClick');
        return;
      }
      if (href.indexOf('tel:') === 0) {
        window.fbq('trackCustom', 'ContactPhoneClick');
      }
    });
  }

  function hideCookieBanner() {
    var el = document.getElementById('cookie-banner');
    if (el) el.hidden = true;
  }

  function showCookieBanner() {
    var el = document.getElementById('cookie-banner');
    if (el) el.hidden = false;
  }

  function initMarketingConsent() {
    bindContactIntentTracking();

    var consent = getMarketingConsent();
    if (consent === 'accepted' && META_PIXEL_ID) {
      loadMetaPixel(META_PIXEL_ID);
    }

    if (consent === null) {
      showCookieBanner();
    }

    var rejectBtn = document.getElementById('cookie-reject');
    var acceptBtn = document.getElementById('cookie-accept');
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        setMarketingConsent('rejected');
        hideCookieBanner();
      });
    }
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        setMarketingConsent('accepted');
        hideCookieBanner();
        if (META_PIXEL_ID) {
          loadMetaPixel(META_PIXEL_ID);
        }
      });
    }
  }

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

  initMarketingConsent();
})();
