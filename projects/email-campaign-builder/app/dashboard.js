"use strict";

(async()=>{
  try{
    const response=await fetch("../api/auth/session",{credentials:"same-origin"});
    if(response.status===401){
      window.location.href="./login.html";
      return;
    }
    if(!response.ok)throw new Error();
  }catch{
    window.location.href="./login.html";
  }
})();

document.querySelector("#logout")?.addEventListener("click", async () => {
  const button = document.querySelector("#logout");
  button.disabled = true;
  try {
    const csrfResponse = await fetch("../api/auth/csrf", { credentials: "same-origin" });
    if (!csrfResponse.ok) throw new Error("Unable to verify sign-out request.");
    const csrfData = await csrfResponse.json();
    if (typeof csrfData.token !== "string" || !csrfData.token) throw new Error("Missing CSRF token.");

    const response = await fetch("../api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: { "X-CSRF-Token": csrfData.token }
    });
    if (!response.ok) throw new Error("Sign-out request failed.");
    window.location.href = "./login.html";
  } catch {
    button.disabled = false;
    window.alert("Sign out could not be completed. Please try again.");
  }
});
