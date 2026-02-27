# NHM Pro Free Plagiarism Checker

## Current State
Full-stack plagiarism + AI detection app. Backend stores check history records (saveCheck, listChecks, getCheck, deleteCheck). Frontend has two pages: Checker and History. Navbar has tabs for those two pages.

## Requested Changes (Diff)

### Add
- Backend: `Suggestion` type with id, timestamp, name (optional), message text. `submitSuggestion(name, message)` public func. `listSuggestions()` query func (admin view). `deleteSuggestion(id)` func.
- Frontend: New `SuggestionsPage` component with a form (optional name field + message textarea + submit button). After submission show a thank-you confirmation. Add "Suggestions" tab to Navbar.
- App.tsx: Add "suggestions" to the Page type and render SuggestionsPage.

### Modify
- Navbar: Add a "Suggestions" tab alongside Checker and History.
- App.tsx: Handle the new "suggestions" page route.

### Remove
- Nothing removed.

## Implementation Plan
1. Update `main.mo` to add Suggestion type and submitSuggestion / listSuggestions / deleteSuggestion functions.
2. Regenerate backend bindings (generate_motoko_code).
3. Create `SuggestionsPage.tsx` with a submission form and confirmation state.
4. Update `Navbar.tsx` to include a Suggestions tab.
5. Update `App.tsx` to add "suggestions" page type and render SuggestionsPage.
