# NHM Pro Free Plagiarism Checker

## Current State
The app has had multiple deployment failures. The previous version had a plagiarism checker with n-gram detection, highlighted segments, and rewrite suggestions. Several bugs existed: highlights were hard to spot, the 2% score was hard to locate, and the alternatives were generic instructions rather than actual rephrased sentences.

## Requested Changes (Diff)

### Add
- Clicking a highlighted sentence in the "Annotated Text" panel scrolls the original input textarea to the same sentence and focuses/highlights it there, so the user can directly edit in the original text without searching.
- Each detected plagiarism segment now shows 2-3 fully humanized, rephrased alternative sentences (not tips or suggestions -- actual ready-to-use replacement sentences). These alternatives should be copy-able with one click so the user can paste them directly into the original text.

### Modify
- Annotated text highlights: amber for moderate similarity, red for high similarity, yellow for low similarity -- all clearly visible.
- Score calculation: percentage = (flagged sentence count / total sentence count) * 100, rounded to nearest integer.
- When a segment is clicked in the annotated panel, the textarea scrolls to the corresponding sentence and a visible border/glow highlights the matching text in the input.
- Alternatives panel now shows full rephrased sentences, not generic advice.

### Remove
- Generic suggestion text like "Try using synonyms" or "Consider restructuring" -- replaced with actual rephrased alternatives.

## Implementation Plan
1. Build a pure frontend React app (no backend needed -- detection logic runs client-side).
2. Implement n-gram similarity detection engine that splits text into sentences.
3. For each flagged sentence, generate 2-3 humanized rewritten versions using paraphrase templates.
4. Annotated text panel: render each sentence as a clickable span, colored by similarity level.
5. On click of a highlighted span: scroll the original textarea to that sentence's character offset using a hidden mirror or scroll calculation, and flash a highlight border.
6. Show alternatives as full ready-to-copy sentences in a side panel or tooltip.
7. Score = (flagged / total) * 100.
8. Report generation with print/PDF support.
9. History of past checks stored in localStorage.

## UX Notes
- Two-column layout: left = original input textarea, right = annotated output.
- Clicking annotated highlight syncs scroll position in the left textarea and pulses a border highlight on the matching range.
- Alternatives shown as boxed sentences with a "Copy" button on each -- no generic tips.
- Score gauge at top with Low/Moderate/High label.
- Unlimited characters allowed.
- Free report button (print/PDF).
