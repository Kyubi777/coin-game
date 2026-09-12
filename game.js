const game =
    document.getElementById("game");

const player =
    document.getElementById("player");


const scoreElement =
    document.getElementById("score");

const bestScoreElement =
    document.getElementById("bestScore");

const levelElement =
    document.getElementById("level");

const livesElement =
    document.getElementById("lives");

const coinsElement =
    document.getElementById("coins");


const startScreen =
    document.getElementById("startScreen");

const pauseScreen =
    document.getElementById("pauseScreen");

const gameOverScreen =
    document.getElementById("gameOver");

const shopScreen =
    document.getElementById("shopScreen");


const pauseButton =
    document.getElementById("pauseButton");

const resumeButton =
    document.getElementById("resumeButton");

const leftButton =
    document.getElementById("leftButton");

const rightButton =
    document.getElementById("rightButton");

const startBestScore =
    document.getElementById("startBestScore");

    const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restartButton");


const shopButton =
    document.getElementById("shopButton");

const closeShop =
    document.getElementById("closeShop");


const shopCoins =
    document.getElementById("shopCoins");

const lifeUpgrade =
    document.getElementById("lifeUpgrade");

const speedUpgrade =
    document.getElementById("speedUpgrade");


const finalScore =
    document.getElementById("finalScore");

const finalLevel =
    document.getElementById("finalLevel");

const earnedCoins =
    document.getElementById("earnedCoins");


// =========================
// GAME VARIABLES
// =========================

let playerX = 179;

let score = 0;

let lives = 3;

let maxLives = 3;

let level = 1;


let coins =
    Number(
        localStorage.getItem("coins")
    ) || 0;


let bestScore =
    Number(
        localStorage.getItem("bestScore")
    ) || 0;
if (startBestScore) {
    startBestScore.textContent =
        "Best Score: " + bestScore;
}

let gameRunning = false;

let paused = false;

let invincible = false;

let shieldActive = false;


let selectedCharacter =
    "blue";


let obstacles = [];

let powerups = [];

let coinObjects = [];


let animationId;
let mobileDirection = 0;
let mobileMoveInterval = null;

// =========================
// UPGRADES
// =========================

let extraLife =
    localStorage.getItem(
        "extraLife"
    ) === "true";


let speedUpgradeBought =
    localStorage.getItem(
        "speedUpgrade"
    ) === "true";


bestScoreElement.textContent =
    "Best: " + bestScore;


coinsElement.textContent =
    "🪙 " + coins;


// =========================
// SOUND
// =========================

const audioContext =
    new (
        window.AudioContext ||
        window.webkitAudioContext
    )();


function playSound(
    frequency,
    duration,
    type = "sine"
) {

    const oscillator =
        audioContext.createOscillator();


    const gain =
        audioContext.createGain();


    oscillator.type =
        type;


    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        0.08,
        audioContext.currentTime
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start();


    oscillator.stop(
        audioContext.currentTime +
        duration
    );
}


// =========================
// STARS
// =========================

for (
    let i = 0;
    i < 40;
    i++
) {

    const star =
        document.createElement("div");


    star.className =
        "star";


    star.style.left =
        Math.random() * 100 + "%";


    star.style.top =
        Math.random() * 100 + "%";


    game.appendChild(star);
}


// =========================
// CHARACTER SELECTION
// =========================

const characterButtons =
    document.querySelectorAll(
        ".characterButton"
    );


characterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                characterButtons.forEach(
                    b =>
                        b.classList.remove(
                            "selected"
                        )
                );


                button.classList.add(
                    "selected"
                );


                selectedCharacter =
                    button.dataset.character;


                player.className =
                    "";


                if (
                    selectedCharacter !==
                    "blue"
                ) {

                    player.classList.add(
                        selectedCharacter
                    );
                }

            }
        );

    }
);


