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
  try {
    const csrf = await fetch("../api/auth/csrf", { credentials: "same-origin" });
    const token = (await csrf.json()).csrfToken;
    await fetch("../api/auth/logout", {
      method: "POST", credentials: "same-origin",
      headers: { "X-CSRF-Token": token }
    });
  } finally {
    window.location.href = "./login.html";
  }
});
