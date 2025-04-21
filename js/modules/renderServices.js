// js/modules/renderServices.js
import { servicesData } from "../data/servicesData.js";

/**
 * Creates the HTML string for a single service card element.
 * Includes the SVG icon structure and text content based on the service data.
 * @param {object} service - The service data object.
 * @param {string} service.title - The title of the service.
 * @param {string} service.description - The description of the service.
 * @param {string} service.iconPathD - The SVG path 'd' attribute data for the icon.
 * @returns {string} HTML string representing a single service card.
 */
function createServiceCardHTML(service) {
  // Provide default values for robustness in case data is incomplete
  const title = service.title || "Serviço Indisponível";
  const description = service.description || "";
  const iconPath = service.iconPathD || ""; // Default to empty path if missing

  // Add 'fade-in-section' class to ensure animation is applied via IntersectionObserver
  return `
    <div class="service-card fade-in-section">
      <div class="service-card-icon">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="${iconPath}"></path>
        </svg>
      </div>
      <h3>${title}</h3>
      <p>${description}</p>
    </div>
  `;
}

/**
 * Renders service cards into the designated grid container element (.services-grid).
 * It retrieves service data, generates the HTML for each service, and updates
 * the container's innerHTML. Includes checks for container and data availability,
 * and basic error handling during HTML generation.
 */
export function renderServices() {
  const servicesGrid = document.querySelector(".services-grid");

  // Verify that the target container element exists in the DOM.
  if (!servicesGrid) {
    console.warn(
      "Services grid container (.services-grid) not found in the DOM."
    );
    return; // Stop execution if the container is not found.
  }

  // Verify that the services data is available, is an array, and has items.
  if (!Array.isArray(servicesData) || servicesData.length === 0) {
    console.warn("Services data is missing or empty.");
    // Provide user feedback directly in the container.
    servicesGrid.innerHTML =
      '<p class="services-empty-message">Nenhum serviço disponível no momento.</p>';
    return; // Stop execution if there is no data to render.
  }

  // Attempt to generate and insert the HTML for the service cards.
  try {
    // Generate HTML string for all services using map and join.
    const servicesHTML = servicesData.map(createServiceCardHTML).join("");
    // Populate the container element with the generated HTML.
    servicesGrid.innerHTML = servicesHTML;
  } catch (error) {
    // Log any error that occurs during HTML generation or insertion.
    console.error("Error generating or inserting services HTML:", error);
    // Provide user feedback about the error directly in the container.
    servicesGrid.innerHTML =
      '<p class="services-error-message">Ocorreu um erro ao carregar os serviços.</p>';
  }

  // Note on animations: The IntersectionObserver setup in animateOnScroll.js
  // targets the parent '.services-section'. When this section becomes visible,
  // the CSS rules in _services.css that apply staggered transition-delays
  // to '.service-card:nth-child()' within a '.is-visible' section will
  // correctly target these dynamically generated cards.
}
