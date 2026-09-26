"use strict";

const form = document.querySelector("#login-form");
const message = document.querySelector("#form-message");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;

  if (!form.checkValidity()) {
    message.textContent = "Enter a valid email and password.";
    form.reportValidity();
    return;
  }

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;

  try {
    const response = await fetch("../api/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      message.textContent = data.error || "Sign-in failed. Please try again.";
      return;
    }

    window.location.href = "./dashboard.html";
  } catch {
    message.textContent = "Authentication service unavailable.";
  } finally {
    button.disabled = false;
  }
});