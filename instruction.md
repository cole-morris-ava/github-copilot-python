# Repository Instructions for GitHub Copilot

This project is a small Flask-based Sudoku game starter. Keep future changes consistent with the existing structure, style, and intent of the app.

## Project Context
- The app is a lightweight browser game built with Python and Flask.
- The main application logic lives in the starter folder.
- The experience is intentionally simple: server-rendered HTML plus vanilla JavaScript and CSS.
- Prefer small, focused changes over large rewrites unless the task explicitly calls for a broader refactor.

## Code Organization
- Keep Flask route and request handling logic in starter/app.py.
- Keep Sudoku rules, puzzle generation, and board helpers in starter/sudoku_logic.py.
- Keep UI markup in starter/templates/index.html.
- Keep client-side behavior in starter/static/main.js.
- Keep styling in starter/static/styles.css.
- Keep tests in starter/tests/ and use the existing unittest style.

## Python Style
- Use Python 3 conventions and keep code readable and straightforward.
- Use snake_case for functions, variables, and module names.
- Prefer small helper functions over overly clever abstractions.
- Keep route handlers simple and focused on request/response behavior.
- Use clear error responses and HTTP status codes when input is invalid.
- Preserve the existing in-memory game state pattern unless a task specifically requires a different storage approach.

## JavaScript Style
- Use modern vanilla JavaScript rather than frameworks or build tooling.
- Use camelCase for function and variable names.
- Keep DOM interaction explicit and easy to follow.
- Favor small, reusable helper functions and clear event wiring.
- Keep browser-side logic aligned with the existing Flask API responses.

## HTML and CSS Style
- Keep the markup simple and semantic.
- Preserve the current structure of the page and controls.
- Use CSS variables for theming and reuse existing color tokens where possible.
- Keep styling responsive and accessible, with clear focus states and readable contrast.
- Avoid introducing unnecessary dependencies or heavy styling frameworks.

## Testing Expectations
- Add or update tests when behavior changes.
- Prefer testing through the Flask test client when server behavior is involved.
- Keep tests focused on observable outcomes such as response status, JSON payloads, and puzzle clue counts.
- Match the existing unittest style rather than introducing a different framework.

## Change Guidelines
- Preserve the existing gameplay experience unless a feature request requires a change.
- Keep names and behavior consistent with the current project vocabulary, such as difficulty levels easy/medium/hard.
- Handle user-facing errors gracefully and make feedback clear.
- Avoid breaking existing features when implementing new ones.
- Keep dependencies minimal and avoid introducing unnecessary complexity.

## Output Expectations
- Prefer concise, maintainable code over verbose implementations.
- Write code that is easy for another contributor to read and extend.
- When adding new features, follow the current architecture and keep the implementation local to the relevant module.
- If a change impacts the user interface, keep it visually consistent with the existing design language.
