(() => {
"use strict";
const form = document.querySelector("#campaign-form");
const message = document.querySelector("#campaign-message");
if (!form || !message) return;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    message.textContent = "Please complete the required campaign fields.";
    form.reportValidity();
    return;
  }
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  try {
    const csrfResponse = await fetch("../api/auth/csrf", { credentials: "same-origin" });
    const csrfData = await csrfResponse.json().catch(() => ({}));
    if (!csrfResponse.ok || typeof csrfData.token !== "string") throw new Error();
    const response = await fetch("../api/campaigns/create", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfData.token },
      body: JSON.stringify({
        name: form.elements.name.value,
        subjectLine: form.elements.subject.value,
        audience: form.elements.audience.value,
        status: form.elements.schedule.value === "Schedule later" ? "scheduled" : "draft"
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      message.textContent = data.error || "Campaign could not be created.";
      return;
    }
    window.location.href = "./campaigns.html";
  } catch {
    message.textContent = "Campaign service unavailable.";
  } finally {
    button.disabled = false;
  }
});
})();