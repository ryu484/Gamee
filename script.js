const levels = [
  {
    title: "Boot-Up Bonanza",
    goal: "Learn computers start with power and processing",
    reward: 60,
    question: "Which part of a computer is mainly responsible for doing the thinking and calculations?",
    choices: [
      { text: "CPU", correct: true },
      { text: "Keyboard", correct: false },
      { text: "Monitor", correct: false },
      { text: "Mouse", correct: false }
    ],
    explanation: "The CPU is the brain of the computer. It performs calculations and runs instructions faster than your sleepy brain after morning algebra."
  },
  {
    title: "Memory Mayhem",
    goal: "Understand RAM and storage",
    reward: 70,
    question: "What does RAM do for a computer?",
    choices: [
      { text: "Stores data for quick access while the computer is working", correct: true },
      { text: "Turns the screen on and off", correct: false },
      { text: "Sends emails to aliens", correct: false },
      { text: "Acts like a printer cable", correct: false }
    ],
    explanation: "RAM is like a short-term memory desk. It holds data the computer is actively using so it can grab it quickly."
  },
  {
    title: "Software Shuffle",
    goal: "Tell software from hardware",
    reward: 80,
    question: "Which one is software?",
    choices: [
      { text: "Operating system", correct: true },
      { text: "Motherboard", correct: false },
      { text: "Keyboard", correct: false },
      { text: "Graphics card", correct: false }
    ],
    explanation: "Software is the instructions and programs that tell hardware what to do. Without software, the hardware would just sit there looking dramatic."
  },
  {
    title: "Input vs Output",
    goal: "Understand devices that send and receive data",
    reward: 90,
    question: "Which device is an input device?",
    choices: [
      { text: "Microphone", correct: true },
      { text: "Speaker", correct: false },
      { text: "Monitor", correct: false },
      { text: "Projector", correct: false }
    ],
    explanation: "A microphone sends sound data into the computer, so it is an input device. The speaker is the opposite: it outputs sound."
  },
  {
    title: "Virus Villain",
    goal: "Find out why antivirus matters",
    reward: 100,
    question: "Why do computers need antivirus software?",
    choices: [
      { text: "To protect against malware and harmful programs", correct: true },
      { text: "To make the screen brighter", correct: false },
      { text: "To charge the battery faster", correct: false },
      { text: "To replace the keyboard", correct: false }
    ],
    explanation: "Antivirus software helps detect and remove malware before it turns your computer into a glitchy circus."
  },
  {
    title: "Final Boss: The Bugzilla Byte",
    goal: "Combine knowledge to defeat the bug boss",
    reward: 120,
    question: "Which combination best describes a computer system?",
    choices: [
      { text: "Hardware is the parts; software tells them what to do", correct: true },
      { text: "Hardware is a playlist; software is a USB stick", correct: false },
      { text: "Software is the keyboard; hardware is the mouse", correct: false },
      { text: "They are all the same thing and should be confused", correct: false }
    ],
    explanation: "Great job! Hardware is the physical machine parts, and software is the instructions that make the machine do useful things. You defeated Bugzilla Byte!"
  }
];

const state = {
  levelIndex: 0,
  xp: 0,
  coins: 0,
  currentQuestDone: false,
  started: false
};

const levelLabel = document.getElementById("levelLabel");
const xpLabel = document.getElementById("xpLabel");
const coinLabel = document.getElementById("coinLabel");
const rankLabel = document.getElementById("rankLabel");
const xpBarFill = document.getElementById("xpBarFill");
const xpPercentLabel = document.getElementById("xpPercentLabel");
const missionTitle = document.getElementById("missionTitle");
const levelNumber = document.getElementById("levelNumber");
const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");
const startButton = document.getElementById("startButton");
const feedbackBox = document.getElementById("feedbackBox");
const rewardLabel = document.getElementById("rewardLabel");
const goalLabel = document.getElementById("goalLabel");
const questList = document.getElementById("questList");
const questionCard = document.getElementById("questionCard");

function getLevel() {
  return levels[state.levelIndex];
}

