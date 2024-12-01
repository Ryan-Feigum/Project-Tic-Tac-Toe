// Factory function for managing Player objects
const Player = (name, marker) => {
   const getName = () => name || `Player (${marker})`;
   const getMarker = () => marker;;
   return { getName, getMarker };
};

// Factory function for managing the game board
const GameBoard = () => {
    let options = ["", "", "", "", "", "", "", "", ""];

    // Updates the game board with the given marker at the specified position
    const updateCell = (index, marker) => {
        if (options[index] !== "") return false;
        options[index] = marker;
        return true;
    };

    const resetBoard = () => {
        options = ["", "", "", "", "", "", "", "", ""];
    };

    const checkWinner = () => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // For loop to iterate over each value in the winConditions array
        for (const condition of winConditions) {
            const [a, b, c] = condition;
            if (options[a] && options[a] === options[b] && options[b] === options[c]) {
                
                // Return the winning marker
                return options[a]; 
            }
        }

        // Return "Draw" if no spaces are left
        if (!options.includes("")) return "Draw"; 

        // Game is still ongoing
        return null; 
    };

    // Return a copy to help prevent unintended side effects from modification
    const getOptions = () => [...options]; 

    return { updateCell, resetBoard, checkWinner, getOptions };
};

// Factory function for managing the game controller
const GameController = (gameBoard) => {
    let playerOne;
    let playerTwo;
    let currentPlayer;
    let running = false;

    // Adds event listeners to the game board cells and buttons
    const initializeGame = (cells, statusText, startGameBtn, restartBtn) => {
        cells.forEach((cell, index) => {
            cell.addEventListener("click", () => cellClicked(cell, index, statusText));
        });

        // NEEDS REVIEW: Removing the startGameBtn.addEventListener causes the restart button to stop working...
        startGameBtn.addEventListener("click", () => startGame());
        restartBtn.addEventListener("click", () => restartGame(cells, statusText));
        statusText.textContent = `${currentPlayer.getName()}'s turn`;
    };

    // Update the cell at the specified index with the current player's marker
    const cellClicked = (cell, index, statusText) => {

        // Returns null if the game is not running or the cell is already occupied
        if (!running || !gameBoard.updateCell(index, currentPlayer.getMarker())) 
            return;

        // Set the cell's text content to the current player's marker
        cell.textContent = currentPlayer.getMarker();
        
        // Check if the current player has won
        const winner = gameBoard.checkWinner();
        if (winner) {
            running = false;
            statusText.textContent = winner === "Draw" ? "It's a draw!" : `${currentPlayer.getName()} wins!`;
        } else {

            // Switch the current player if there is not a winner or a draw
            currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
            statusText.textContent = `${currentPlayer.getName()}'s turn`;
        }
    };

    // Reset the game board and players
    const restartGame = (cells, statusText) => {

        // Set default conditions for the game start
        currentPlayer = playerOne;
        running = true;

        // Shows the input fields for player names and the start game button
        inputContainer.style.display = "block";

        // Hides the restart button 
        restartContainer.style.display = "none";

        // Reset the game board cells
        gameBoard.resetBoard();

        // Reset the DOM element cells
        cells.forEach((cell) => (cell.textContent = ""));

        // Reset the name input fields
        playerOneNameInput.value = "";
        playerTwoNameInput.value = "";

        // Reset the status text
        statusText.textContent = "Let's play!";
    };

    const startGame = () => {

        // Populate player objects
        const playerOneName = playerOneNameInput.value.trim();
        const playerTwoName = playerTwoNameInput.value.trim();
        playerOne = Player(playerOneName, "X");
        playerTwo = Player(playerTwoName, "O");

        // Set default conditions for the game start
        currentPlayer = playerOne;
        running = true;

        // Hides the input fields for player names and the start game button
        inputContainer.style.display = "none";

        // Displays the restart button
        restartContainer.style.display = "block";
        
        initializeGame(cells, statusText, startGameBtn, restartBtn);
    };

    return { startGame };
};

// Main script ------------------------------------------------

// Get DOM elements
const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const startGameBtn = document.querySelector("#startGameBtn");
const restartBtn = document.querySelector("#restartBtn");
const playerOneNameInput = document.querySelector("#playerOneName");
const playerTwoNameInput = document.querySelector("#playerTwoName");
const inputContainer = document.querySelector("#inputContainer");
const restartContainer = document.querySelector("#restartContainer");

// Create the game board and controller
const gameBoard = GameBoard();
const gameController = GameController(gameBoard);

// Start game after player names are entered
startGameBtn.addEventListener("click", () => gameController.startGame());