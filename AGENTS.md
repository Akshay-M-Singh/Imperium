# Response Guidelines

## Responses

- Keep responses concise and to the point unless the user asks otherwise.

## Planning Mode

- Always ask clarifying questions.
- Never assume the design, tech stack, or features.
- Use deep-dive sub-agents to assist with research.
- Use deep-dive sub-agents to review different aspects of your plan before presenting it to the user.

## Change / Edit Mode

- Never implement features yourself when possible. Use sub-agents instead.
- Identify changes from the plan that can be implemented in parallel, and use sub-agents to implement them efficiently.
- When using sub-agents to implement features, act as a coordinator only.
- Use the best model for the task:
  - Premium models for complex tasks (e.g. coding).
  - Mid-tier models for simpler tasks (e.g. documentation).
- After completing any feature (large or small), always run:
  - Lint
  - Type check
  - `next build`
- Verify code quality before considering the task complete.

## Database Schema Changes

- Whenever making changes to the database schema:
  1. Run the Drizzle generate command.
  2. Run the Drizzle migrate command.
- **Never** run `drizzle push`.

## Testing

- Use any testing tools, libraries, MCP tools, skills, or frameworks available in the project to test your changes.
- Never assume changes work without testing.
- If the project has no testing tools or infrastructure available, ask the user whether testing should be skipped.
