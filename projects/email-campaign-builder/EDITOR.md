# Email editor boundary

The editor is frontend-only at this stage.

Included: template selection, headline/message fields, CTA text, safe text-only live preview, required-field validation, accessible labels.

Security: preview uses textContent rather than HTML injection. No arbitrary HTML, external scripts, network requests, persistence, or provider credentials are used.

Before production: sanitize and validate rich content server-side; enforce campaign ownership; validate sender identity; protect cookie-authenticated state-changing requests against CSRF; rate-limit endpoints; keep provider credentials server-side; apply provider/domain authorization and sending limits; avoid logging email bodies or credentials unnecessarily.