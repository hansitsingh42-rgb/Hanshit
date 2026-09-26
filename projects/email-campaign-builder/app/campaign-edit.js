(() => {
"use strict";
const form = document.querySelector("#edit-campaign-form");
const message = document.querySelector("#edit-message");
const id = new URLSearchParams(window.location.search).get("id");
if (!form || !message || !/^[0-9a-f-]{36}$/i.test(id || "")) {
  if (message) message.textContent = "Invalid campaign link.";
  throw new Error("Invalid campaign id");
}

async function csrfToken() {
  const response = await fetch("../api/auth/csrf", { credentials: "same-origin" });
  if (!response.ok) throw new Error();
  const data = await response.json();
  return data.token;
}

async function load() {
  try {
    const csrfResponse = await fetch("../api/auth/csrf", { credentials: "same-origin" });
    const csrfData = await csrfResponse.json().catch(() => ({}));
    if (!csrfResponse.ok || typeof csrfData.token !== "string") throw new Error();
    const response = await fetch("../api/campaigns/" + encodeURIComponent(id), { credentials: "same-origin" });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) return (window.location.href = "./login.html");
    if (!response.ok) throw new Error();
    const c = data.campaign;
    form.elements.name.value = c.name;
    form.elements.subject.value = c.subject_line;
    form.elements.audience.value = c.audience;
    form.elements.status.value = c.status;
  } catch {
    message.textContent = "Campaign could not be loaded.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const button = form.querySelector("button");
  button.disabled = true;
  try {
    const response = await fetch("../api/campaigns/" + encodeURIComponent(id), {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfData.token },
      body: JSON.stringify({
        name: form.elements.name.value,
        subjectLine: form.elements.subject.value,
        audience: form.elements.audience.value,
        status: form.elements.status.value
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      message.textContent = data.error || "Campaign could not be updated.";
      return;
    }
    message.textContent = "Campaign saved.";
  } catch {
    message.textContent = "Campaign service unavailable.";
  } finally {
    button.disabled = false;
  }
});

load();
})();