function getRankFromXP() {
  if (state.xp >= 500) return "Hardware Wizard";
  if (state.xp >= 300) return "Tech Hero";
  if (state.xp >= 150) return "Byte Ranger";
  return "Byte Rookie";
}

function renderQuestList() {
  questList.innerHTML = "";

  levels.forEach((lvl, idx) => {
    const item = document.createElement("li");
    item.className = "quest-item";

    if (idx < state.levelIndex) {
      item.classList.add("done");
      item.textContent = "✅ " + lvl.title;
    } else if (idx === state.levelIndex) {
      item.classList.add("active");
      item.textContent = "▶ " + lvl.title;
    } else {
      item.textContent = "🔒 " + lvl.title;
    }

    questList.appendChild(item);
  });
}

function updateHUD() {
  levelLabel.textContent = String(Math.floor(state.xp / 100) + 1);
  xpLabel.textContent = String(state.xp);
  coinLabel.textContent = String(state.coins);
  rankLabel.textContent = getRankFromXP();

  const xpForNextLevel = 100;
  const currentLevelProgress = state.xp % xpForNextLevel;
  const percent = Math.min(100, (currentLevelProgress / xpForNextLevel) * 100);
  xpBarFill.style.width = `${percent}%`;
  xpPercentLabel.textContent = `${Math.round(percent)}%`;
  renderQuestList();
}

function renderQuestion() {
  const level = getLevel();
  if (!level) {
    questionText.textContent = "You beat every challenge! You are now the ultimate Computer Champion!";
    answers.innerHTML = "";
    feedbackBox.classList.remove("hidden");
    feedbackBox.classList.add("correct");
    feedbackBox.textContent = "Victory! Your students have completed the full quest and learned that hardware and software work together to create magical computer adventures.";
    startButton.textContent = "Play Again";
    state.started = false;
    return;
  }

  missionTitle.textContent = level.title;
  levelNumber.textContent = String(state.levelIndex + 1);
  questionText.textContent = level.question;
  rewardLabel.textContent = `${level.reward} XP`;
  goalLabel.textContent = level.goal;
  answers.innerHTML = "";
  feedbackBox.classList.add("hidden");
  feedbackBox.classList.remove("correct", "wrong");

  level.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = choice.text;
    button.addEventListener("click", () => handleAnswer(button, choice.correct, level.explanation));
    answers.appendChild(button);
  });
}

function handleAnswer(button, correct, explanation) {
  const buttons = [...answers.querySelectorAll("button")];
  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === button.textContent && correct) {
      btn.classList.add("correct");
    }
    if (btn.textContent === button.textContent && !correct) {
      btn.classList.add("wrong");
    }
  });

  if (correct) {
    const currentLevel = getLevel();
    state.xp += currentLevel.reward;
    state.coins += 10;
    feedbackBox.classList.remove("hidden");
    feedbackBox.classList.add("correct");
    feedbackBox.textContent = `Correct! ${explanation} +${currentLevel.reward} XP and 10 coins!`;
    state.levelIndex += 1;
    state.currentQuestDone = true;
  } else {
    feedbackBox.classList.remove("hidden");
    feedbackBox.classList.add("wrong");
    feedbackBox.textContent = `Not quite! ${explanation} Try the next mission, young tech explorer.`;
    state.coins = Math.max(0, state.coins - 5);
    state.xp = Math.max(0, state.xp - 10);
  }

  updateHUD();

  setTimeout(() => {
    if (state.levelIndex >= levels.length) {
      renderQuestion();
      startButton.textContent = "Play Again";
      return;
    }
    renderQuestion();
  }, 1500);
}

function startQuest() {
  if (!state.started) {
    state.started = true;
    state.levelIndex = 0;
    state.xp = 0;
    state.coins = 0;
    questionCard.classList.remove("hidden");
    startButton.textContent = "Restart Quest";
  }

  renderQuestion();
  updateHUD();
}

startButton.addEventListener("click", startQuest);

updateHUD();
renderQuestList();
questionCard.classList.add("hidden");
