document.addEventListener('DOMContentLoaded', function () {
  // Año dinámico en el footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Botón "volver arriba": aparece tras hacer scroll y sube suavemente al inicio
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    var toggleVisibility = function () {
      if (window.scrollY > 480) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Galería con lightbox: clic en cualquier captura la abre en grande,
  // con flechas para pasar a la anterior/siguiente y Esc/clic afuera para cerrar.
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('[data-gallery-item]'));
  var lightbox = document.getElementById('lightbox');

  if (galleryItems.length && lightbox) {
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');
    var currentIndex = 0;
    var lastFocus = null;

    function openLightbox(index) {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      var item = galleryItems[currentIndex];
      lightboxImg.src = item.getAttribute('data-full');
      lightboxImg.alt = item.getAttribute('data-caption') || '';
      lightboxCaption.textContent = item.getAttribute('data-caption') || '';
      if (!lightbox.classList.contains('is-open')) lastFocus = document.activeElement;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () { openLightbox(index); });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', function () { openLightbox(currentIndex - 1); });
    if (lightboxNext) lightboxNext.addEventListener('click', function () { openLightbox(currentIndex + 1); });

    // Cerrar al hacer clic fuera de la imagen (en el fondo oscuro)
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Navegación por teclado
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    });
  }
});