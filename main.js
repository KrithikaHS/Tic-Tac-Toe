// player Score card Images
function showBot() {
    document.querySelector('.bot').style.opacity = 1;
}
function showP() {
    document.querySelector('.ply').style.opacity = 1;
}
// Title 
const spans = document.querySelectorAll('.word span');
    spans.forEach((span, idx) => {
    span.addEventListener('click', (e) => {
    e.target.classList.add('active');
    });
    span.addEventListener('animationend', (e) => {
    e.target.classList.remove('active');
    });
  
    setTimeout(() => {
    span.classList.add('active');
    }, 750 * (idx+1))
});
// Music
var music = document.getElementById("backgroundMusic");
var button = document.getElementById("toggleButton");
button.addEventListener("click", function() {
    if (music.paused) {
        music.play();
        button.style.backgroundImage = "url('ON.png')"; 
    } else {
        music.pause();
        button.style.backgroundImage = "url('OFF.png')"; 
    }
});
// Preloader
function disablePreloader() {
    document.getElementById('loadboth').style.display = 'none';
    document.getElementById('content').style.display = 'grid';
    document.getElementById('content').style.justify = 'center';
}
setTimeout(disablePreloader, 500); 
// Tic tac toe 
var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
let playerX = 0;
let playerO = 0;
let difficulty = "easy";
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
const cells = document.querySelectorAll('.cell');
startGame();
function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
        cells[i].style.removeProperty('color');
        cells[i].style.removeProperty('font-size');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()){
			 turn(bestSpot(), aiPlayer);
			
		
	}
	}
}

function changeDifficulty() {
	difficulty = document.getElementById("difficulty").value;
    playerX = 0;
    playerO = 0;
    startGame();
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.borderRadius =
			gameWon.player == huPlayer ? "50px" : "50px";
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "	#FFF8DC" : "#FFEBCD";
        document.getElementById(index).style.fontSize =
			gameWon.player == huPlayer ? "	120px" : "120px";
        document.getElementById(index).style.color =
			gameWon.player == huPlayer ? "	#DAA520" : "#DAA520";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}
function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;

    if (who === "You win!") {
        playerO++;
        document.getElementById("playerO").innerText = playerO;
    } else if (who === "You lose.") {
        playerX++;
        document.getElementById("playerX").innerText = playerX;
    }
}
function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	if (difficulty === "easy" ) {
		var availableSpots = emptySquares();
        return availableSpots[Math.floor(Math.random() * availableSpots.length)];
	} 
	else if(difficulty === "medium"){
		return minimax(origBoard,aiPlayer, 6).index;
	}
	else if(difficulty === "difficult"){
		return minimax(origBoard, aiPlayer,1).index;
	}
}
function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "	#FFEBCD";
			cells[i].style.borderRadius = "50px";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}
function minimax(newBoard, player, depth) {
    var availSpots = emptySquares();

    if (checkWin(newBoard, huPlayer)) {
        return {score: -10 + depth}; 
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10 - depth}; 
    } else if (availSpots.length === 0) {
        return {score: 0};
    }

    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer) {
            var result = minimax(newBoard, huPlayer, depth + 1); 
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer, depth + 1); 
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if(player === aiPlayer) {
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

