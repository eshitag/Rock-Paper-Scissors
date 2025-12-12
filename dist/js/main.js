import GameObj from "./Game.js";
const Game = new GameObj(); //Use this "Game" to call methods in Game class

const initApp = () => {
  initAllTimeData(); //hoisting //all time data
  updateScoreBoard(); //update scoreboard
  listenForPlayerChoice(); //listen for a player choice
  listenForEnterKey(); //listen enter key
  listenForPlayAgain(); //listen for the play again
  lockComputerGameBoardHeight(); //lock in the gameboard height
  document.querySelector("h1").focus(); //set the focus to start new game
};

document.addEventListener("DOMContentLoaded", initApp); //fires off initApp function as soon as web page loads

const initAllTimeData = () => {
  Game.setp1AllTime(parseInt(localStorage.getItem("p1AllTime")) || 0);
  Game.setcpAllTime(parseInt(localStorage.getItem("cpAllTime")) || 0);
};

const updateScoreBoard = () => {
  const p1Ats = document.getElementById("p1_all_time_score");
  p1Ats.textContent = Game.getP1AllTime();
  p1Ats.ariaLabel = `Player one has ${Game.getP1AllTime()} all time wins`;

  const cpAts = document.getElementById("cp_all_time_score");
  cpAts.textContent = Game.getcpAllTime();
  cpAts.ariaLabel = `Computer Player has ${Game.getcpAllTime()} all time wins`;

  const p1s = document.getElementById("p1_session_score");
  p1s.textContent = Game.getP1session();
  p1s.ariaLabel = `Player one has ${Game.getP1session()} wins this session`;

  const cps = document.getElementById("cp_session_score");
  cps.textContent = Game.getCpsession();
  cps.ariaLabel = `Computer Player has ${Game.getCpsession()} wins this session`;
};

const listenForPlayerChoice = () => {
  const p1Images = document.querySelectorAll(
    ".playerboard .gameboard__square img"
  );
  p1Images.forEach((img) => {
    img.addEventListener("click", (myEvent) => {
      if (Game.getActiveStatus()) return;
      Game.startGame();

      const playerChoice = myEvent.target.parentElement.id;
      updateP1Message(playerChoice); //helper function
      p1Images.forEach((img) => {
        if (img === myEvent.target) {
          img.parentElement.classList.add("selected");
        } else {
          img.parentElement.classList.add("not-selected");
        }
      });
      computerAnimationSequence(playerChoice); //animation
    });
  });
};

const listenForEnterKey = () => {
  window.addEventListener("keydown", (myEvent) => {
    if (myEvent.code === "Enter" && myEvent.target.tagName === "IMG") {
      myEvent.target.click();
    }
  });
};

const listenForPlayAgain = () => {
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    resetBoard();
  });
};

const lockComputerGameBoardHeight = () => {
  const cpGameBoard = document.querySelector(".computerboard .gameboard");
  const cpGBStyles = getComputedStyle(cpGameBoard);
  const height = cpGBStyles.getPropertyValue("height");
  cpGameBoard.style.minHeight = height;
};

const updateP1Message = (choice) => {
  let p1msg = document.getElementById("p1msg").textContent;
  p1msg += `${properCase(choice)}`;
  document.getElementById("p1msg").textContent = p1msg;
};

const computerAnimationSequence = (playerchoice) => {
  let interval = 1000;
  setTimeout(() => computerChoiceAnimation("cp_rock", 1), interval);
  setTimeout(() => computerChoiceAnimation("cp_paper", 2), (interval += 500));
  setTimeout(
    () => computerChoiceAnimation("cp_scissors", 3),
    (interval += 500)
  );
  setTimeout(() => countdownFade(), (interval += 750));
  setTimeout(() => {
    deleteCountdown();
    finishGameflow(playerchoice); //procedural function
  }, (interval += 1000));
  setTimeout(() => askUserToPlayAgain(), (interval += 1000));
};

const computerChoiceAnimation = (elementId, number) => {
  const element = document.getElementById(elementId);
  element.firstElementChild.remove();
  const p = document.createElement("p");
  p.textContent = number;
  element.appendChild(p);
};

const countdownFade = () => {
  const countdown = document.querySelectorAll(
    ".computerboard .gameboard__square p"
  );
  countdown.forEach((el) => {
    el.className = "fadeOut";
  });
};

