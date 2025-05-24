const menu = document.getElementById('menu');
const game = document.getElementById('game');
const rules = document.getElementById('rules');

let gameMode = 'twoPlayers';
let board = Array(9).fill(null);

let currentPlayer = 'X';
let selectedFigure = null;

let selectedButton = null;

let figuresX = [
    { size: 7, used: false },
    { size: 6, used: false },
    { size: 5, used: false },
    { size: 4, used: false },
    { size: 3, used: false },
    { size: 2, used: false },
    { size: 1, used: false },
];

let figuresO = [
    { size: 7, used: false },
    { size: 6, used: false },
    { size: 5, used: false },
    { size: 4, used: false },
    { size: 3, used: false },
    { size: 2, used: false },
    { size: 1, used: false },
];

const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

document.getElementById('twoPlayersBtn').addEventListener('click', () => {
    gameMode = 'twoPlayers';
    startGame();
});

document.getElementById('botBtn').addEventListener('click', () => {
    gameMode = 'vsBot';
    startGame();
});

document.getElementById('rulesBtn').addEventListener('click', () => {
    document.getElementById("menu").style.display = "none";
    document.getElementById("rules").style.display = "grid";
});

function startGame() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "grid";
    document.getElementById("figures").style.display = "flex";

    createBoard();
    setupFigureSelection();
}

