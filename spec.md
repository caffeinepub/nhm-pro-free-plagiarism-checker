# NHM Pro Free Plagiarism Checker

## Current State
The app has a Checker, History, Suggestions, and Admin page. The Admin page shows submitted suggestions with delete capability. It is accessible to anyone via the Navbar without any authentication.

## Requested Changes (Diff)

### Add
- PIN gate on the Admin tab: before showing the Suggestions Inbox, prompt the user to enter a 4-digit PIN
- The correct PIN is hardcoded as "2025" (a simple client-side gate)
- After entering the correct PIN, show the inbox and remember the session (until page reload)
- Wrong PIN shows an error message

### Modify
- AdminInboxPage: wrap content in a PIN entry screen that shows first; on correct PIN, reveal the inbox

### Remove
- Nothing removed

## Implementation Plan
1. Add a `PinGate` component that renders a PIN entry form (4-digit input, submit button, error message)
2. In `AdminInboxPage`, add local state `unlocked` (default false); render `PinGate` when not unlocked, render inbox when unlocked
3. Correct PIN: "2025" (hardcoded, client-side only)
