// js/modules/formValidation.js

export function initializeFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const requiredFields = form.querySelectorAll("[required]");

  const showError = (field, message) => {
    field.classList.add("invalid");
    field.classList.remove("valid");
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }

    field.setAttribute("aria-invalid", "true");
  };

  const clearError = (field) => {
    field.classList.remove("invalid");
    field.classList.add("valid");
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }

    field.removeAttribute("aria-invalid");
  };

  const validateField = (field) => {
    let isValid = true;
    let message = "";

    if (field.hasAttribute("required") && field.value.trim() === "") {
      isValid = false;
      message = "Este campo é obrigatório.";
    } else if (field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        message = "Por favor, insira um email válido.";
      }
    }

    if (!isValid) {
      showError(field, message);
    } else {
      clearError(field);
    }
    return isValid;
  };

  requiredFields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) {
        clearError(field); // Clear error as user types
      }
    });
  });

  form.addEventListener("submit", (event) => {
    let isFormValid = true;
    requiredFields.forEach((field) => {
      if (!validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      event.preventDefault();
      const firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) {
        firstInvalid.focus();
      }
    } else {
      const formStatus = document.getElementById("form-status");
      if (formStatus) formStatus.textContent = "Enviando...";
    }
  });
}
