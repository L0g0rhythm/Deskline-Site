// js/modules/renderFeatures.js
import { featuresData } from "../data/featuresData.js";

/**
 * Creates the HTML string for a single feature item element.
 * Includes a dynamic CSS class based on the feature's iconId
 * to allow for specific icon styling (e.g., CSS masks).
 * @param {object} feature - The feature data object.
 * @param {string} feature.title - The title of the feature.
 * @param {string} feature.description - The description of the feature.
 * @param {string} feature.iconId - An identifier used to generate a CSS class for icon styling.
 * @returns {string} HTML string representing a single feature item.
 */
function createFeatureItemHTML(feature) {
  // Generate a CSS class based on the iconId, if provided. Default to empty string.
  const iconClass = feature.iconId ? `feature-icon--${feature.iconId}` : "";
  // Provide default text values for robustness.
  const title = feature.title || "Feature Indisponível";
  const description = feature.description || "";

  // Add essential classes:
  // 'feature-item': Base styling class.
  // 'fade-in-section': Enables IntersectionObserver-based animation.
  // iconClass: Allows specific CSS (e.g., mask-image) to target the ::before pseudo-element.
  return `
    <div class="feature-item fade-in-section ${iconClass}">
      <h3>${title}</h3>
      <p>${description}</p>
    </div>
  `;
}

/**
 * Renders feature items into the designated grid container element (.features-grid).
 * Retrieves feature data, generates HTML for each feature including icon-specific
 * classes, and updates the container's innerHTML. Handles cases where the container
 * or data may be missing, and includes basic error handling.
 */
export function renderFeatures() {
  const featuresGrid = document.querySelector(".features-grid");

  // Verify that the target container element exists in the DOM.
  if (!featuresGrid) {
    console.warn(
      "Features grid container (.features-grid) not found in the DOM."
    );
    return; // Stop if the container is missing.
  }

  // Verify that the features data is available, is an array, and contains items.
  if (!Array.isArray(featuresData) || featuresData.length === 0) {
    console.warn("Features data is missing or empty.");
    // Provide user feedback in the container.
    featuresGrid.innerHTML =
      '<p class="features-empty-message">Nenhuma feature disponível no momento.</p>';
    return; // Stop if there's no data.
  }

  // Attempt to generate and insert the HTML for the feature items.
  try {
    // Generate the complete HTML string for all features.
    const featuresHTML = featuresData.map(createFeatureItemHTML).join("");
    // Populate the container with the generated HTML.
    featuresGrid.innerHTML = featuresHTML;
  } catch (error) {
    // Log potential errors during the HTML generation/insertion process.
    console.error("Error generating or inserting features HTML:", error);
    // Provide user feedback about the error.
    featuresGrid.innerHTML =
      '<p class="features-error-message">Ocorreu um erro ao carregar as features.</p>';
  }

  // Note on animations and icons:
  // 1. The IntersectionObserver targets the parent '.features-section'.
  // 2. When the section becomes visible, the CSS in _features.css applies
  //    slide-in animations and staggered delays based on ':nth-child'
  //    selectors, which works correctly with these dynamic items.
  // 3. The '::before' pseudo-element defined in _features.css requires
  //    corresponding CSS rules (likely also in _features.css or a global
  //    icon file) that target the generated 'feature-icon--*' classes
  //    to apply the correct 'mask-image' for each icon.
}
