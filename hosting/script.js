document.addEventListener("DOMContentLoaded", () => {
  var quizData = fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      quizData = data;
      console.log(quizData);
      initSection();
    })
    .catch((err) => console.log("Error loadin data", err));
  var currSec;
  var score;
  const maxScoreArr = [
    { sub: "Science", score: 0 },
    { sub: "Math", score: 0 },
    { sub: "General Knowledge", score: 0 },
    { sub: "Indian History", score: 0 },
  ];
  function initSection() {
    const sec = document.querySelectorAll(".section");
    console.log(sec);
    sec.forEach((s) => {
      s.addEventListener("click", (e) => {
        currSec = e.currentTarget.getAttribute("data-section");
        console.log(currSec);
        quiz(currSec);
      });
    });
  }
  function quiz(n) {
    let questionSec = quizData.sections[n];
    console.log(questionSec);
    let currQuesInx = 0;
    score = 0;
    let ansSel = false;
    let next = document.getElementById("next-button");
    let back = document.getElementById("back-button");
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("question-container").style.display = "block";
    const shuffledQuestions = questionSec.questions.sort(
      () => Math.random() - 0.5
    );
    const ansInxs = [];
    const selectedQuestions = shuffledQuestions.slice(0, 10);

    showQuestions();

    function showQuestions() {
      const questionEle = document.getElementById("question");
      const optEle = document.getElementById("options");
      const currQuestion = selectedQuestions[currQuesInx];

      questionEle.innerHTML =
        ansInxs && ansInxs.includes(currQuesInx)
          ? `${currQuestion.question}<small id="small1">(Answered)</small>`
          : `${currQuestion.question}<small id="small">(Not Answered)</small>`;
      optEle.innerHTML = "";

      if (currQuestion.type === "MCQ") {
        currQuestion.options.map((o) => {
          let newOpt = document.createElement("div");
          newOpt.textContent = o;
          newOpt.addEventListener("click", () => {
            if (!ansSel) {
              ansSel = true;
              newOpt.classList.add("selected");
              if (!ansInxs.includes(currQuesInx)) {
                checkAnswer(o, currQuestion.correct_option, currQuestion);
                ansInxs.push(currQuesInx);
                console.log(ansInxs);
              }
            }
          });
          optEle.appendChild(newOpt);
        });
      } else {
        const inputEle = document.createElement("input");
        inputEle.type = currQuestion.type === "Number" ? "number" : "text";

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit Answer";
        submitBtn.className = "submit-answer";
        submitBtn.addEventListener("click", () => {
          if (!ansSel && inputEle.value !== "") {
            ansSel = true;
            if (!ansInxs.includes(currQuesInx)) {
              checkAnswer(
                inputEle.value.toString(),
                currQuestion.correct_answer.toString(),
                currQuestion
              );
              ansInxs.push(currQuesInx);
              console.log(ansInxs);
            }
          }
        });
        optEle.appendChild(inputEle);
        optEle.appendChild(submitBtn);
      }
    }

    function checkAnswer(option, correctAns, currQuestion) {
      const feedbackEle = document.createElement("div");
      feedbackEle.id = "feedback";
      if (
        option === correctAns ||
        option.toLowerCase() === correctAns.toLowerCase()
      ) {
        score++;
        feedbackEle.textContent = "Correct!";
        feedbackEle.style.color = "green";
        const questionEle = document.getElementById("question");
        questionEle.innerHTML = `${currQuestion.question}<small id="small1">(Answered)</small>`;
      } else {
        feedbackEle.textContent = `Wrong. Correct answer : ${correctAns}`;
        feedbackEle.style.color = "red";
        const questionEle = document.getElementById("question");
        questionEle.innerHTML = `${currQuestion.question}<small id="small1">(Answered)</small>`;
      }
      const optEles = document.getElementById("options");
      optEles.appendChild(feedbackEle);
      updateScore();
    }
    function updateScore() {
      document.getElementById("score").textContent = `Score: ${score} `;
    }
    function endQuiz() {
      const questionContainer = document.getElementById("question-container");
      questionContainer.innerHTML = `<h1>Quiz Completed</h1>
        <p>Your Final Score : ${score}/10</p><button id="home-button">Go to Home</button>`;
      document.getElementById("home-button").addEventListener("click", () => {
        const quizContainer = document.getElementById("quiz-container");
        quizContainer.style.display = "grid";
        questionContainer.style.display = "none";
        questionContainer.innerHTML = `<p id="score">Score : 0</p>
        <p id="max-score">Max Score : ${maxScoreArr[currSec].score}</p>
        <div id="question"></div>
        <div id="options"></div>
        <button id="back-button" style="display: none">Back</button>
        <button id="next-button">Next</button>`;
      });
    }
    next.addEventListener("click", () => {
      if (
        currQuesInx >= questionSec.questions.length / 2 - 1 &&
        currQuesInx >= 0
      ) {
        console.log("quizovr");
        console.log(currSec);
        if (maxScoreArr[currSec].score < score) {
          maxScoreArr[currSec].score = score;
        }
        endQuiz();
      } else {
        ansSel = false;
        currQuesInx++;
        back.style.display = "inline-block";
        showQuestions();
      }
    });
    back.addEventListener("click", () => {
      if (currQuesInx === 1 || 0) {
        back.style.display = "none";
      }
      currQuesInx--;
      showQuestions();
    });
  }
});
