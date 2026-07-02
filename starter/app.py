from flask import Flask, render_template, jsonify, request
import sudoku_logic

app = Flask(__name__)

# Keep a simple in-memory store for current puzzle and solution
CURRENT = {
    'puzzle': None,
    'solution': None
}

DIFFICULTY_CLUES = {
    'easy': 40,
    'medium': 35,
    'hard': 30
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/new')
def new_game():
    difficulty = request.args.get('difficulty', 'medium').lower()
    clues = DIFFICULTY_CLUES.get(difficulty, DIFFICULTY_CLUES['medium'])
    puzzle, solution = sudoku_logic.generate_puzzle(clues)
    CURRENT['puzzle'] = puzzle
    CURRENT['solution'] = solution
    return jsonify({'puzzle': puzzle})

@app.route('/check', methods=['POST'])
def check_solution():
    data = request.json
    board = data.get('board')
    solution = CURRENT.get('solution')
    if solution is None:
        return jsonify({'error': 'No game in progress'}), 400
    incorrect = []
    for i in range(sudoku_logic.SIZE):
        for j in range(sudoku_logic.SIZE):
            if board[i][j] != solution[i][j]:
                incorrect.append([i, j])
    return jsonify({'incorrect': incorrect})

@app.route('/hint')
def hint():
    row = request.args.get('row')
    col = request.args.get('col')
    solution = CURRENT.get('solution')
    if solution is None:
        return jsonify({'error': 'No game in progress'}), 400
    if row is None or col is None:
        return jsonify({'error': 'Missing row or col'}), 400
    try:
        row = int(row)
        col = int(col)
    except ValueError:
        return jsonify({'error': 'Invalid row or col'}), 400
    if not (0 <= row < sudoku_logic.SIZE and 0 <= col < sudoku_logic.SIZE):
        return jsonify({'error': 'Row or col out of range'}), 400
    return jsonify({'value': solution[row][col]})

if __name__ == '__main__':
    app.run(debug=True)