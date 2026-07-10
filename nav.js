// AIXelerate Challenge — shared mobile nav toggle
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("hamburger-btn");
    var menu = document.getElementById("mobile-menu");
    if (!btn || !menu) return;

    function closeMenu() {
      menu.classList.remove("open");
      btn.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("open");
      btn.classList.toggle("open", isOpen);
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 940) closeMenu();
    });
  });
})();
