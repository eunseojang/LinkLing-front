export type Language = "KR" | "JP" | "EN" | "CN";
export type ProblemType = "S" | "W" | "R" | "L";

export interface UserLanguage {
  user_lang: Language;
  lang_level: number;
}

export interface QuestionType {
  q_script?: string; // 선택적 필드
  q_content: string; // 필수 필드
  q_choice1?: string; // 선택적 필드
  q_choice2?: string; // 선택적 필드
  q_choice3?: string; // 선택적 필드
  q_choice4?: string; // 선택적 필드
  q_answer?: number; // 선택적 필드
}

//type W S
export const gptQuestions = [
  {
    q_content: "I had coffee this morning.",
  },
  {
    q_content: "The weather is very clear today.",
  },
  {
    q_content: "I had coffee this morning.",
  },
  {
    q_content: "I had coffee this morning.",
  },
  {
    q_content: "I had coffee this morning.",
  },
  {
    q_content: "I had coffee this morning.",
  },
  {
    q_content: "I had coffee this morning.",
  },
  {
    q_content: "I had coffee this morning.",
  },
];

//type R L
export const questions: QuestionType[] = [
  {
    q_script: "I had coffee this morning.",
    q_content: "I had coffee this morning.",
    q_choice1: "Juice",
    q_choice2: "Tea",
    q_choice3: "Water",
    q_choice4: "Coffee",
    q_answer: 4,
  },
  {
    q_script: "The weather is very clear today.",
    q_content: "The weather is very clear today.",
    q_choice1: "Cloudy",
    q_choice2: "Rain",
    q_choice3: "Clear",
    q_choice4: "Snow",
    q_answer: 3,
  },
  {
    q_script: "L",
    q_content: "I watched a movie with my friend.",
    q_choice1: "Alone",
    q_choice2: "Parents",
    q_choice3: "Friend",
    q_choice4: "Sibling",
    q_answer: 3,
  },
  {
    q_script: "L",
    q_content: "Yesterday was a very busy day.",
    q_choice1: "Fun",
    q_choice2: "Rested",
    q_choice3: "Busy",
    q_choice4: "Tired",
    q_answer: 3,
  },
  {
    q_script: "L",
    q_content: "I exercise every morning.",
    q_choice1: "In the evening",
    q_choice2: "At lunch",
    q_choice3: "Every morning",
    q_choice4: "On weekends",
    q_answer: 3,
  },
  {
    q_script: "L",
    q_content: "I had a sandwich for lunch today.",
    q_choice1: "Rice",
    q_choice2: "Salad",
    q_choice3: "Steak",
    q_choice4: "Sandwich",
    q_answer: 4,
  },
  {
    q_script: "L",
    q_content: "On weekends, I go on picnics with my family.",
    q_choice1: "Stay home",
    q_choice2: "Picnic",
    q_choice3: "Watch a movie",
    q_choice4: "Shopping",
    q_answer: 2,
  },
  {
    q_script: "L",
    q_content: "I go to bed at 10 PM every night.",
    q_choice1: "9:00 PM",
    q_choice2: "10:00 PM",
    q_choice3: "11:00 PM",
    q_choice4: "12:00 AM",
    q_answer: 2,
  },
  {
    q_script: "L",
    q_content: "I go swimming every Wednesday.",
    q_choice1: "Every day",
    q_choice2: "Monday",
    q_choice3: "Wednesday",
    q_choice4: "Weekend",
    q_answer: 3,
  },
  {
    q_script: "L",
    q_content:
      "A student explains that math is her favorite subject in school.",
    q_choice1: "Science",
    q_choice2: "History",
    q_choice3: "Math",
    q_choice4: "Art",
    q_answer: 3,
  },
];
