const questions = [
    {
        question: "What's Prasenjit's favourite season? 🍂",
        options: ["Summer ☀️", "Winter ❄️", "Rainy 🌧️", "Spring 🌸"],
        answer: 1,
        image: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=900"
    },
    {
        question: "What does Prasenjit prefer? ☕",
        options: ["Tea 🍵", "Coffee ☕", "Cold coffee 🧋", "Neither"],
        answer: 0,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900"
    },
    {
        question: "What's Prasenjit's favourite colour? 🎨",
        options: ["Black 🖤", "Blue 💙", "White 🤍", "Red ❤️"],
        answer: 0,
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900"
    },
    {
        question: "What's Prasenjit's favourite food? 🍕",
        options: ["Pizza 🍕", "Biryani 🍛", "Momos 🥟", "Burger 🍔"],
        answer: 1,
        image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=900"
    },
    {
        question: "What's Prasenjit's favourite time of day? 🌅",
        options: ["Morning 🌄", "Afternoon ☀️", "Evening 🌆", "Night 🌙"],
        answer: 3,
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900"
    },
    {
        question: "What does Prasenjit enjoy doing in free time? 🎧",
        options: ["Listening to music 🎵", "Watching movies 🎬", "Playing games 🎮", "Sleeping 😴"],
        answer: 3,
        image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=900"
    },
    {
        question: "What's Prasenjit's dream destination? ✈️",
        options: ["Mountains 🏔️", "Beach 🏖️", "Foreign countries 🌍", "Peaceful countryside 🌳"],
        answer: 2,
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900"
    },
    {
        question: "Which type of music does Prasenjit prefer? 🎶",
        options: ["Romantic ❤️", "Sad songs 💔", "Energetic songs 🔥", "Lo-fi 🎧"],
        answer: 2,
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900"
    },
    {
        question: "What's Prasenjit's personality like? 😎",
        options: ["Introvert 🤫", "Extrovert 🗣️", "Ambivert 😊", "Depends on mood 😜"],
        answer: 2,
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900"
    },
    {
        question: "What matters most to Prasenjit? 💖",
        options: ["Family 👨‍👩‍👦", "Friends 🫂", "Friends and Family ❤️", "Personal goals 🎯"],
        answer: 2,
        image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=900"
    }
];

let currentQuestion = 0;
let activeParticipant = null;
const selectedAnswers = new Array(questions.length).fill(null);
const locked = new Array(questions.length).fill(false);

const welcomeScreen = document.getElementById("welcome");
const quizScreen = document.getElementById("quiz");
const resultScreen = document.getElementById("result");
const optionsContainer = document.getElementById("options");
const nextButton = document.getElementById("nextBtn");
const backButton = document.getElementById("backBtn");
const answerReview = document.getElementById("answerReview");
const leaderboardStorageKey = "prasenjitQuizLeaderboard";

window.addEventListener("pointermove", (event) => {
    document.body.style.setProperty("--pointer-x", `${event.clientX}px`);
    document.body.style.setProperty("--pointer-y", `${event.clientY}px`);
});

function startQuiz() {
    welcomeScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    showQuestion();
}

function showQuestion() {
    const question = questions[currentQuestion];
    const questionNumber = currentQuestion + 1;
    const percent = Math.round((questionNumber / questions.length) * 100);

    document.getElementById("questionNumber").textContent =
        `Question ${questionNumber}/${questions.length}`;
    document.getElementById("progressPercent").textContent = `${percent}%`;
    document.getElementById("progressBar").style.width = `${percent}%`;
    document.querySelector(".progress").setAttribute("aria-valuenow", percent);
    document.getElementById("questionText").textContent = question.question;
    document.getElementById("questionPhoto").src = question.image;
    document.getElementById("feedback").textContent = "";
    optionsContainer.replaceChildren();

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option";
        button.textContent = option;

        if (selectedAnswers[currentQuestion] === index) {
            button.classList.add("selected");
        }

        if (locked[currentQuestion]) {
            button.disabled = true;
            if (index === question.answer) button.classList.add("correct");
            if (index === selectedAnswers[currentQuestion] && index !== question.answer) {
                button.classList.add("wrong");
            }
        } else {
            button.addEventListener("click", () => selectAnswer(index));
        }

        optionsContainer.appendChild(button);
    });

    if (locked[currentQuestion]) {
        const isCorrect = selectedAnswers[currentQuestion] === question.answer;
        document.getElementById("feedback").textContent = isCorrect
            ? "🎉 Correct! You know Prasenjit well!"
            : `😅 Oops! The correct answer is ${question.options[question.answer]}`;
    }

    backButton.disabled = currentQuestion === 0;
    nextButton.disabled = !locked[currentQuestion];
    nextButton.textContent = currentQuestion === questions.length - 1
        ? "See Result 🏆"
        : "Next →";
}

function selectAnswer(index) {
    selectedAnswers[currentQuestion] = index;
    locked[currentQuestion] = true;
    showQuestion();
}

