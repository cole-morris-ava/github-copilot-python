// Client-side rendering and interaction for the Flask-backed Sudoku
const SIZE = 9;
let puzzle = [];
let darkMode = false;
let timerInterval = null;
let startTime = null;
let gameCompleted = false;
let currentDifficulty = 'medium';

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

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
  const timerEl = document.getElementById('timer');
  if (!timerEl) return;
  if (!startTime || gameCompleted) {
    timerEl.textContent = `Time: ${formatTime(0)}`;
    return;
  }
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  timerEl.textContent = `Time: ${formatTime(elapsedSeconds)}`;
}

function startTimer() {
  stopTimer();
  gameCompleted = false;
  startTime = Date.now();
  updateTimerDisplay();
  timerInterval = window.setInterval(updateTimerDisplay, 1000);
}

function stopTimer() {
  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
}

function getStoredFastTimes() {
  try {
    const stored = localStorage.getItem('sudoku-fast-times');
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    return [];
  }
}

function renderLeaderboard(entries) {
  const tbody = document.getElementById('leaderboard-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!entries.length) {
    const emptyRow = document.createElement('tr');
    const emptyCell = document.createElement('td');
    emptyCell.colSpan = 4;
    emptyCell.textContent = 'No completed games yet.';
    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);
    return;
  }
  entries.forEach((entry, index) => {
    const row = document.createElement('tr');
    const rank = document.createElement('td');
    const time = document.createElement('td');
    const difficulty = document.createElement('td');
    const date = document.createElement('td');
    rank.textContent = index + 1;
    time.textContent = formatTime(entry.seconds);
    difficulty.textContent = entry.difficulty;
    date.textContent = entry.completedAt;
    row.append(rank, time, difficulty, date);
    tbody.appendChild(row);
  });
}

function loadLeaderboard() {
  const entries = getStoredFastTimes()
    .slice(0, 10)
    .sort((a, b) => a.seconds - b.seconds);
  renderLeaderboard(entries);
}

function saveFastTime(seconds) {
  const entries = getStoredFastTimes();
  entries.push({
    seconds,
    difficulty: currentDifficulty,
    completedAt: new Date().toLocaleString()
  });
  const sortedEntries = entries.sort((a, b) => a.seconds - b.seconds).slice(0, 10);
  try {
    localStorage.setItem('sudoku-fast-times', JSON.stringify(sortedEntries));
  } catch (err) {
    // Ignore storage errors and keep the UI responsive.
  }
  renderLeaderboard(sortedEntries);
}

function completeGame() {
  if (gameCompleted) return;
  gameCompleted = true;
  stopTimer();
  if (startTime) {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    saveFastTime(elapsedSeconds);
  }
  updateTimerDisplay();
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
  currentDifficulty = getSelectedDifficulty();
  const res = await fetch(`/new?difficulty=${encodeURIComponent(currentDifficulty)}`);
  const data = await res.json();
  renderPuzzle(data.puzzle);
  startTimer();
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
    completeGame();
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

  loadLeaderboard();
  newGame();
});