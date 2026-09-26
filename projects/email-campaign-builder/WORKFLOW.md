# Product workflow

The project purpose remains an email campaign builder.

## Current sequence

1. Landing page
2. Authentication/application shell
3. Campaign creation
4. Email content/editor
5. Audience and segmentation
6. Automation
7. Analytics
8. Provider integration
9. Security/deployment audit

## Campaign creation boundary

The frontend validates basic fields for usability only. It does not send email, store campaign data, authenticate users, or contact an email provider.

When a backend is added, every campaign operation must be authorized server-side and validated again on the server. Campaign ownership must be checked before read/update/delete operations.

## Stage 12 status

Campaign persistence is the next backend implementation boundary. The existing frontend workflow remains unchanged. Campaign data must be stored per authenticated user, with server-side ownership checks on every read, update, and delete operation.