function nextQuestion() {
    if (!locked[currentQuestion]) return;

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResult();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function showResult() {
    const score = selectedAnswers.reduce((total, answer, index) =>
        total + (answer === questions[index].answer ? 1 : 0), 0);

    recordLeaderboardEntry(score);
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    document.getElementById("finalScore").textContent = `${score}/${questions.length}`;
    document.getElementById("percentage").textContent =
        `${Math.round((score / questions.length) * 100)}%`;

    let title;
    let message;
    let icon;

    if (score === questions.length) {
        title = "Prasenjit Expert! 🥇";
        message = "Wow! You know almost everything about Prasenjit. You're truly special! ❤️";
        icon = "👑";
    } else if (score >= 8) {
        title = "Super Close! 💜";
        message = "Amazing! You know Prasenjit really well. Just a few things left to discover!";
        icon = "🏆";
    } else if (score >= 6) {
        title = "Good Friend! 😊";
        message = "Not bad! You know quite a lot about Prasenjit. Keep learning more!";
        icon = "🌟";
    } else if (score >= 4) {
        title = "Getting There! 😄";
        message = "You know some things about Prasenjit, but there's still more to discover!";
        icon = "💫";
    } else {
        title = "Do You Even Know Me? 😂";
        message = "Looks like you need to spend more time getting to know Prasenjit!";
        icon = "🤭";
    }

    document.getElementById("resultIcon").textContent = icon;
    document.getElementById("resultTitle").textContent = title;
    document.getElementById("resultMessage").textContent = message;
    renderLeaderboard();
}

function getLeaderboardEntries() {
    try {
        const entries = JSON.parse(localStorage.getItem(leaderboardStorageKey) || "[]");
        return Array.isArray(entries) ? entries : [];
    } catch {
        return [];
    }
}

function renderLeaderboard() {
    const list = document.getElementById("leaderboardList");
    list.replaceChildren();

    const entries = getLeaderboardEntries()
        .sort((a, b) => b.score - a.score || b.createdAt - a.createdAt);

    if (entries.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No scores yet. Be the first to join!";
        list.appendChild(emptyMessage);
        return;
    }

    entries.forEach((entry) => {
        const item = document.createElement("li");
        const name = document.createElement("strong");
        name.textContent = `${entry.name} — ${entry.score}/${questions.length}`;
        item.appendChild(name);
        item.appendChild(document.createElement("br"));
        item.append(`${entry.relationship} · ${entry.phone}`);
        list.appendChild(item);
    });
}

function saveLeaderboardEntry(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    activeParticipant = {
        name: formData.get("name").trim(),
        relationship: formData.get("relationship").trim(),
        phone: formData.get("phone").trim()
    };
    startQuiz();
}

function recordLeaderboardEntry(score) {
    if (!activeParticipant) return;

    const entries = getLeaderboardEntries();
    entries.push({ ...activeParticipant, score, createdAt: Date.now() });

    try {
        localStorage.setItem(leaderboardStorageKey, JSON.stringify(entries));
        document.getElementById("leaderboardResultStatus").textContent =
            "Your score and details have been saved on this device.";
    } catch {
        document.getElementById("leaderboardResultStatus").textContent =
            "Unable to save the score. Browser storage may be unavailable.";
    }
}

function toggleAnswerReview() {
    const isHidden = answerReview.classList.toggle("hidden");
    document.getElementById("reviewBtn").setAttribute("aria-expanded", String(!isHidden));

    if (isHidden) return;

    answerReview.replaceChildren();
    const heading = document.createElement("h3");
    heading.textContent = "Correct Answers ❤️";
    answerReview.appendChild(heading);

    questions.forEach((question, index) => {
        const item = document.createElement("div");
        item.className = "answer-item";

        const prompt = document.createElement("b");
        prompt.textContent = `Q${index + 1}. ${question.question}`;
        item.appendChild(prompt);
        item.appendChild(document.createElement("br"));
        item.append("Correct answer: ");
        const correct = document.createElement("b");
        correct.textContent = question.options[question.answer];
        item.appendChild(correct);
        item.appendChild(document.createElement("br"));
        item.append("Your answer: ");
        item.append(selectedAnswers[index] === null
            ? "Not answered"
            : question.options[selectedAnswers[index]]);
        item.appendChild(document.createElement("br"));
        item.append(selectedAnswers[index] === question.answer ? "✅ Correct" : "❌ Incorrect");
        answerReview.appendChild(item);
    });
}

function restartQuiz() {
    currentQuestion = 0;
    activeParticipant = null;
    selectedAnswers.fill(null);
    locked.fill(false);
    answerReview.classList.add("hidden");
    document.getElementById("reviewBtn").setAttribute("aria-expanded", "false");
    document.getElementById("leaderboardForm").reset();
    document.getElementById("leaderboardStatus").textContent = "";
    resultScreen.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
}

document.getElementById("leaderboardForm").addEventListener("submit", saveLeaderboardEntry);
nextButton.addEventListener("click", nextQuestion);
backButton.addEventListener("click", previousQuestion);
document.getElementById("restartBtn").addEventListener("click", restartQuiz);
document.getElementById("reviewBtn").addEventListener("click", toggleAnswerReview);
