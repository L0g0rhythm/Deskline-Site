// js/modules/animateOnScroll.js

export function initializeScrollAnimation() {
  console.log("[AnimateOnScroll] Initializing animation observer...");
  const sections = document.querySelectorAll(".fade-in-section");

  console.log(
    `[AnimateOnScroll] Found ${sections.length} elements with .fade-in-section.`
  );
  if (!sections.length) {
    console.warn("[AnimateOnScroll] No elements found to observe. Exiting.");
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% is visible
  };

  const observerCallback = (entries, observer) => {
    console.log(
      `[AnimateOnScroll] Observer callback triggered for ${entries.length} entries.`
    );
    entries.forEach((entry) => {
      const targetIdentifier = entry.target.id
        ? `#${entry.target.id}`
        : `.${entry.target.className.split(" ")[0]}`;
      console.log(
        `[AnimateOnScroll] Entry target: ${targetIdentifier}, isIntersecting: ${entry.isIntersecting}`
      );
      if (entry.isIntersecting) {
        console.log(
          `[AnimateOnScroll] ADDING .is-visible to ${targetIdentifier}`
        );
        entry.target.classList.add("is-visible");
        // Optional: Unobserve after first intersection if animation is one-time
        // console.log(`[AnimateOnScroll] Unobserving ${targetIdentifier}`);
        // observer.unobserve(entry.target);
      }
    });
  };

  try {
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    console.log("[AnimateOnScroll] IntersectionObserver created successfully.");

    sections.forEach((section) => {
      const sectionIdentifier = section.id
        ? `#${section.id}`
        : `.${section.className.split(" ")[0]}`;
      console.log(`[AnimateOnScroll] Observing: ${sectionIdentifier}`);
      observer.observe(section);
    });
  } catch (error) {
    console.error(
      "[AnimateOnScroll] Failed to create or use IntersectionObserver:",
      error
    );
  }
}
