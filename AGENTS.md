# Response Guidelines

## Design System

- `DESIGN.md` (repo root) is the single source of truth for all visual design: colour, typography, layout, motion, and the element-type taxonomy (§10). Read it before creating or modifying any UI. New elements must follow an existing element type or extend the system per `DESIGN.md` §11.

## Database Schema Changes

- Whenever making changes to the database schema:
  1. Run the Drizzle generate command.
  2. Run the Drizzle migrate command.
- **Never** run `drizzle push`.

## Testing

- Use any testing tools, libraries, MCP tools, skills, or frameworks available in the project to test your changes.
- Never assume changes work without testing.
- If the project has no testing tools or infrastructure available, ask the user whether testing should be skipped.
