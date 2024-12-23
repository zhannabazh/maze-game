    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const startGameButton = document.getElementById('start-game');
    const welcomeScreen = document.getElementById('welcome-screen');
    const gameScreen = document.createElement('div');
    gameScreen.id = 'game-screen';
    const settingsDiv = document.createElement('div');
    settingsDiv.id = 'settings';
    const mazeSizeLabel = document.createElement('label');
    mazeSizeLabel.for = 'maze-size';
    mazeSizeLabel.textContent = 'Maze Size:';
    const mazeSizeInput = document.createElement('input');
    mazeSizeInput.type = 'number';
    mazeSizeInput.id = 'maze-size';
    mazeSizeInput.value = 15;
    mazeSizeInput.min = 5;
    mazeSizeInput.max = 40;
    settingsDiv.appendChild(mazeSizeLabel);
    settingsDiv.appendChild(mazeSizeInput);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.id = 'buttons';
    const restartGameButton = document.createElement('button');
    restartGameButton.id = 'restart-game';
    restartGameButton.textContent = 'Restart';
    const exitGameButton = document.createElement('button');
    exitGameButton.id = 'exit-game';
    exitGameButton.textContent = 'Exit';
    buttonsDiv.appendChild(restartGameButton);
    buttonsDiv.appendChild(exitGameButton);

    let tileSize = 40;
    const mazeSizeDefault = 10;
    let mazeSize = mazeSizeDefault;
    let maze = [];
    let playerPosition = { x: 0, y: 0 };
    let exitPosition = { x: mazeSize - 1, y: mazeSize - 1 };

    gameScreen.appendChild(settingsDiv);
    gameScreen.appendChild(canvas);
    gameScreen.appendChild(buttonsDiv);
    document.body.appendChild(gameScreen);

    function setupCanvas() {
        tileSize = Math.max(10, Math.min(500 / mazeSize, 40));
        canvas.width = mazeSize * tileSize;
        canvas.height = mazeSize * tileSize;
        canvas.style.margin = '0 auto';
        canvas.style.display = 'block';
    }

    function drawMaze() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < mazeSize; y++) {
            for (let x = 0; x < mazeSize; x++) {
                if (maze[y][x] === 1) {
                    ctx.fillStyle = '#000';
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                } else {
                    ctx.fillStyle = '#FFF';
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }

        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(
            playerPosition.x * tileSize + tileSize / 2,
            playerPosition.y * tileSize + tileSize / 2,
            tileSize / 3,
            0,
            2 * Math.PI
        );
        ctx.fill();

        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(
            exitPosition.x * tileSize + tileSize / 2,
            exitPosition.y * tileSize + tileSize / 2,
            tileSize / 3,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }

    function generateMaze(size) {
        maze = Array.from({ length: size }, () => Array(size).fill(1));

        function carvePassagesFrom(x, y) {
            const directions = [
                [0, -1],
                [0, 1],
                [-1, 0],
                [1, 0],
            ];
            directions.sort(() => Math.random() - 0.5);

            for (const [dx, dy] of directions) {
                const nx = x + dx * 2;
                const ny = y + dy * 2;

                if (nx >= 0 && ny >= 0 && nx < size && ny < size && maze[ny][nx] === 1) {
                    maze[y + dy][x + dx] = 0;
                    maze[ny][nx] = 0;
                    carvePassagesFrom(nx, ny);
                }
            }
        }

        maze[0][0] = 0;
        carvePassagesFrom(0, 0);

        let x = size - 1;
        let y = size - 1;
        while (!(x === 0 && y === 0)) {
            maze[y][x] = 0;
            if (x > 0 && maze[y][x - 1] === 0) {
                x--;
            } else if (y > 0 && maze[y - 1][x] === 0) {
                y--;
            } else {
                if (x > 0) x--;
                else if (y > 0) y--;
            }
        }

        maze[size - 1][size - 1] = 0;
        exitPosition = { x: size - 1, y: size - 1 };

        drawMaze();
    }

    function movePlayer(dx, dy) {
        const newX = playerPosition.x + dx;
        const newY = playerPosition.y + dy;

        if (
            newX >= 0 &&
            newY >= 0 &&
            newX < mazeSize &&
            newY < mazeSize &&
            maze[newY][newX] === 0
        ) {
            playerPosition = { x: newX, y: newY };

            if (newX === exitPosition.x && newY === exitPosition.y) {
                const customAlert = document.createElement('div');
                customAlert.textContent = 'Congratulations! You reached the exit!';
                customAlert.style.position = 'absolute';
                customAlert.style.top = '50%';
                customAlert.style.left = '50%';
                customAlert.style.transform = 'translate(-50%, -50%)';
                customAlert.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                customAlert.style.color = 'white';
                customAlert.style.padding = '20px';
                customAlert.style.borderRadius = '10px';
                customAlert.style.textAlign = 'center';
                customAlert.style.zIndex = '1000';
                document.body.appendChild(customAlert);
                setTimeout(() => {
                    document.body.removeChild(customAlert);
                    restartGame();
                }, 2000);
            }

            drawMaze();
        }
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'w': 
            case 'W':
            case 'ц':
                movePlayer(0, -1);
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
            case 'і':
                movePlayer(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
            case 'ф':
                movePlayer(-1, 0);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                    case 'в':
                movePlayer(1, 0);
                break;
        }
    });

    startGameButton.addEventListener('click', () => {
        welcomeScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        gameScreen.style.justifyContent = 'center';
        gameScreen.style.alignItems = 'center';
        mazeSize = parseInt(mazeSizeInput.value) || mazeSizeDefault;
        setupCanvas();
        generateMaze(mazeSize);
        playerPosition = { x: 0, y: 0 };
        drawMaze();
    });

    restartGameButton.addEventListener('click', restartGame);
    exitGameButton.addEventListener('click', () => {
        gameScreen.style.display = 'none';
        welcomeScreen.style.display = 'flex';
        welcomeScreen.style.justifyContent = 'center';
        welcomeScreen.style.alignItems = 'center';
    });

    function restartGame() {
        mazeSize = parseInt(mazeSizeInput.value) || mazeSizeDefault;
        setupCanvas();
        generateMaze(mazeSize);
        playerPosition = { x: 0, y: 0 };
        drawMaze();
    }

    gameScreen.style.display = 'none';
    gameScreen.style.justifyContent = 'center';
    gameScreen.style.alignItems = 'center';
