// js/modules/renderPortfolio.js
import { portfolioItems } from "../data/portfolioData.js";

/**
 * Creates the HTML string for a single portfolio item.
 * Ensures necessary classes and attributes for functionality and accessibility are included.
 * @param {object} item - The portfolio item data object.
 * @param {string} item.imgSrc - Source path for the portfolio item image.
 * @param {string} item.imgAlt - Alt text for the portfolio item image.
 * * @param {string} item.title - Title/caption for the portfolio item.
 * @param {string} [item.link='#'] - Optional link URL for the portfolio item. Defaults to '#'.
 * @returns {string} HTML string representing a single portfolio item.
 */
function createPortfolioItemHTML(item) {
  // Ensure required data exists, provide defaults if necessary
  const linkHref = item.link || "#";
  const ariaLabel = `Ver detalhes do projeto ${item.title || "sem título"}`;
  const imageAlt = item.imgAlt || "Imagem do projeto"; // Provide a basic fallback alt text

  // Add 'fade-in-section' class to each item for the IntersectionObserver animation
  return `
    <div class="portfolio-item fade-in-section">
      <a href="${linkHref}" aria-label="${ariaLabel}">
        <img
          src="${item.imgSrc}"
          alt="${imageAlt}"
          loading="lazy"
          width="340" height="255" />
        <span>${item.title || "Projeto sem título"}</span>
      </a>
    </div>
  `;
  // Note: Added width/height attributes to img as an example for potential CLS optimization.
  // Adjust values based on the actual aspect ratio (4/3 used in CSS = 340x255 example).
}

/**
 * Renders portfolio items into the designated grid container element.
 * Fetches data from portfolioData.js, generates HTML for each item,
 * and populates the container. Handles cases where the container
 * or data may be missing.
 */
export function renderPortfolio() {
  const portfolioGrid = document.querySelector(".portfolio-grid");

  // Check if the target container exists in the DOM
  if (!portfolioGrid) {
    console.warn(
      "Portfolio grid container (.portfolio-grid) not found in the DOM."
    );
    return; // Exit if container is missing
  }

  // Check if the portfolio data is available and is an array with items
  if (!Array.isArray(portfolioItems) || portfolioItems.length === 0) {
    console.warn("Portfolio data is missing or empty.");
    // Optional: Display a message to the user in the grid container
    portfolioGrid.innerHTML =
      '<p class="portfolio-empty-message">Nenhum projeto disponível no momento.</p>';
    return; // Exit if no data to render
  }

  // Generate the complete HTML string for all portfolio items
  try {
    const portfolioHTML = portfolioItems.map(createPortfolioItemHTML).join("");
    // Populate the grid container with the generated HTML
    portfolioGrid.innerHTML = portfolioHTML;
  } catch (error) {
    console.error("Error generating portfolio HTML:", error);
    // Optional: Display an error message to the user
    portfolioGrid.innerHTML =
      '<p class="portfolio-error-message">Ocorreu um erro ao carregar os projetos.</p>';
  }

  // The IntersectionObserver in animateOnScroll.js observes the parent section.
  // Since the section exists on load, the observer will correctly detect when
  // the section becomes visible, and the CSS transitions/animations defined
  // for '.portfolio-item.fade-in-section' within a visible section
  // will apply to these dynamically added items.
}
