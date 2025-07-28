const nameInput = document.querySelector("#name");
const categorySelect = document.querySelector("#category");
const difficultySelect = document.querySelector("#difficulty");
const startButton = document.querySelector("#startButton");
const questionScreen = document.querySelector("#questionScreen");
const categoryDisplay = document.querySelector("#categoryDisplay");
const scoreDisplay = document.querySelector("#scoreDisplay");
const welcomeMsg = document.querySelector("#welcomeMsg");
const questionNum = document.querySelector("#questionNum");
const questionText = document.querySelector("#questionText");
const optionsGrid = document.querySelector("#options");
const quitButton = document.querySelector(".btn.quit");
const nextButton = document.querySelector(".btn.next");
const titleHeading = document.querySelector(".title");
const footerName = document.querySelector(".name h3");
const quizSection = document.querySelector("#quizSection")
const homeBtn = document.querySelector("#homeBtn")

let currentIndex = 0
let score = 0

async function fetchQuestions(category, difficulty) {
  const categoryMap = {
  general: 9,
  science: 17,
  math: 19,
  computers: 18,
  history: 23,
  sports: 21,
  geography: 22,
  books: 10,
  film: 11,
  music: 12,
  art: 25,
  celebrities: 26,
  animals: 27,
  vehicles: 28,
  politics: 24,
  mythology: 20,
  anime: 31,
  gadgets: 30,
  comics: 29,
  boardgames: 16
};

  const categoryId = categoryMap[category];
  const apiURL = `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=multiple`;

  try {
    const res = await fetch(apiURL);
    const data = await res.json();

    return data.results.map(q => {
      const allOptions = [...q.incorrect_answers];
      const randomIndex = Math.floor(Math.random() * (allOptions.length + 1));
      allOptions.splice(randomIndex, 0, q.correct_answer);

      return {
        question: decodeHTML(q.question),
        options: allOptions.map(decodeHTML),
        answer: decodeHTML(q.correct_answer),
        category: q.category
      };
    });
  } catch (err) {
    console.error("Error fetching quiz questions", err);
    return [];
  }
  
}

startButton.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const category = categorySelect.value;
  const difficulty = difficultySelect.value;

  if (!name || !category || !difficulty) {
    alert("Please fill all fields before starting the quiz.");
    return;
  }

  // 👇 Fetch from API
  filteredQuestions = await fetchQuestions(category, difficulty);

  if (filteredQuestions.length === 0) {
    alert("No questions available. Please try another combination.");
    return;
  }

  currentIndex = 0;
  score = 0;

  quizSection.classList.add("hidden");
  quizSection.style.display = "none";
  questionScreen.classList.remove("hidden");
  questionScreen.style.display = "block";
  nextButton.classList.remove("hidden");
  quitButton.classList.remove("hidden");

  welcomeMsg.textContent = `Welcome ${name}`;
  questionNum.textContent = `Question ${currentIndex + 1} of ${filteredQuestions.length}`;

  showQuestion();
});

  nextButton.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex < filteredQuestions.length) {
      questionNum.textContent = `Question ${currentIndex + 1} of ${filteredQuestions.length}`;
      showQuestion();
    } else {
      questionText.textContent = "Quiz Completed!";
      optionsGrid.innerHTML = "";
      questionNum.textContent = `Score: ${score} / ${filteredQuestions.length}`;
      nextButton.classList.add("hidden")
      quitButton.classList.add("hidden")
      homeBtn.classList.remove("hidden")
    }
  });

  quitButton.addEventListener("click" , ()=>{
       questionText.textContent = "You Quit the Quiz";
      optionsGrid.innerHTML = "";
       questionNum.textContent = `Score: ${score} / ${filteredQuestions.length}`;
       nextButton.classList.add("hidden")
       quitButton.classList.add("hidden")
       homeBtn.classList.remove("hidden")
  })

homeBtn.addEventListener("click", () => {
  // Show quiz section and hide others
  quizSection.classList.remove("hidden");
  quizSection.style.display = "flex";
  questionScreen.classList.add("hidden");
  questionScreen.style.display = "none";

  // 🧹 Remove this if not defined elsewhere
  // resultContainer.classList.add("hidden");
  // resultContainer.style.display = "none";

  nextButton.classList.remove("hidden");
  quitButton.classList.remove("hidden");

  // Reset form values
  nameInput.value = "";
  categorySelect.selectedIndex = 0;
  difficultySelect.selectedIndex = 0;

  // Clear UI text
  questionText.textContent = "";
  optionsGrid.innerHTML = "";
  questionNum.textContent = "";
  
  // ✅ Correct score reset display
  score = 0;
  scoreDisplay.textContent = `Score: 0`;

  // Reset data
  currentIndex = 0;
  filteredQuestions = [];
});


function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}


  function showQuestion() {
    const currentQuestion = filteredQuestions[currentIndex];
    homeBtn.classList.add("hidden")
    if (!currentQuestion) {
      console.log("No more questions.");
      return;
    }

    questionText.textContent = currentQuestion.question;
   categoryDisplay.textContent = currentQuestion.category || "No Category";
    optionsGrid.innerHTML = "";

    currentQuestion.options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.classList.add("option-btn");
      optionsGrid.appendChild(btn);

      btn.addEventListener("click", () => {
        const allOptions = document.querySelectorAll(".option-btn");
        allOptions.forEach(button => {
          button.disabled = true;

          if (button.textContent === currentQuestion.answer) {
            button.style.backgroundColor = "green";
          } else if (button === btn && btn.textContent !== currentQuestion.answer) {
            button.style.backgroundColor = "red";
          }
        });

        if (btn.textContent === currentQuestion.answer) {
          score++;
          scoreDisplay.textContent= `Score: ${score} / ${filteredQuestions.length}`

        }
      });
    });
  }


  