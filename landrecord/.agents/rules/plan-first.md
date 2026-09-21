# Plan-First Workflow Rule

Always follow a Plan-First approach for all tasks in this project:

1. **Research & Plan First**:
   - For every request, thoroughly research the codebase and requirements.
   - Create an `implementation_plan.md` artifact detailing the problem, proposed changes, verification plan, and open questions.
   - Request feedback (`RequestFeedback = true`).

2. **Wait for User Approval**:
   - Present the implementation plan to the user.
   - Do NOT make code modifications or run destructive commands until the user approves the plan.

3. **Execute & Verify**:
   - Once approved, implement the changes cleanly.
   - Run automated verification (e.g. `npm run build`).
   - Create a `walkthrough.md` artifact detailing what was completed and verified.
