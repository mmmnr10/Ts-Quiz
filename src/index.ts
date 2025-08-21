import readline from "node:readline";

type Question = {
  text: string;
  answer: string | number | boolean;
  help?: string;
  points?: number;
};

function ask(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => rl.question(prompt + " ", resolve));
}

async function askWithHelp(
  rl: readline.Interface,
  q: Question
): Promise<string> {
  if (q.help) {
    const wantsHelp = await ask(rl, "Vill du ha en ledtråd? (ja/nej)");
    if (wantsHelp.toLowerCase() === "ja") {
      console.log("Ledtråd:", q.help);
    }
  }
  return await ask(rl, q.text);
}

function checkAnswer(question: Question, userAnswer: string): boolean {
  if (typeof question.answer === "string") {
    return userAnswer.toLowerCase() === question.answer.toLowerCase();
  } else if (typeof question.answer === "number") {
    return Number(userAnswer) === question.answer;
  } else if (typeof question.answer === "boolean") {
    const normalized = userAnswer.toLowerCase();
    return (normalized === "ja" || normalized === "true") === question.answer;
  }
  return false;
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const questions: Question[] = [
    {
      text: "Vad heter du?",
      answer: "Mustaf",
      help: "Ditt namn börjar på M",
      points: 1,
    },
    {
      text: "Hur gammal är du?",
      answer: 27,
      help: "Två tiotal och sju",
      points: 2,
    },
    { text: "Vem är din favorit fotbollspelare?", answer: "Messi", points: 2 },
    { text: "Sveriges huvudstad?", answer: "Stockholm", points: 2 },
    { text: "10 + 10 = ?", answer: 20, points: 1 },
    {
      text: "Är jorden rund?",
      answer: true,
      help: "Tänk på satellitbilder",
      points: 1,
    },
  ];

  let score = 0;

  console.log("=== QUIZ START ===");

  for (const q of questions) {
    const userAnswer = await askWithHelp(rl, q);
    if (checkAnswer(q, userAnswer)) {
      const points = q.points ?? 1;
      console.log(`✅ Rätt! +${points} poäng`);
      score += points;
    } else {
      console.log("❌ Fel. Rätt svar var:", q.answer);
      score -= 1;
    }
  }

  console.log("=== SLUT ===");
  console.log(
    "Din poäng:",
    score,
    "/",
    questions.reduce((sum, q) => sum + (q.points ?? 1), 0)
  );

  rl.close();
}

main();
