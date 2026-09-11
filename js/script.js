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
});