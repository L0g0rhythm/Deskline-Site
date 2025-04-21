// js/modules/formValidation.js

export function initializeFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) {
    console.warn(`Form with ID "${formId}" not found for validation.`);
    return;
  }

  const requiredFields = form.querySelectorAll("[required]");
  const formStatus = document.getElementById("form-status");
  const submitButton = form.querySelector('button[type="submit"]');

  if (!formStatus) {
    console.warn(
      'Element with ID "form-status" not found for displaying messages.'
    );
  }
  if (!submitButton) {
    console.warn("Submit button not found within the form.");
  }

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
    // Keep adding 'valid' for visual feedback if desired by CSS
    field.classList.add("valid");
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }
    field.removeAttribute("aria-invalid");
  };

  const clearAllErrors = () => {
    requiredFields.forEach((field) => {
      clearError(field);
      field.classList.remove("valid"); // Also remove valid class on reset/clear
    });
  };

  const validateField = (field) => {
    let isValid = true;
    let message = "";

    // Trim value for all checks
    const value = field.value.trim();

    if (field.hasAttribute("required") && value === "") {
      isValid = false;
      message = "Este campo é obrigatório.";
    } else if (field.type === "email" && value !== "") {
      // Only validate email if not empty
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = "Por favor, insira um email válido.";
      }
    }
    // Add other validation rules here if needed (e.g., minlength)

    if (!isValid) {
      showError(field, message);
    } else {
      // Clear error only if validation passes for this specific field
      clearError(field);
    }
    return isValid;
  };

  requiredFields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      // Clear error as user types, but don't mark as valid yet
      if (field.classList.contains("invalid")) {
        const errorElement = document.getElementById(`${field.id}-error`);
        field.classList.remove("invalid");
        if (errorElement) {
          errorElement.textContent = "";
          errorElement.style.display = "none";
        }
        field.removeAttribute("aria-invalid");
      }
      // Optionally remove 'valid' class on input until blur validation passes again
      field.classList.remove("valid");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default submission unconditionally first

    let isFormValid = true;
    // Re-validate all fields on submit attempt
    requiredFields.forEach((field) => {
      if (!validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      const firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) {
        firstInvalid.focus();
      }
      // Update status briefly for validation errors
      if (formStatus) {
        formStatus.textContent = "Por favor, corrija os erros no formulário.";
        formStatus.style.color = "var(--error-color)";
      }
      return; // Stop if client-side validation fails
    }

    // --- Start Asynchronous Submission ---
    if (formStatus) {
      formStatus.textContent = "Enviando...";
      formStatus.style.color = "inherit"; // Reset color
    }
    if (submitButton) {
      submitButton.disabled = true;
    }

    const formData = new FormData(form);
    const formAction = form.action; // Get URL from form's action attribute

    try {
      const response = await fetch(formAction, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json, text/plain, */*", // Indicate preferred response types
        },
      });

      const responseText = await response.text(); // Get text regardless of status

      if (!response.ok) {
        // Server returned an error status (4xx, 5xx)
        // Use text from response if available, otherwise generic message
        throw new Error(responseText || `Erro no servidor: ${response.status}`);
      }

      // Server returned success status (2xx)
      // Check content for success indication (adjust if PHP sends different success message)
      if (responseText.toLowerCase().includes("sucesso")) {
        if (formStatus) {
          formStatus.textContent = "Mensagem enviada com sucesso!";
          formStatus.style.color = "var(--primary-color)"; // Success color
        }
        form.reset(); // Clear the form fields
        clearAllErrors(); // Clear validation states visually
      } else {
        // Server returned 2xx status but message doesn't indicate success
        throw new Error(responseText || "Resposta inesperada do servidor.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      if (formStatus) {
        formStatus.textContent = `Erro: ${
          error.message || "Não foi possível enviar. Verifique sua conexão."
        }`;
        formStatus.style.color = "var(--error-color)"; // Error color
      }
    } finally {
      // Re-enable button regardless of success or error
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
    // --- End Asynchronous Submission ---
  });
}
