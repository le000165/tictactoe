// ================== USER INTERFACE MODULE ===============
const userInterface = (() => {
    // DOM elements
    const displayMessage = document.getElementById('display');
    const board = document.getElementById('board');
    const leftName = document.getElementById('left-player-name');
    const alertSound = document.getElementById('alert-sound');
    const cellPress = document.getElementById('cell-press');
    const cellElements = document.querySelectorAll('[data-cell]');

    //placeMark()
    const placeMark = (cell, marker) => {
        cellClickSound();
        cell.classList.add(marker);
    }
    // displayPlayerName
    const displayPlayerName = (playerName) => {
        if (playerName.toUpperCase() !== 'AI') {
            leftName.textContent = playerName;
        }
    }

    // addBoardClass
    const addBoardHover = (className) => {
        board.classList.add(className);
    }

    //clearBoard
    const removeBoardHover = (className) => {
        board.classList.remove(className);
    }

    // updateMessage
    const updateMessage = (message) => {
        displayMessage.innerHTML = message;
    }

    // cellClickSound
    const cellClickSound = () => {
        cellPress.currentTime = 0;
        cellPress.play();
    }

    // end game alert
    const endGameAlertSound = () => {
        alertSound.play();
    }

    // setBlink
    const setBlink = (cells) => {
        cells.forEach(cell => {
            const cellStyle = cell.style;
            cellStyle.setProperty('--blink-winner', 'blink');
        });
    }

    // remove blink animation for winner
    const removeBlink = () => {
        cellElements.forEach(cell => {
            let cellStyle = cell.style;
            cellStyle.setProperty('--blink-winner', '');
        });
    }

    // public functions
    return {
        placeMark,
        updateMessage,
        removeBoardHover,
        addBoardHover,
        endGameAlertSound,
        setBlink,
        removeBlink
    }
})();

// ================== GAME BOARD MODULE ===============
const gameBoard = (() => {
    const cellElements = document.querySelectorAll('[data-cell]');
    const X_CLASS = 'x';
    const CIRCLE_CLASS = 'circle';
    const WINNING_COMBINATION = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let endGame = false;

    // handle each click on the cell
    const handleCellClick = (e) => {
        const cell = e.target;
        if (endGame) {
            resetGame();
        } else {
            if (cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)) {
                console.log('invalid press');
            } else {
                humanPlay(cell);
                if (checkWin(X_CLASS)) {
                    console.log('X won');
                } else if (checkWin(CIRCLE_CLASS)) {
                    console.log('Circle won');
                } else {
                    setTimeout(robotPlay, 350);
                }
            }
        }
    }

    // starting the game
    const startGame = () => {
        userInterface.addBoardHover(X_CLASS);
        cellElements.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
        removeResetCellClick();
    };

    // resetGame
    const resetGame = () => {
        circleTurn = false;
        endGame = false;
        removeAllMarks();
        userInterface.removeBlink();
        startGame();
        userInterface.updateMessage('Tic <span>Tac</span> Toe');
    };

    // removeMark 
    const removeAllMarks = () => {
        cellElements.forEach(cell => {
            cell.classList.remove(X_CLASS);
            cell.classList.remove(CIRCLE_CLASS);
        });
    }

    // remove reset game cell click
    const removeResetCellClick = () => {
        cellElements.forEach(cell => {
            cell.removeEventListener('click', resetGame);
        });
    };

    // check for winner
    const checkWin = (className) => {
        return WINNING_COMBINATION.some(combination => {
            // index is the array element inside of the combination defines in WINNING_COMBINATION
            const winFound = combination.every(index => {
                return cellElements[index].classList.contains(className);
            })
            // Found the winner
            if (winFound) {
                userInterface.removeBoardHover(X_CLASS);
                endGame = true;
                let winCells = [];
                // getListOf wincells
                combination.forEach(index => {
                    winCells.push(cellElements[index]);
                });
                userInterface.setBlink(winCells);
                userInterface.endGameAlertSound();
            }
            return winFound;
        });
    }

    // check draw
    const checkDraw = () => {
        const drawFound = [...cellElements].every(cell => {
            return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
        });
        if (drawFound) {
            endGame = true;
            userInterface.setBlink(cellElements);
            userInterface.updateMessage("It's a draw");
            userInterface.endGameAlertSound();
        }
        return drawFound;
    }

    // robot play
    const robotPlay = () => {
        if (getEmptyCells().length > 0) {
            const item = getEmptyCells()[Math.floor(Math.random() * getEmptyCells().length)];
            userInterface.placeMark(item, CIRCLE_CLASS);
            if (checkWin(CIRCLE_CLASS)) {
                userInterface.updateMessage("O's Win");
            } else {
                checkDraw();
            }
        }
    }
    // human play
    const humanPlay = (cell) => {
        console.log(cell);
        userInterface.placeMark(cell, X_CLASS)
        if (checkWin(X_CLASS)) {
            userInterface.updateMessage("X's Win");
        } else {
            checkDraw();
        }

    }

    // empty cell list
    const getEmptyCells = () => {
        return emptyList = [...cellElements].filter(function (element) {
            if (element.classList.contains(X_CLASS) || element.classList.contains(CIRCLE_CLASS)) {
                return;
            } else {
                return element;
            }
        });
    }

    // public functions
    return {
        startGame,
    };
})();


// ============== Start Game ==================
gameBoard.startGame();