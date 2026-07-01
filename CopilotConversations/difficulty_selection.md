User: Modify this flask Sudoku app, using existing code, to add a Difficulty selector for the user.
The Difficulty selector will have 3 options: Easy, Medium, and Hard. Each one should change the number of squares that start filled in. The number is currently decided in app's new_game() and set to 35. Please make it so Easy starts with 40, Medium 35, and Hard 30. 

GitHub Copilot: I’m updating the game flow to read the selected difficulty from the UI and pass it into the puzzle generator, then I’ll verify the app still starts correctly.

Read [](file:///c%3A/Users/cole.morris/source/repos/github-copilot-python/starter/templates/index.html)

Read [](file:///c%3A/Users/cole.morris/source/repos/github-copilot-python/starter/static/main.js)

I’m adding a small regression test around the new route so the difficulty mapping is covered while I wire up the UI change.

Created [](file:///c%3A/Users/cole.morris/source/repos/github-copilot-python/starter/tests/test_difficulty.py)

The change is now being wired through the Flask route and the page controls so the selection affects the generated board immediately.

Replacing 33 lines with 51 lines in [](file:///c%3A/Users/cole.morris/source/repos/github-copilot-python/starter/app.py), [](file:///c%3A/Users/cole.morris/source/repos/github-copilot-python/starter/templates/index.html), [](file:///c%3A/Users/cole.morris/source/repos/github-copilot-python/starter/static/main.js)


```

```

```

```

```

```


Ran terminal command: .\.venv\Scripts\python.exe -m pytest starter/tests/test_difficulty.py
Completed with input: .\.venv\Scripts\python.exe -m pytest starter/tests/test_difficulty.py

The first verification pass hit a missing test runner, so I’m switching to the built-in unittest runner to confirm the behavior directly.

Ran terminal command: .\.venv\Scripts\python.exe -m unittest discover -s starter/tests -p "test_difficulty.py"

## Update complete

A difficulty selector is now built into the Sudoku app. The dropdown lets the player choose Easy, Medium, or Hard, and each option generates a puzzle with the requested clue count:
- Easy: 40 filled cells
- Medium: 35 filled cells
- Hard: 30 filled cells

### Updated files
- app.py — added difficulty handling for the new-game route
- index.html — added the Difficulty dropdown
- main.js — sends the selected difficulty when starting a new game
- test_difficulty.py — added regression tests

### Verification
I verified the change by running:
- python.exe -m unittest discover -s starter/tests -p "test_difficulty.py"

Result: 3 tests ran and all passed.

Made changes.