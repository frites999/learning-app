const TOTAL_QUESTIONS = 10;

const menu = document.getElementById("menu");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const messageEl = document.getElementById("message");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const resultScoreEl = document.getElementById("result-score");
const resultTextEl = document.getElementById("result-text");

const backButton = document.getElementById("back-button");
const againButton = document.getElementById("again-button");
const menuButton = document.getElementById("menu-button");

let currentMode = null;
let currentQuestion = null;
let questionNumber = 0;
let score = 0;
let locked = false;

document.querySelectorAll(".menu-button").forEach((button) => {
  button.addEventListener("click", () => {
    startQuiz(button.dataset.mode);
  });
});

backButton.addEventListener("click", showMenu);

againButton.addEventListener("click", () => {
  startQuiz(currentMode);
});

menuButton.addEventListener("click", showMenu);

function startQuiz(mode) {
  currentMode = mode;
  questionNumber = 0;
  score = 0;
  locked = false;

  menu.classList.add("hidden");
  result.classList.add("hidden");
  quiz.classList.remove("hidden");

  showNextQuestion();
}

function showNextQuestion() {
  if (questionNumber >= TOTAL_QUESTIONS) {
    showResult();
    return;
  }

  questionNumber++;
  locked = false;
  messageEl.textContent = "";
  progressEl.textContent = `${questionNumber} / ${TOTAL_QUESTIONS}`;
  scoreEl.textContent = `⭐ ${score}`;

  currentQuestion = makeQuestion(currentMode);

  questionEl.textContent =
    `${currentQuestion.a} ${currentQuestion.operator} ${currentQuestion.b} ＝ ?`;

  renderAnswers(currentQuestion);
}

function makeQuestion(mode) {
  let a;
  let b;
  let answer;
  let operator;

  if (mode === "add-easy") {
    // 10までのたしざん
    // 使う数字は1以上
    a = randomInt(1, 9);
    b = randomInt(1, 10 - a);
    answer = a + b;
    operator = "＋";

  } else if (mode === "add-hard") {
    // 20までのたしざん
    // 使う数字は1以上
    a = randomInt(1, 19);
    b = randomInt(1, 20 - a);
    answer = a + b;
    operator = "＋";

  } else if (mode === "sub-easy") {
    // 10までのひきざん
    // 使う数字は1以上
    // 答えも0にはしない
    a = randomInt(2, 10);
    b = randomInt(1, a - 1);
    answer = a - b;
    operator = "−";
  }

  return { a, b, answer, operator };
}

function renderAnswers(question) {
  answersEl.innerHTML = "";

  const answers = makeAnswerChoices(question.answer);

  answers.forEach((answer) => {
    const button = document.createElement("button");

    button.className = "answer-button";
    button.textContent = answer;
    button.setAttribute("aria-label", `${answer}`);

    button.addEventListener("click", () => {
      checkAnswer(answer, button);
    });

    answersEl.appendChild(button);
  });
}

function makeAnswerChoices(correct) {
  const choices = new Set([correct]);

  while (choices.size < 4) {
    const offset = randomInt(-3, 3);
    const candidate = correct + offset;

    if (candidate >= 0 && candidate !== correct) {
      choices.add(candidate);
    }
  }

  return shuffle([...choices]);
}

function checkAnswer(selected, button) {
  if (locked) return;

  locked = true;

  const buttons = [...document.querySelectorAll(".answer-button")];

  buttons.forEach((btn) => {
    btn.disabled = true;
  });

  if (selected === currentQuestion.answer) {
    score++;

    button.classList.add("correct");

    messageEl.textContent = "⭕ せいかい！ すごい！";
    scoreEl.textContent = `⭐ ${score}`;

    setTimeout(showNextQuestion, 850);

  } else {
    button.classList.add("wrong");

    messageEl.textContent =
      `❌ おしい！ こたえは ${currentQuestion.answer}`;

    const correctButton = buttons.find(
      (btn) => Number(btn.textContent) === currentQuestion.answer
    );

    if (correctButton) {
      correctButton.classList.add("correct");
    }

    setTimeout(showNextQuestion, 1400);
  }
}

function showResult() {
  quiz.classList.add("hidden");
  result.classList.remove("hidden");

  resultScoreEl.textContent =
    `${score} / ${TOTAL_QUESTIONS}`;

  if (score === TOTAL_QUESTIONS) {
    resultTextEl.textContent =
      "ぜんぶ せいかい！ すごいね！ 🌟";

  } else if (score >= 7) {
    resultTextEl.textContent =
      "よくできました！ もうすこしで まんてん！";

  } else if (score >= 4) {
    resultTextEl.textContent =
      "がんばったね！ もういちど やってみよう！";

  } else {
    resultTextEl.textContent =
      "れんしゅう おつかれさま！ またやってみよう！";
  }
}

function showMenu() {
  quiz.classList.add("hidden");
  result.classList.add("hidden");
  menu.classList.remove("hidden");

  messageEl.textContent = "";
}

function randomInt(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(0, i);

    [array[i], array[j]] = [
      array[j],
      array[i]
    ];
  }

  return array;
}