function createBoard() {
    game.innerHTML = '';
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${row}-${col}`;

            cell.addEventListener('click', () => {
                handleCellClick(row, col, cell);
            });

            game.appendChild(cell);
        }
    }
}

function handleCellClick(row, col, cell) {
    const index = row * 3 + col;

    if (!selectedFigure) {
        alert("Сначала выбери фигуру!");
        return;
    }

    if (canPlaceFigure(index)) {
        board[index] = {
            size: selectedFigure.size,
            player: currentPlayer
        };

        cell.textContent = currentPlayer + selectedFigure.size;
        cell.style.fontSize = `${selectedFigure.size * 6 + 12}px`;

        if(currentPlayer === 'X'){
            const fig = figuresX.find(f => f.size === selectedFigure.size && !f.used);
            if(fig) fig.used = true;
        }else{
            const fig = figuresO.find(f => f.size === selectedFigure.size && !f.used);
            if(fig) fig.used = true;
        }

        selectedFigure = null;

        const result = checkWin();
        if (result) {
        const { winner, line } = result;


        line.forEach(index => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.classList.add('winning-cell');
    });

    
        setTimeout(() => {
            alert(`Победил игрок ${winner}!`);
            window.location.reload();
        }, 3000);

    return;
}


       const isBoardFull = board.every(cell => cell !== null);

       if (isBoardFull) {
       let maxSizeOnBoard = 0;
            for (const cell of board) {
                if (cell !== null && cell.size > maxSizeOnBoard) {
                maxSizeOnBoard = cell.size;
            }
        }

    const figures = currentPlayer === 'X' ? figuresX : figuresO;
    const hasBiggerFigure = figures.some(f => !f.used && f.size > maxSizeOnBoard);

    if (!hasBiggerFigure) {
        setTimeout(() => {
        alert('Ничья!');
        window.location.reload();
        return;
        }, 1500);
    }
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (gameMode === 'vsBot' && currentPlayer === 'O') {
    makeBotMove();
    }

    setupFigureSelection();

    } else {
        alert("Нельзя поставить сюда эту фигуру");
    }
}

function canPlaceFigure(index) {
    const cell = board[index];

    if (cell === null) return true;
    if (selectedFigure.size > cell.size) return true;

    return false;
}

function setupFigureSelection() {
    const figuresContainer = document.getElementById('figures');
    figuresContainer.innerHTML = ''; 

    // Секция для крестиков
    const xContainer = document.createElement('div');
    xContainer.classList.add('player-figures');
    const xTitle = document.createElement('p');
    xTitle.textContent = 'Игрок X';
    xContainer.appendChild(xTitle);

    figuresX.forEach((figure, index) => {
        if (!figure.used) {
            const button = document.createElement('button');
            button.textContent = `X: ${figure.size}`;
            button.style.fontSize = `${figure.size * 2 + 12}px`;
            button.setAttribute('data-index', index);
            button.setAttribute('data-player', 'X');

            button.addEventListener('click', () => {
                if (currentPlayer !== 'X') {
                    alert("Сейчас ход игрока O!");
                    return;
                }
                selectedFigure = figuresX[index];
                
                 if (selectedButton) selectedButton.classList.remove('selected-figure');
                button.classList.add('selected-figure');
                selectedButton = button;

                //setupFigureSelection(); 
            });

            xContainer.appendChild(button);
        }
    });

    // Секция для ноликов
    const oContainer = document.createElement('div');
    oContainer.classList.add('player-figures');
    const oTitle = document.createElement('p');
    oTitle.textContent = 'Игрок O';
    oContainer.appendChild(oTitle);

    figuresO.forEach((figure, index) => {
        if (!figure.used) {
            const button = document.createElement('button');
            button.textContent = `O: ${figure.size}`;
            button.style.fontSize = `${figure.size * 2 + 12}px`;
            button.setAttribute('data-index', index);
            button.setAttribute('data-player', 'O');

            button.addEventListener('click', () => {
                if (currentPlayer !== 'O') {
                    alert("Сейчас ход игрока X!");
                    return;
                }
                selectedFigure = figuresO[index];
                
                if (selectedButton) selectedButton.classList.remove('selected-figure');
                button.classList.add('selected-figure');
                selectedButton = button;
               // setupFigureSelection(); 
            });

            oContainer.appendChild(button);
        }
    });

    figuresContainer.appendChild(xContainer);
    figuresContainer.appendChild(oContainer);
}


function checkWin(){{
    for(let line of winningLines){
        const [a, b, c] = line;

        const cellA = board[a];
        const cellB = board[b];
        const cellC = board[c];

        if(cellA && cellB && cellC){
            if(cellA.player === cellB.player && cellB.player === cellC.player){
                console.log('Winner')
                return {winner: cellA.player, line};
            }
        }
    }

    return null;
}}

function makeBotMove(){
    setTimeout(() =>{

    let botFigure = figuresO.find(f => !f.used);
    if (!botFigure) return;

    selectedFigure = botFigure;

    for(let i = 0; i < figuresO.length; i++){
        const figure = figuresO[i];
        if(figure.used) continue;

        for(let row = 0; row < 3; row++){
            for(let col = 0; col < 3; col++){
                const index = row * 3 + col;
                const cell = document.getElementById(`cell-${row}-${col}`);

                if(canPlaceFigure(index)){
                    const originalCell = board[index];
                    board[index] = { size: figure.size, player: 'O' };

                    const result = checkWin();
                    if(result && result.winner === 'O'){
                        figure.used = true;
                        cell.textContent = `O${figure.size}`;
                        cell.style.fontSize = `${figure.size * 6 + 12}px`;

                        result.line.forEach(i => {
                            const row = Math.floor(i / 3);
                            const col = i % 3;
                            const c = document.getElementById(`cell-${row}-${col}`);
                            c.classList.add('winning-cell');
                        });

                        setTimeout(() => {
                            alert("Победил игрок O (бот)!");
                            window.location.reload();
                        }, 3000);
                        return;
                    }
                    board[index] = originalCell;
                }
            }
        }
        console.log(`проверяю фигуру размера ${figure.size}`);
    }

    for(let i = 0; i < figuresO.length; i++){
        const figure = figuresO[i];
        if(figure.used) continue;

        for(let row = 0; row < 3; row++){
            for(let col = 0; col < 3; col++){
                const index = row *3 + col;
                const cell = document.getElementById(`cell-${row}-${col}`);

                if(canPlaceFigure(index)){
                    const originalCell = board[index];
                    board[index] = { size: figure.size, player: 'X' };
                    const result = checkWin();
                    board[index] = originalCell;
                    
                    if(result && result.winner === 'X'){
                        board[index] = { size: figure.size, player: 'O' };
                        figure.used = true;
                        cell.textContent = `O${figure.size}`;
                        cell.style.fontSize = `${figure.size * 6 + 12}px`;

                        currentPlayer = 'X';
                        setupFigureSelection();
                        return;
                    }
                }
            } 
        }
    }
    for (let priority of [
        [1, 1],                                 
        [0, 0], [0, 2], [2, 0], [2, 2],        
        [0, 1], [1, 0], [1, 2], [2, 1]          
    ]) {
        for (let i = 0; i < figuresO.length; i++) {
            const figure = figuresO[i];
            if (figure.used) continue;

            const [row, col] = priority;
            const index = row * 3 + col;
            const cell = document.getElementById(`cell-${row}-${col}`);

            if (canPlaceFigure(index)) {
                board[index] = { size: figure.size, player: 'O' };
                figure.used = true;
                cell.textContent = `O${figure.size}`;
                cell.style.fontSize = `${figure.size * 6 + 12}px`;

                currentPlayer = 'X';
                setupFigureSelection();
                return;
            }
        }
    }
}, 800);
}
