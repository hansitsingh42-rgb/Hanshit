const crypto=require("node:crypto");
const { recoverStaleJobs }=require("../../lib/stale-job-recovery");

const MAX_SECRET_LENGTH=512;

function authorized(req){
  const secret=process.env.CRON_SECRET;
  const header=String(req.headers.authorization||"");
  if(typeof secret!=="string" || secret.length<24 || secret.length>MAX_SECRET_LENGTH || !header.startsWith("Bearer ")) return false;
  const supplied=header.slice(7);
  if(!supplied || supplied.length>MAX_SECRET_LENGTH) return false;
  const a=Buffer.from(supplied);
  const b=Buffer.from(secret);
  return a.length===b.length && crypto.timingSafeEqual(a,b);
}

module.exports=async function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed"});}
  if(!authorized(req)) return res.status(401).json({error:"Unauthorized."});
  try{return res.status(200).json(await recoverStaleJobs(25));}
  catch{return res.status(503).json({error:"Delivery recovery service unavailable."});}
};
