# Security & Privacy Baseline

This project is a static UX prototype. Security is treated as a design requirement, not a later add-on.

## Rules

- Never commit passwords, API keys, access tokens, private keys, cookies, or personal records.
- Keep the prototype dependency-free unless a dependency has a clear, documented need.
- Do not add analytics, trackers, or external APIs without an explicit product requirement and privacy review.
- Keep demo state in memory unless persistence is required and its data model is reviewed.
- Do not use eval(), new Function(), inline event handlers, or dynamic script injection.
- Do not insert untrusted values with innerHTML; prefer text nodes and fixed markup.
- Keep Content Security Policy restrictive and update it only when a documented feature requires a new source.
- Minimize collected data and avoid collecting identity, location, credentials, or other sensitive information.
- Validate and constrain future user input before using it in the DOM or requests.
- Review third-party dependencies for maintenance, permissions, and supply-chain risk before adding them.

## Current implementation

The prototype has no server, authentication, external API, analytics, or persistent personal-data store. Its JavaScript is local, and its timer state exists only in memory.

## Reporting

If a security issue is found, do not publish credentials or exploit details in an issue. Remove exposed secrets from active systems first, rotate them if applicable, and report the issue privately through the repository owner's preferred security channel.