// =========================
// CONTROLS
// =========================
function movePlayer(direction) {

    if (
        !gameRunning ||
        paused
    ) {
        return;
    }

    const speed =
        speedUpgradeBought
            ? 35
            : 25;

    playerX +=
        direction * speed;

    if (playerX < 0) {
        playerX = 0;
    }

    if (playerX > 358) {
        playerX = 358;
    }

    player.classList.add(
        "running"
    );

    player.style.left =
        playerX + "px";

    setTimeout(
        () => {
            player.classList.remove(
                "running"
            );
        },
        200
    );
}
document.addEventListener(
    "keydown",
    event => {

        if (
            !gameRunning ||
            paused
        ) {
            return;
        }


        if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight"
        ) {

            player.classList.add(
                "running"
            );


            setTimeout(
                () => {

                    player.classList.remove(
                        "running"
                    );

                },
                200
            );
        }


        if (
    event.key === "ArrowLeft"
) {
    movePlayer(-1);
}

if (
    event.key === "ArrowRight"
) {
    movePlayer(1);
}


        if (
            playerX < 0
        ) {
            playerX = 0;
        }


        if (
            playerX > 358
        ) {
            playerX = 358;
        }


        player.style.left =
            playerX + "px";

    }
);

// =========================
// MOBILE CONTROLS
// =========================

// =========================
// MOBILE HOLD CONTROLS
// =========================

function startMobileMove(direction) {

    if (!gameRunning || paused) {
        return;
    }

    mobileDirection = direction;

    movePlayer(direction);

    if (mobileMoveInterval) {
        clearInterval(mobileMoveInterval);
    }

    mobileMoveInterval = setInterval(() => {

        if (!gameRunning || paused) {
            stopMobileMove();
            return;
        }

        movePlayer(mobileDirection);

    }, 70);
}


function stopMobileMove() {

    mobileDirection = 0;

    if (mobileMoveInterval) {

        clearInterval(
            mobileMoveInterval
        );

        mobileMoveInterval = null;
    }
}


leftButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        startMobileMove(-1);
    }
);


rightButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        startMobileMove(1);
    }
);


window.addEventListener(
    "pointerup",
    stopMobileMove
);


window.addEventListener(
    "pointercancel",
    stopMobileMove
);

// =========================
// CREATE OBSTACLE
// =========================

function createObstacle() {

    const obstacle =
        document.createElement(
            "div"
        );


    obstacle.className =
        "obstacle";


    const colors = [

        "linear-gradient(135deg,#ff1744,#ff6d00)",

        "linear-gradient(135deg,#ff00cc,#7b00ff)",

        "linear-gradient(135deg,#00ff87,#00b7ff)"

    ];


    obstacle.style.background =
        colors[
            Math.floor(
                Math.random() *
                colors.length
            )
        ];


    obstacle.style.left =
        Math.random() * 358 + "px";


    obstacle.style.top =
        "-50px";


    game.appendChild(
        obstacle
    );


    const speed =
        3 +
        Math.random() * 2 +
        level * 0.45;


    obstacles.push({

        element:
            obstacle,

        y:
            -50,

        speed:
            speed

    });
}


// =========================
// CREATE COIN
// =========================

function createCoin() {

    const coin =
        document.createElement("div");

    coin.className = "coin";

    coin.innerHTML = `
        <div class="coinInner">
            <span>★</span>
        </div>
    `;

    coin.style.left =
        Math.random() * 362 + "px";

    coin.style.top =
        "-40px";

    game.appendChild(coin);

    coinObjects.push({

        element: coin,

        y: -40,

        speed: 3.5
    });
}


// =========================
// CREATE POWERUP
// =========================

function createPowerup() {

    const powerup =
        document.createElement(
            "div"
        );


    powerup.className =
        "powerup";


    if (
        Math.random() < 0.5
    ) {

        powerup.textContent =
            "⚡";


        powerup.dataset.type =
            "shield";

    } else {

        powerup.textContent =
            "💣";


        powerup.dataset.type =
            "bomb";
    }


    powerup.style.left =
        Math.random() * 362 + "px";


    powerup.style.top =
        "-40px";


    game.appendChild(
        powerup
    );


    powerups.push({

        element:
            powerup,

        y:
            -40,

        speed:
            3

    });
}


