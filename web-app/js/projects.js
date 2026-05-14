// Project Registry
// Each project's HTML and logic lives in its own file under js/projects/

function getProjectHTML(projectName) {
    const projects = {
        'rock-paper-scissor': getRockPaperScissorHTML(),
        'dice-rolling': getDiceRollingHTML(),
        'coin-flip': getCoinFlipHTML(),
        'number-guessing': getNumberGuessingHTML(),
        'hangman': getHangmanHTML(),
        'flames': getFlamesHTML(),
        'fibonacci': getFibonacciHTML(),
        'progression-recognizer': getProgressionRecognizerHTML(),
        'pascal-triangle': getPascalTriangleHTML(),
        'armstrong': getArmstrongHTML(),
        'calculator': getCalculatorHTML(),
        'collatz': getCollatzHTML(),
        'prime-analyzer': getPrimeAnalyzerHTML(),
        'projectile-motion': getProjectileMotionHTML(),
        'coordinate-polar-transform': getCoordinatePolarTransformHTML(),
        'derivative-calculator': getDerivativeCalculatorHTML(),
        'morse-code': getMorseCodeHTML(),
        'tower-of-hanoi': getTowerOfHanoiHTML(),
        'snake-game': getsnakeGameHTML(),
        'password-forge': getPasswordForgeHTML(),
    };

    return projects[projectName] || '<h2>Project Coming Soon!</h2>';
}

function initializeProject(projectName) {
    const initializers = {
        'rock-paper-scissor': initRockPaperScissor,
        'dice-rolling': initDiceRolling,
        'coin-flip': initCoinFlip,
        'number-guessing': initNumberGuessing,
        'hangman': initHangman,
        'flames': initFlames,
        'fibonacci': initFibonacci,
        'progression-recognizer': initProgressionRecognizer,
        'pascal-triangle': initPascalTriangle,
        'armstrong': initArmstrong,
        'calculator': initCalculator,
        'collatz': initCollatz,
        'prime-analyzer': initPrimeAnalyzer,
        'projectile-motion': initProjectileMotion,
        'coordinate-polar-transform': initCoordinatePolarTransform,
        'derivative-calculator': initDerivativeCalculator,
        'morse-code': initMorseCode,
        'tower-of-hanoi': initTowerOfHanoi,
        'snake-game': initSnakeGame,
    };

    if (initializers[projectName]) {
        initializers[projectName]();
    }
}
