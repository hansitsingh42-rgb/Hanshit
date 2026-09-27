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