// =========================
// COLLISION
// =========================

function isColliding(
    object
) {

    const playerRect =
        player.getBoundingClientRect();


    const objectRect =
        object.element
            .getBoundingClientRect();


    return !(
        playerRect.right <
            objectRect.left ||

        playerRect.left >
            objectRect.right ||

        playerRect.bottom <
            objectRect.top ||

        playerRect.top >
            objectRect.bottom
    );
}


// =========================
// EXPLOSION
// =========================

function createExplosion(
    element
) {

    const explosion =
        document.createElement(
            "div"
        );


    explosion.className =
        "explosion";


    explosion.style.left =
        element.offsetLeft - 7 + "px";


    explosion.style.top =
        element.offsetTop - 7 + "px";


    game.appendChild(
        explosion
    );


    setTimeout(
        () => {

            explosion.remove();

        },
        350
    );
}


// =========================
// COLLECT COIN
// =========================

function collectCoin(
    coin
) {

    coins++;


    coinsElement.textContent =
        "🪙 " + coins;


    localStorage.setItem(
        "coins",
        coins
    );


    playSound(
        1000,
        0.12,
        "square"
    );


    const effect =
        document.createElement(
            "div"
        );


    effect.className =
        "coinCollected";


    effect.textContent =
        "+1";


    effect.style.left =
        coin.element.offsetLeft +
        "px";


    effect.style.top =
        coin.element.offsetTop +
        "px";


    game.appendChild(
        effect
    );


    setTimeout(
        () => {

            effect.remove();

        },
        500
    );


    coin.element.remove();


    coinObjects =
        coinObjects.filter(
            c => c !== coin
        );
}


// =========================
// DISPLAY LIVES
// =========================

function updateLivesDisplay() {

    livesElement.textContent =
        "❤️".repeat(lives) +
        "🖤".repeat(
            Math.max(
                0,
                maxLives - lives
            )
        );
}


// =========================
// LOSE LIFE
// =========================

function loseLife(
    obstacle
) {

    if (invincible)
        return;


    if (shieldActive) {

        createExplosion(
            obstacle.element
        );


        obstacle.element.remove();


        obstacles =
            obstacles.filter(
                o =>
                    o !== obstacle
            );


        playSound(
            800,
            0.15,
            "square"
        );


        return;
    }


    invincible = true;


    lives--;


    updateLivesDisplay();


    createExplosion(
        obstacle.element
    );


    game.classList.add(
        "shake"
    );


    playSound(
        120,
        0.25,
        "sawtooth"
    );


    setTimeout(
        () => {

            game.classList.remove(
                "shake"
            );

        },
        250
    );


    obstacle.element.remove();


    obstacles =
        obstacles.filter(
            o =>
                o !== obstacle
        );


    player.classList.add(
        "invincible"
    );


    setTimeout(
        () => {

            invincible = false;


            player.classList.remove(
                "invincible"
            );

        },
        1500
    );


    if (
        lives <= 0
    ) {

        gameOver();
    }
}


// =========================
// POWERUP
// =========================

function activatePowerup(
    powerup
) {

    const type =
        powerup.element.dataset.type;


    if (
        type === "shield"
    ) {

        shieldActive = true;


        player.classList.add(
            "shield"
        );


        playSound(
            900,
            0.2
        );


        setTimeout(
            () => {

                shieldActive =
                    false;


                player.classList.remove(
                    "shield"
                );

            },
            5000
        );
    }


    if (
        type === "bomb"
    ) {

        playSound(
            100,
            0.4,
            "sawtooth"
        );


        obstacles.forEach(
            obstacle => {

                createExplosion(
                    obstacle.element
                );


                obstacle.element.remove();

            }
        );


        obstacles = [];


        score += 10;


        scoreElement.textContent =
            "Score: " + score;


        updateLevel();
    }


    powerup.element.remove();


    powerups =
        powerups.filter(
            p =>
                p !== powerup
        );
}


