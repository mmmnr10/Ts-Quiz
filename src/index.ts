import readline from "node:readline";

// Typ för en quizfråga
type Question = {
  text: string;
  answer: string | number;
};

function ask(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => rl.question(prompt + " ", resolve));
}

// Kolla om svaret är rätt
function checkAnswer(question: Question, userAnswer: string): boolean {
  if (typeof question.answer === "string") {
    return userAnswer.toLowerCase() === question.answer.toLowerCase();
  } else {
    return Number(userAnswer) === question.answer;
  }
}

// Main
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const questions: Question[] = [
    { text: "Vad heter du?", answer: "Mustaf" },
    { text: "Hur gammal är du?", answer: "27" },
    { text: "Vem är din favorit fotbollspelare?", answer: "Messi" },
    { text: "Sveriges huvudstad?", answer: "Stockholm" },
    { text: "10 + 10 = ?", answer: "20" },
    { text: "Vad heter världens största berg", answer: "Mount everest" },
  ];

  let score = 0;

  console.log("=== QUIZ START ===");

  for (const q of questions) {
    const userAnswer = await ask(rl, q.text);
    if (checkAnswer(q, userAnswer)) {
      console.log("✅ Rätt!");
      score++;
    } else {
      console.log("❌ Fel. Rätt svar var:", q.answer);
    }
  }

  console.log("=== SLUT ===");
  console.log("Din poäng:", score, "/", questions.length);

  rl.close();
}

main();
