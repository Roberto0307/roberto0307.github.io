/* Osua GRC — consentimiento de cookies de análisis (Google Analytics).
   Google Analytics solo se carga si el visitante lo acepta. */
(function () {
  'use strict';

  var GA_ID = 'G-771WNQEZC4';
  var KEY = 'osua_cookie_consent';
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000; // la decisión se vuelve a pedir cada 12 meses
  // La ruta se calcula desde este script, así funciona en cualquier carpeta del sitio
  var POLICY = document.currentScript && document.currentScript.src ? new URL('../privacidad.html', document.currentScript.src).href : '/privacidad.html';
  var banner = null;
  var gaLoaded = false;

  function readChoice() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      if (d && (d.analytics === 'granted' || d.analytics === 'denied') && Date.now() - d.ts < MAX_AGE) {
        return d.analytics;
      }
    } catch (e) { /* almacenamiento no disponible */ }
    return null;
  }

  function saveChoice(value) {
    try { localStorage.setItem(KEY, JSON.stringify({ analytics: value, ts: Date.now() })); } catch (e) { /* sin almacenamiento */ }
  }

  function loadAnalytics() {
    window['ga-disable-' + GA_ID] = false;
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function removeAnalytics() {
    window['ga-disable-' + GA_ID] = true;
    var parts = location.hostname.split('.');
    var domains = [location.hostname];
    if (parts.length > 1) domains.push('.' + parts.slice(-2).join('.'));
    var past = 'Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name === '_gid' || name === '_gat' || name.indexOf('_ga_') === 0) {
        document.cookie = name + '=; expires=' + past + '; path=/';
        domains.forEach(function (d) { document.cookie = name + '=; expires=' + past + '; path=/; domain=' + d; });
      }
    });
  }

  function apply(choice) {
    if (choice === 'granted') loadAnalytics(); else removeAnalytics();
  }

  function hideBanner() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
  }

  function showBanner(focus) {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-labelledby', 'cookieTitle');
    banner.innerHTML =
      '<h2 class="cookie-banner__title" id="cookieTitle">Cookies de análisis</h2>' +
      '<p class="cookie-banner__text">Usamos cookies de análisis para generar métricas de uso y mejorar tu experiencia en este sitio. ' +
      'Más información en la <a href="' + POLICY + '">política de privacidad</a>.</p>' +
      '<div class="cookie-banner__actions">' +
      '<button type="button" class="cookie-btn cookie-btn--reject" data-choice="denied">Rechazar</button>' +
      '<button type="button" class="cookie-btn cookie-btn--accept" data-choice="granted">Aceptar</button>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-choice]');
      if (!btn) return;
      var choice = btn.getAttribute('data-choice');
      saveChoice(choice);
      apply(choice);
      hideBanner();
    });
    document.body.appendChild(banner);
    if (focus) banner.querySelector('.cookie-btn--accept').focus();
  }

  var stored = readChoice();
  if (stored) apply(stored); else showBanner(false);

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookie-settings]')) showBanner(true);
  });
})();
