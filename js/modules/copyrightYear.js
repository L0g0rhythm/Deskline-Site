// js/modules/copyrightYear.js
export function updateCopyrightYear() {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  } else {
    console.warn("Element with ID 'current-year' not found.");
  }
}
