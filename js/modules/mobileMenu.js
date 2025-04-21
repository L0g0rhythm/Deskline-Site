// js/modules/mobileMenu.js
export function initializeMobileMenu() {
  const menuToggleButton = document.getElementById("menu-toggle-button");
  const mainNavMenu = document.getElementById("main-nav-menu");

  if (menuToggleButton && mainNavMenu) {
    menuToggleButton.addEventListener("click", () => {
      mainNavMenu.classList.toggle("active");
      const isExpanded = mainNavMenu.classList.contains("active");
      menuToggleButton.setAttribute("aria-expanded", isExpanded);
      menuToggleButton.setAttribute(
        "aria-label",
        isExpanded ? "Fechar menu" : "Abrir menu"
      );
    });

    mainNavMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mainNavMenu.classList.contains("active")) {
          mainNavMenu.classList.remove("active");
          menuToggleButton.setAttribute("aria-expanded", "false");
          menuToggleButton.setAttribute("aria-label", "Abrir menu");
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (
        mainNavMenu.classList.contains("active") &&
        !mainNavMenu.contains(event.target) &&
        !menuToggleButton.contains(event.target)
      ) {
        mainNavMenu.classList.remove("active");
        menuToggleButton.setAttribute("aria-expanded", "false");
        menuToggleButton.setAttribute("aria-label", "Abrir menu");
      }
    });
  } else {
    console.warn("Mobile menu elements not found for initialization.");
  }
}
