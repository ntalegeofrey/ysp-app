# UCR System Updates - Final Phase

## Changes Required:

### Backend:
1. ✅ Stats count only unresolved issues
2. Update `findOpenIssues` to return ALL issues (Critical, High, Medium) not just Critical/High
3. Create endpoint to extract all individual issues from a report

### Frontend:
1. Fix JSX error in view modal
2. Create helper to extract ALL issues from a report (Critical, High, Medium)
3. Persisting Issues area shows each individual issue as separate item
4. Rename "Critical Issues" stat to "Issues"
5. Remove search button, filters auto-update
6. Simplify view modal to only show list of issues with color-coded status
7. Connect monthly chart to backend endpoint
8. When issue is resolved, only "Issues" count decreases (graph data stays)

## Status:
- Backend stats update: DONE
- Frontend fixes: IN PROGRESS
