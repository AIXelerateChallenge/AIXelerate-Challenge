// AIXelerate Challenge — scroll-triggered reveal animations
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var selectors = [
    ".scroll-3d",
    ".scroll-3d-left",
    ".scroll-3d-right",
    ".fade-up",
    ".fade-zoom",
    ".fade-left",
    ".fade-right",
    ".zoom-in"
  ];

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(selectors.join(",")).forEach(function (el) {
      observer.observe(el);
    });
  });
})();
