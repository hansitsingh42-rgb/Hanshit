# Security Notes

This UI/UX portfolio is a static frontend and should remain safe by default.

## Rules

1. Never commit API keys, access tokens, passwords, private keys, cookies, or other secrets.
2. Never put server credentials in client-side HTML, CSS, or JavaScript.
3. If an API is added later, route sensitive operations through a trusted server-side endpoint and store secrets in environment variables.
4. Treat contact-form and query parameters as untrusted input.
5. Avoid collecting unnecessary personal information.
6. Do not expose private Figma, GitHub, or deployment credentials in public files.
7. Review third-party scripts before adding them; prefer no external script when native browser APIs are sufficient.
8. Keep dependencies minimal if the project is later migrated to a framework.