// =========================
// LEVEL
// =========================

function updateLevel() {

    const newLevel =
        Math.floor(
            score / 10
        ) + 1;


    if (
        newLevel > level
    ) {

        level =
            newLevel;


        levelElement.textContent =
            "Level: " + level;


        playSound(
            900,
            0.15,
            "square"
        );
    }
}


// =========================
// GAME LOOP
// =========================

function gameLoop() {

    if (
        !gameRunning ||
        paused
    ) {

        return;
    }


    // =====================
    // OBSTACLES
    // =====================

    for (
        let i =
            obstacles.length - 1;

        i >= 0;

        i--
    ) {

        const obstacle =
            obstacles[i];


        obstacle.y +=
            obstacle.speed;


        obstacle.element.style.top =
            obstacle.y + "px";


        if (
            isColliding(
                obstacle
            )
        ) {

            loseLife(
                obstacle
            );


            continue;
        }


        if (
            obstacle.y > 600
        ) {

            score++;


            scoreElement.textContent =
                "Score: " + score;


            obstacle.element.remove();


            obstacles.splice(
                i,
                1
            );


            updateLevel();
        }
    }


    // =====================
    // COINS
    // =====================

    for (
        let i =
            coinObjects.length - 1;

        i >= 0;

        i--
    ) {

        const coin =
            coinObjects[i];


        coin.y +=
            coin.speed;


        coin.element.style.top =
            coin.y + "px";


        if (
            isColliding(
                coin
            )
        ) {

            collectCoin(
                coin
            );


            continue;
        }


        if (
            coin.y > 600
        ) {

            coin.element.remove();


            coinObjects.splice(
                i,
                1
            );
        }
    }


    // =====================
    // POWERUPS
    // =====================

    for (
        let i =
            powerups.length - 1;

        i >= 0;

        i--
    ) {

        const powerup =
            powerups[i];


        powerup.y +=
            powerup.speed;


        powerup.element.style.top =
            powerup.y + "px";


        if (
            isColliding(
                powerup
            )
        ) {

            activatePowerup(
                powerup
            );


            continue;
        }


        if (
            powerup.y > 600
        ) {

            powerup.element.remove();


            powerups.splice(
                i,
                1
            );
        }
    }


    // =====================
    // SPAWN OBSTACLES
    // =====================

    const spawnChance =
        0.022 +
        level * 0.002;


    if (
        Math.random() <
        spawnChance
    ) {

        createObstacle();
    }


    // =====================
    // SPAWN COINS
    // =====================

    const coinSpawnChance =
        0.006 +
        level * 0.001;


    if (
        Math.random() <
        coinSpawnChance
    ) {

        createCoin();
    }


    // =====================
    // SPAWN POWERUPS
    // =====================

    if (
        Math.random() <
        0.003
    ) {

        createPowerup();
    }


    animationId =
        requestAnimationFrame(
            gameLoop
        );
}


// =========================
// START GAME
// =========================

function startGame() {

    obstacles.forEach(
        o =>
            o.element.remove()
    );


    powerups.forEach(
        p =>
            p.element.remove()
    );


    coinObjects.forEach(
        c =>
            c.element.remove()
    );


    obstacles = [];

    powerups = [];

    coinObjects = [];


    score = 0;

    level = 1;


    maxLives =
        extraLife
            ? 4
            : 3;


    lives =
        maxLives;


    playerX = 179;


    invincible = false;

    shieldActive = false;

    paused = false;


    player.classList.remove(
        "invincible"
    );


    player.classList.remove(
        "shield"
    );


    player.style.left =
        playerX + "px";


    scoreElement.textContent =
        "Score: 0";


    levelElement.textContent =
        "Level: 1";


    updateLivesDisplay();


    gameRunning = true;


    startScreen.style.display =
        "none";


    gameOverScreen.style.display =
        "none";


    pauseScreen.style.display =
        "none";


    createObstacle();


    gameLoop();
}


