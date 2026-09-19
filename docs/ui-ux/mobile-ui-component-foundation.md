# Mobile UI Component Foundation

This is the reusable component foundation for the e-commerce mobile UX case study.

## Tokens

| Token | Working value | Purpose |
|---|---|---|
| Font | Inter | Interface typography |
| Base spacing | 8px | Consistent layout rhythm |
| Small radius | 8px | Fields and compact controls |
| Medium radius | 12px | Cards and containers |
| Large radius | 16px | Primary surfaces |
| Touch target | 44px minimum | Accessible interaction area |

## Typography

- Display: 28px / 34px
- Heading: 20px / 26px
- Body: 16px / 24px
- Supporting: 14px / 20px
- Caption: 12px / 16px

## Core Components

### Search field
Purpose: fast product discovery.

States:
- Default
- Focus
- Filled
- Clear
- Validation/error

### Product card
Must expose:
- Product image
- Product name
- Price
- Rating
- Useful secondary information without visual overload

### Primary action
Used for high-priority actions such as Add to cart and Continue to checkout.

States:
- Default
- Pressed
- Disabled
- Loading

### Navigation
Persistent access to:
- Home
- Search
- Cart
- Account

## Accessibility Rules

- Keep interactive targets at least 44px where practical.
- Never rely on color alone to communicate state.
- Keep labels explicit and readable.
- Preserve predictable keyboard/focus order where applicable.
- Provide visible feedback after important actions.

## Privacy Rules

- Collect only information needed for the task.
- Avoid exposing sensitive information in UI previews.
- Do not place secrets, API keys, tokens, or private data in design files or repository assets.

## Design Principle

**Reusable patterns over one-off styling.**

The component foundation should evolve from usability testing rather than being treated as a final design system before validation.
