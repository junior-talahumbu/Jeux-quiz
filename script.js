let allQuestions = [];
let questions = [];
let index = 0;
let score = 0;
let timer;
let timeLeft = 10;

const soundCorrect = new Audio("sounds/correct.mp3");
const soundWrong = new Audio("sounds/wrong.mp3");
const soundFinish = new Audio("sounds/finish.mp3");

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    allQuestions = data;
    startQuiz();
  });

function startQuiz() {
  questions = shuffle([...allQuestions]).slice(0, 10);
  index = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  resetTimer();
  const q = questions[index];
  document.getElementById("question").textContent = q.question;
  document.getElementById("score").textContent = `Score : ${score}`;

  const choices = shuffle(q.choices.map((c, i) => ({ c, i })));
  const div = document.getElementById("choices");
  div.innerHTML = "";

  choices.forEach(item => {
    const btn = document.createElement("button");
    btn.textContent = item.c;
    btn.onclick = () => answer(btn, item.i);
    div.appendChild(btn);
  });

  startTimer();
  updateProgress();
}

function answer(btn, i) {
  clearInterval(timer);

  const correctIndex = questions[index].answer;
  const buttons = document.querySelectorAll("#choices button");

  // Désactiver tous les boutons
  buttons.forEach(b => b.disabled = true);

  // Créer ou réinitialiser le mini message
  let msg = document.getElementById("msg");
  if (!msg) {
    msg = document.createElement("p");
    msg.id = "msg";
    msg.style.textAlign = "center";
    msg.style.fontSize = "18px";
    msg.style.marginTop = "10px";
    document.querySelector(".quiz-container").appendChild(msg);
  }

  if (i === correctIndex) {
    btn.classList.add("correct");
    soundCorrect.play();
    score++;
    msg.textContent = "✅ Bonne réponse !";
    msg.style.color = "#22c55e";
  } else {
    btn.classList.add("wrong");
    soundWrong.play();
    msg.textContent = "❌ Mauvaise réponse !";
    msg.style.color = "#ef4444";

    // Mettre en évidence la bonne réponse
    buttons.forEach(b => {
      if (b.textContent === questions[index].choices[correctIndex]) {
        b.classList.add("correct");
        // Ajouter clignotement
        b.style.animation = "blink 0.8s linear 2";
      }
    });
  }

  // Passage rapide à la question suivante
  setTimeout(() => {
    msg.remove(); 
    next();
  }, 900);
}


function next() {
  index++;
  index < questions.length ? showQuestion() : endQuiz();
}

function startTimer() {
  timeLeft = 10;
  document.getElementById("timer").textContent = `⏱️ ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `⏱️ ${timeLeft}`;
    if (timeLeft === 0) next();
  }, 1000);
}

function resetTimer() { clearInterval(timer); }

function updateProgress() {
  document.getElementById("progress-bar").style.width =
    (index / questions.length) * 100 + "%";
}

function endQuiz() {
  soundFinish.play();

  let mention, badgeClass, badgeEmoji;

  if(score >= 8) {
    mention = "Excellent";
    badgeClass = "excellent";
    badgeEmoji = "🏆";
  } else if(score >= 6) {
    mention = "Très bien";
    badgeClass = "tresbien";
    badgeEmoji = "🥇";
  } else if(score >= 5) {
    mention = "Bien";
    badgeClass = "bien";
    badgeEmoji = "👍";
  } else {
    mention = "À améliorer votre capacité";
    badgeClass = "ameliorer";
    badgeEmoji = "😅";
  }

  document.querySelector(".quiz-container").innerHTML = `
    <div class="end-quiz">
      <span class="badge ${badgeClass}">${badgeEmoji}</span>
      <h2>Quiz terminé 🎉</h2>
      <p>Score : ${score}/10</p>
      <h3>${mention}</h3>
      <button onclick="location.reload()">Rejouer 🔄</button>
    </div>
  `;
}


function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
