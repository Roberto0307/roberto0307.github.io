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

  // Carrusel de consultoría/normas: funciona con scroll nativo (táctil en
  // móvil) y se puede navegar con las flechas o los puntos. Al agregar
  // nuevas tarjetas (<li class="carousel-slide">) no hay que tocar este
  // código: los puntos y el rango de las flechas se recalculan solos.
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var prevBtn = carousel.querySelector('[data-carousel-prev]');
    var nextBtn = carousel.querySelector('[data-carousel-next]');
    var dotsWrap = carousel.parentElement.querySelector('[data-carousel-dots]');
    if (!track) return;

    var slides = Array.prototype.slice.call(track.children);

    // Genera un punto por tarjeta
    var dots = [];
    if (dotsWrap) {
      slides.forEach(function (slide, index) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Ir a la tarjeta ' + (index + 1));
        dot.addEventListener('click', function () {
          track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function updateState() {
      var maxScroll = track.scrollWidth - track.clientWidth;

      if (prevBtn) prevBtn.disabled = track.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = track.scrollLeft >= maxScroll - 4;

      if (dots.length) {
        var activeIndex;

        if (track.scrollLeft <= 4) {
          // Al inicio del todo: siempre el primer punto
          activeIndex = 0;
        } else if (track.scrollLeft >= maxScroll - 4) {
          // Al final del todo: siempre el último punto
          activeIndex = slides.length - 1;
        } else {
          // En el medio: la tarjeta cuyo centro está más cerca del centro visible
          var viewportCenter = track.scrollLeft + track.clientWidth / 2;
          var closestDistance = Infinity;
          activeIndex = 0;
          slides.forEach(function (slide, index) {
            var slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
            var distance = Math.abs(slideCenter - viewportCenter);
            if (distance < closestDistance) {
              closestDistance = distance;
              activeIndex = index;
            }
          });
        }

        dots.forEach(function (dot, index) {
          dot.classList.toggle('is-active', index === activeIndex);
        });
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        track.scrollBy({ left: -track.clientWidth * 0.9, behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        track.scrollBy({ left: track.clientWidth * 0.9, behavior: 'smooth' });
      });
    }

    track.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);
    updateState();
  });

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

    function openLightbox(index) {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      var item = galleryItems[currentIndex];
      lightboxImg.src = item.getAttribute('data-full');
      lightboxImg.alt = item.getAttribute('data-caption') || '';
      lightboxCaption.textContent = item.getAttribute('data-caption') || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
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