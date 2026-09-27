"use strict";

const form = document.querySelector("#signup-form");
const message = document.querySelector("#form-message");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  if (!form.checkValidity()) {
    message.textContent = "Enter a valid email and password.";
    form.reportValidity();
    return;
  }

  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;
  const confirmPassword = form.elements.confirmPassword.value;

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    return;
  }

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;

  try {
    const response = await fetch("../api/auth/register", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      message.textContent = typeof data.error === "string" ? data.error : "Account creation failed.";
      return;
    }

    window.location.href = "./login.html?registered=1";
  } catch {
    message.textContent = "Authentication service unavailable.";
  } finally {
    button.disabled = false;
  }
});