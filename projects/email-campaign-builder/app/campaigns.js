(() => {
"use strict";
const list = document.querySelector("#campaign-list");
const message = document.querySelector("#campaign-message");

function render(campaigns) {
  list.replaceChildren();
  for (const campaign of campaigns) {
    const article = document.createElement("article");
    article.className = "card campaign-card";
    const info = document.createElement("div");
    const status = document.createElement("span");
    status.className = campaign.status === "draft" ? "status" : "status status-muted";
    status.textContent = campaign.status;
    const title = document.createElement("h3");
    title.textContent = campaign.name;
    const meta = document.createElement("p");
    meta.textContent = campaign.subject_line + " · " + campaign.audience;
    info.append(status, title, meta);

    const actions = document.createElement("div");
    const edit = document.createElement("a");
    edit.className = "button button-secondary button-small";
    edit.href = "./campaign-edit.html?id=" + encodeURIComponent(campaign.id);
    edit.textContent = "Edit";
    const view = document.createElement("a");
    view.className = "button button-small";
    view.href = "./campaign-detail.html?id=" + encodeURIComponent(campaign.id);
    view.textContent = "View";
    actions.append(view, edit);
    article.append(info, actions);
    list.append(article);
  }
  if (!campaigns.length) message.textContent = "No campaigns yet. Create your first campaign.";
}

async function load() {
  try {
    const response = await fetch("../api/campaigns", { credentials: "same-origin" });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      window.location.href = "./login.html";
      return;
    }
    if (!response.ok) throw new Error();
    render(Array.isArray(data.campaigns) ? data.campaigns : []);
  } catch {
    message.textContent = "Campaign service unavailable.";
  }
}
load();
})();