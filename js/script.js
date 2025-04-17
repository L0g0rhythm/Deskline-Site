// js/script.js
import { updateCopyrightYear } from "./modules/copyrightYear.js";
import { initializeMobileMenu } from "./modules/mobileMenu.js";
import { initializeScrollAnimation } from "./modules/animateOnScroll.js";
import { initializeFormValidation } from "./modules/formValidation.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize core functionalities
  updateCopyrightYear();
  initializeMobileMenu();

  // Initialize enhancements
  initializeScrollAnimation();
  initializeFormValidation("contact-form"); // Pass the ID of the form

  console.log("Deskline scripts initialized.");
  // Initialize other modules here if added later
});
