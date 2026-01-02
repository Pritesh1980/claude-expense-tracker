I want to develop features in parallel using Git worktrees and subagents: $ARGUMENTS

You are in the parent folder of the main repo. You will need to change to the main repo
folder to create the worktrees.

Please execute this complete workflow:

PHASE 1 - SETUP WORKTREES:
For each feature mentioned:
1. Create a worktree at ../expense-tracker-[feature-name] with branch feature/[feature-name]
2. Set up the development environment in each worktree (if needed)
3. List all worktrees created

PHASE 2 - SPAWN SUBAGENTS:
For each feature, run a subagent in parallel with these instructions:
- You are working in the expense-tracker-[feature-name] worktree directory
- This is a completely isolated development environment
- Implement the [feature-name] feature with full functionality
- Include proper testing and error handling
- Compile and run tests, but don't attempt to run the application (e.g., don't do "npm run" or "npm run dev &", etc.) 
- When complete, write a detailed summary in [feature-name].work.txt in the main expense-tracker-ai directory
- The summary should include: what was implemented, files created/modified, dependencies added, testing approach, and integration notes

PHASE 3 - COORDINATION:
- Monitor all subagents working in parallel
- Ensure each subagent completes their feature implementation
- Verify each subagent creates their work summary file

PHASE 4 - FINAL SUMMARY:
After all subagents complete:
1. Read all the .work.txt files created by subagents
2. Provide a comprehensive summary of what was accomplished
3. List all features implemented and their status
4. Provide next steps for integration

Execute this complete parallel development workflow.