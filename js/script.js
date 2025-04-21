// js/script.js
import { updateCopyrightYear } from "./modules/copyrightYear.js";
import { initializeMobileMenu } from "./modules/mobileMenu.js";
import { initializeScrollAnimation } from "./modules/animateOnScroll.js";
import { initializeFormValidation } from "./modules/formValidation.js";
import { renderPortfolio } from "./modules/renderPortfolio.js";
import { renderServices } from "./modules/renderServices.js";
import { renderFeatures } from "./modules/renderFeatures.js";

document.addEventListener("DOMContentLoaded", () => {
  updateCopyrightYear();
  initializeMobileMenu();

  renderPortfolio();
  renderServices();
  renderFeatures();

  initializeScrollAnimation();

  if (document.getElementById("contact-form")) {
    initializeFormValidation("contact-form");
  }

  console.log("Deskline scripts initialized.");
});
