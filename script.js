(function () {
  'use strict';

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      this.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
      nav.classList.toggle('is-open', !expanded);
    });
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox && lightbox.querySelector('.lightbox-img');

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
    const closeBtn = lightbox.querySelector('.lightbox-close');
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
      const webp = this.getAttribute('data-lightbox');
      const jpg = this.getAttribute('data-lightbox-fallback') || '';
      const innerImg = this.querySelector('img');
      const altText = innerImg ? innerImg.getAttribute('alt') : '';
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
  // --- Cookie Consent (UM-14) ---

  var CONSENT_KEY = 'villa_cookie_consent';

  // UM-30: Google Ads conversion tracking — paste IDs from Google Ads (UM-29).
  // Everything no-ops safely while these are empty.
  var GADS_ID = ''; // e.g. 'AW-123456789'
  var GADS_LABELS = {
    form_submit: '', // Enquiry form submit (PRIMARY) — e.g. 'AbCdEfGhIjK'
    phone_click: '',
    email_click: ''
  };

  // Global so the booking-form script in index.html can report conversions
  window.gadsConvert = function (key) {
    if (!GADS_ID || !GADS_LABELS[key] || typeof window.gtag !== 'function') return;
    window.gtag('event', 'conversion', { send_to: GADS_ID + '/' + GADS_LABELS[key] });
  };

  function loadGoogleTag() {
    if (!GADS_ID || window.gtag) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GADS_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // This function only ever runs after an explicit banner Accept,
    // so ad consent is granted; analytics stays denied (no GA4 yet, UM-22).
    window.gtag('consent', 'default', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'denied'
    });
    window.gtag('config', GADS_ID);
  }

  function loadMarketingScripts() {
    loadGoogleTag();
    // UM-17: Meta Pixel — loads only after consent
    if (!window.fbq) {
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '2640755696321208');
      fbq('track', 'PageView');

      // UM-18: Lead + Contact on email, phone, and Book Now clicks
      var bookBtn = document.querySelector('.float-book-btn');
      var emailLink = document.querySelector('.contact-list a[href^="mailto:"]');
      var phoneLink = document.querySelector('.contact-list a[href^="tel:"]');
      if (bookBtn) bookBtn.addEventListener('click', function () {
        fbq('track', 'Lead', { content_name: 'book_now_click' });
        fbq('track', 'Contact');
      });
      if (emailLink) emailLink.addEventListener('click', function () {
        fbq('track', 'Lead', { content_name: 'email_click' });
        fbq('track', 'Contact');
        window.gadsConvert('email_click'); // UM-30
      });
      if (phoneLink) phoneLink.addEventListener('click', function () {
        fbq('track', 'Lead', { content_name: 'phone_click' });
        fbq('track', 'Contact');
        window.gadsConvert('phone_click'); // UM-30
      });

      // UM-19: ViewContent when #prices section is 50% visible (fires once)
      var pricesSection = document.getElementById('prices');
      if (pricesSection && 'IntersectionObserver' in window) {
        var pricesObserver = new IntersectionObserver(function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              fbq('track', 'ViewContent', { content_name: 'prices_section' });
              observer.disconnect();
            }
          });
        }, { threshold: 0.5 });
        pricesObserver.observe(pricesSection);
      }
    }
    // UM-22: inject GA4 gtag.js here if opted in
  }

  function hideBanner() {
    var banner = document.getElementById('cookieBanner');
    if (banner) banner.setAttribute('hidden', '');
  }

  function initCookieConsent() {
    var consent = localStorage.getItem(CONSENT_KEY);

    if (consent === 'accepted') {
      loadMarketingScripts();
      return;
    }

    if (consent === 'rejected') {
      return;
    }

    // No stored preference — show the banner
    var banner = document.getElementById('cookieBanner');
    if (!banner) return;
    banner.removeAttribute('hidden');

    document.getElementById('cookieAccept').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      hideBanner();
      loadMarketingScripts();
    });

    document.getElementById('cookieReject').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'rejected');
      hideBanner();
    });
  }

  initCookieConsent();

})();