const deleteCountdown = () => {
  const countdown = document.querySelectorAll(
    ".computerboard .gameboard__square p"
  );
  countdown.forEach((el) => {
    el.remove();
  });
};

const finishGameflow = (playerChoice) => {
  const computerChoice = getComputerChoice();
  const winner = determineWinner(playerChoice, computerChoice);
  const actionMessage = buildActionMessage(
    winner,
    playerChoice,
    computerChoice
  );
  displayActionMessage(actionMessage);
  updateAriaResult(actionMessage, winner); //update aria with result
  updateScoreState(winner); //update score state
  updatePersistentData(winner); //update persistent data
  updateScoreBoard(); //update score board
  updateWinnerMessage(winner); //update the winner message
  displayComputerChoice(computerChoice); //display computer choice
};

const getComputerChoice = () => {
  const randomNumber = Math.floor(Math.random() * 3);
  const rpsArray = ["rock", "paper", "scissors"];
  return rpsArray[randomNumber];
};

const determineWinner = (player, computer) => {
  if (player === computer) return "tie";
  if (
    (player === "rock" && computer === "paper") ||
    (player === "paper" && computer === "scissors") ||
    (player === "scissors" && computer === "rock")
  )
    return "computer";
  return player;
};

const buildActionMessage = (winner, playerChoice, computerChoice) => {
  if (winner === "tie") return "Tie game!";
  if (winner === "computer") {
    const action = getAction(computerChoice);
    return `${properCase(computerChoice)} ${action} ${properCase(
      playerChoice
    )}`;
  } else {
    const action = getAction(playerChoice);
    return `${properCase(playerChoice)} ${action} ${properCase(
      computerChoice
    )}`;
  }
};

const getAction = (choice) => {
  return choice === "rock" ? "smashes" : choice === "paper" ? "wraps" : "cuts";
};

const properCase = (string) => {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
};

const displayActionMessage = (actionMessage) => {
  const cpmsg = document.getElementById("cpmsg");
  cpmsg.textContent = actionMessage;
};

const updateAriaResult = (result, winner) => {
  const ariaResult = document.getElementById("playAgain");
  const winMessage =
    winner === "player"
      ? "congratulations, you are the winner."
      : winner === "computer"
      ? "The Computer wins."
      : "";

  ariaResult.ariaLabel = `${result} ${winMessage} Click or press Enter to play again`;
};

const updateScoreState = (winner) => {
  if (winner === "tie") return;
  winner === "computer" ? Game.cpWins() : Game.p1Wins();
};

const updatePersistentData = (winner) => {
  const store = winner === "computer" ? "cpAllTime" : "p1AllTime";
  const score =
    winner === "compuetr" ? Game.getcpAllTime() : Game.getP1AllTime();
  localStorage.setItem(store, score);
};

const updateWinnerMessage = (winner) => {
  if (winner === "tie") return;
  const message =
    winner === "computer" ? "🤖 Computer Wins! 🤖" : "🏆🔥You Win🔥🏆";

  const p1msg = document.getElementById("p1msg");
  p1msg.textContent = message;
};

const displayComputerChoice = (choice) => {
  const square = document.getElementById("cp_paper");
  createGameImage(choice, square);
};

const askUserToPlayAgain = () => {
  const playAgain = document.getElementById("playAgain");
  playAgain.classList.toggle("hidden");
  playAgain.focus();
};

const resetBoard = () => {
  const gameSqaures = document.querySelectorAll(".gameboard div");
  gameSqaures.forEach((square) => {
    square.className = "gameboard__square";
  });
  const cpSquare = document.querySelectorAll(
    ".computerboard .gameboard__square"
  );
  cpSquare.forEach((square) => {
    if (square.firstElementChild) square.firstElementChild.remove();
    if (square.id === "cp_rock") createGameImage("rock", square);
    if (square.id === "cp_paper") createGameImage("paper", square);
    if (square.id === "cp_scissors") createGameImage("scissors", square);
  });
  document.getElementById("p1msg").textContent = "Player One Chooses...";
  document.getElementById("cpmsg").textContent = "Computer Chooses...";
  const ariaResult = document.getElementById("playAgain");
  ariaResult.ariaLabel = "Player One Chooses";
  document.getElementById("playAgain").classList.toggle("hidden");
  Game.endGame();
};

const createGameImage = (icon, appendToElement) => {
  const image = document.createElement("img");
  image.src = `img/${icon}.png`;
  image.alt = icon;
  appendToElement.appendChild(image);
};