// =========================
// GAME OVER
// =========================

function gameOver() {

    gameRunning = false;

    paused = false;


    cancelAnimationFrame(
        animationId
    );


    const earned =
        Math.floor(
            score / 5
        );


    coins += earned;


    localStorage.setItem(
        "coins",
        coins
    );


    if (
        score > bestScore
    ) {

        bestScore =
            score;


        localStorage.setItem(
            "bestScore",
            bestScore
        );


        bestScoreElement.textContent =
            "Best: " + bestScore;
    }


    finalScore.textContent =
        "Score: " + score;


    finalLevel.textContent =
        "Level: " + level;


    earnedCoins.textContent =
        "🪙 +" + earned;


    coinsElement.textContent =
        "🪙 " + coins;
if (finalBestScore) {
    finalBestScore.textContent =
        "Best Score: " + bestScore;
}
    gameOverScreen.style.display =
        "flex";


    playSound(
        80,
        0.5,
        "sawtooth"
    );
}


// =========================
// PAUSE
// =========================

pauseButton.addEventListener(
    "click",
    () => {

        if (
            !gameRunning
        )
            return;


        paused = true;


        game.classList.add(
            "paused"
        );


        pauseScreen.style.display =
            "flex";
    }
);


resumeButton.addEventListener(
    "click",
    () => {

        paused = false;


        game.classList.remove(
            "paused"
        );


        pauseScreen.style.display =
            "none";


        gameLoop();
    }
);


// =========================
// START BUTTON
// =========================

startButton.addEventListener(
    "click",
    () => {

        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();
        }


        startGame();
    }
);


// =========================
// RESTART
// =========================

restartButton.addEventListener(
    "click",
    () => {

        startGame();
    }
);


// =========================
// SHOP
// =========================

shopButton.addEventListener("click", () => {

    if (!gameRunning) {
        return;
    }

    paused = true;

    shopScreen.style.display = "flex";

});


closeShop.addEventListener(
    "click",
    () => {

        paused = false;

        game.classList.remove(
            "paused"
        );

        shopScreen.style.display =
            "none";

        gameLoop();
    }
);

// =========================
// EXTRA LIFE
// =========================

lifeUpgrade.addEventListener(
    "click",
    () => {

        if (
            extraLife
        ) {

            alert(
                "You already own this upgrade!"
            );


            return;
        }


        if (
            coins < 25
        ) {

            alert(
                "Not enough coins!"
            );


            return;
        }


        coins -= 25;


        extraLife = true;


        localStorage.setItem(
            "coins",
            coins
        );


        localStorage.setItem(
            "extraLife",
            "true"
        );


        coinsElement.textContent =
            "🪙 " + coins;


        shopCoins.textContent =
            coins;


        lifeUpgrade.textContent =
            "OWNED ✓";
    }
);


// =========================
// SPEED UPGRADE
// =========================

speedUpgrade.addEventListener(
    "click",
    () => {

        if (
            speedUpgradeBought
        ) {

            alert(
                "You already own this upgrade!"
            );


            return;
        }


        if (
            coins < 30
        ) {

            alert(
                "Not enough coins!"
            );


            return;
        }


        coins -= 30;


        speedUpgradeBought =
            true;


        localStorage.setItem(
            "coins",
            coins
        );


        localStorage.setItem(
            "speedUpgrade",
            "true"
        );


        coinsElement.textContent =
            "🪙 " + coins;


        shopCoins.textContent =
            coins;


        speedUpgrade.textContent =
            "OWNED ✓";
    }
);


// =========================
// LOAD SHOP STATE
// =========================

if (
    extraLife
) {

    lifeUpgrade.textContent =
        "OWNED ✓";
}


if (
    speedUpgradeBought
) {

    speedUpgrade.textContent =
        "OWNED ✓";
}