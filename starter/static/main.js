// Client-side rendering and interaction for the Flask-backed Sudoku
const SIZE = 9;
let puzzle = [];
let darkMode = false;

function createBoardElement() {
  const boardDiv = document.getElementById('sudoku-board');
  boardDiv.innerHTML = '';
  for (let i = 0; i < SIZE; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'sudoku-row';
    for (let j = 0; j < SIZE; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      const boxRow = Math.floor(i / 3);
      const boxCol = Math.floor(j / 3);
      const boxClass = (boxRow + boxCol) % 2 === 0 ? 'box-light' : 'box-dark';
      input.className = `sudoku-cell ${boxClass}`;
      input.dataset.row = i;
      input.dataset.col = j;
      input.dataset.box = boxClass;
      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^1-9]/g, '');
        e.target.value = val;
        validateBoard();
      });
      rowDiv.appendChild(input);
    }
    boardDiv.appendChild(rowDiv);
  }
}

function setTheme(isDark) {
  darkMode = isDark;
  document.body.classList.toggle('theme-dark', isDark);
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
  localStorage.setItem('sudoku-theme', isDark ? 'dark' : 'light');
}

function renderPuzzle(puz) {
  puzzle = puz;
  createBoardElement();
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = puzzle[i][j];
      const inp = inputs[idx];
      if (val !== 0) {
        inp.value = val;
        inp.disabled = true;
        inp.className = `sudoku-cell ${inp.dataset.box} prefilled`;
      } else {
        inp.value = '';
        inp.disabled = false;
        inp.className = `sudoku-cell ${inp.dataset.box}`;
      }
    }
  }
}

function validateBoard() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = Array.from(boardDiv.getElementsByTagName('input'));
  const board = [];

  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const value = inputs[idx].value;
      board[i][j] = value ? parseInt(value, 10) : 0;
    }
  }

  const conflicts = new Set();

  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const value = board[i][j];
      if (!value) continue;

      for (let x = 0; x < SIZE; x++) {
        if (x !== j && board[i][x] === value) {
          conflicts.add(i * SIZE + j);
          conflicts.add(i * SIZE + x);
        }
        if (x !== i && board[x][j] === value) {
          conflicts.add(i * SIZE + j);
          conflicts.add(x * SIZE + j);
        }
      }

      const startRow = Math.floor(i / 3) * 3;
      const startCol = Math.floor(j / 3) * 3;
      for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
          if ((row !== i || col !== j) && board[row][col] === value) {
            conflicts.add(i * SIZE + j);
            conflicts.add(row * SIZE + col);
          }
        }
      }
    }
  }

  inputs.forEach((input, idx) => {
    input.classList.toggle('conflict', conflicts.has(idx));
  });

  const msg = document.getElementById('message');
  if (conflicts.size > 0) {
    msg.className = '';
    msg.innerText = '';
    return;
  }

  const allFilled = board.every((row) => row.every((value) => value !== 0));
  if (allFilled) {
    checkSolution();
  } else {
    msg.className = '';
    msg.innerText = '';
  }
}

function getSelectedDifficulty() {
  return document.getElementById('difficulty').value;
}

async function newGame() {
  const difficulty = getSelectedDifficulty();
  const res = await fetch(`/new?difficulty=${encodeURIComponent(difficulty)}`);
  const data = await res.json();
  renderPuzzle(data.puzzle);
  const msg = document.getElementById('message');
  msg.innerText = '';
  msg.className = '';
}

async function checkSolution() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = [];
  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = inputs[idx].value;
      board[i][j] = val ? parseInt(val, 10) : 0;
    }
  }
  const res = await fetch('/check', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });
  const data = await res.json();
  const msg = document.getElementById('message');
  if (data.error) {
    msg.className = 'error';
    msg.innerText = data.error;
    return;
  }
  const incorrect = new Set(data.incorrect.map(x => x[0] * SIZE + x[1]));
  for (let idx = 0; idx < inputs.length; idx++) {
    const inp = inputs[idx];
    if (inp.disabled) continue;
    inp.className = `sudoku-cell ${inp.dataset.box}`;
    if (incorrect.has(idx)) {
      inp.classList.add('incorrect');
    }
  }
  if (incorrect.size === 0) {
    msg.className = 'success';
    msg.innerText = 'Congratulations! You solved it!';
  } else {
    msg.className = 'error';
    msg.innerText = 'Some cells are incorrect.';
  }
}

async function requestHint(row, col) {
  const res = await fetch(`/hint?row=${row}&col=${col}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to retrieve a hint');
  }
  return data;
}

async function applyHint() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = Array.from(boardDiv.getElementsByTagName('input'));
  const blankInputs = inputs.filter(inp => !inp.disabled && inp.value.trim() === '');
  const msg = document.getElementById('message');
  if (blankInputs.length === 0) {
    msg.className = 'error';
    msg.innerText = 'No empty cells remain for a hint.';
    return;
  }
  const chosenInput = blankInputs[Math.floor(Math.random() * blankInputs.length)];
  const row = chosenInput.dataset.row;
  const col = chosenInput.dataset.col;
  try {
    const data = await requestHint(row, col);
    chosenInput.value = data.value;
    chosenInput.disabled = true;
    chosenInput.className = `sudoku-cell ${chosenInput.dataset.box} hinted`;
    msg.className = 'success';
    msg.innerText = 'Hint revealed!';
  } catch (err) {
    msg.className = 'error';
    msg.innerText = err.message;
  }
}

// Wire buttons
window.addEventListener('load', () => {
  const storedTheme = localStorage.getItem('sudoku-theme');
  setTheme(storedTheme === 'dark');

  document.getElementById('new-game').addEventListener('click', newGame);
  document.getElementById('hint-button').addEventListener('click', applyHint);
  document.getElementById('check-solution').addEventListener('click', checkSolution);
  document.getElementById('theme-toggle').addEventListener('click', () => {
    setTheme(!darkMode);
  });

  newGame();
});