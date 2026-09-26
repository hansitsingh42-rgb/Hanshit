"use strict";

const { parseCookies, hashToken, getClient } = require("../../lib/auth");
const { validCsrf } = require("../../lib/request-security");

module.exports = async function handler(req, res) {
  if (req.method !== "PATCH") { res.setHeader("Allow", "PATCH"); return res.status(405).json({ error: "Method not allowed" }); }
  if (!validCsrf(req)) return res.status(403).json({ error: "Request validation failed." });
  const id = typeof req.query?.id === "string" ? req.query.id : "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "Invalid campaign id." });
  const audienceId = typeof req.body?.audienceId === "string" ? req.body.audienceId : "";
  if (!/^[0-9a-f-]{36}$/i.test(audienceId)) return res.status(400).json({ error: "Invalid audience id." });
  const token = parseCookies(req.headers.cookie)["__Host-ecb_session"];
  if (!token) return res.status(401).json({ error: "Authentication required." });
  let client;
  try {
    client = await getClient();
    const session = await client.query("SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>NOW() LIMIT 1", [hashToken(token)]);
    const userId = session.rows[0]?.user_id;
    if (!userId) return res.status(401).json({ error: "Authentication required." });
    const result = await client.query("UPDATE campaigns c SET audience_segment_id=$1, audience=a.name, updated_at=NOW() FROM audience_segments a WHERE c.id=$2 AND c.user_id=$3 AND a.id=$1 AND a.user_id=$3 RETURNING c.id,c.audience_segment_id,c.audience,c.updated_at", [audienceId, id, userId]);
    if (!result.rows[0]) return res.status(404).json({ error: "Campaign or audience not found." });
    return res.status(200).json({ campaign: result.rows[0] });
  } catch { return res.status(503).json({ error: "Campaign audience service unavailable." }); }
  finally { client?.release(); }
};
