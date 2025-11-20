
import { GoogleGenAI, Type } from "@google/genai";
import { AIHabitSuggestion, Habit, Category } from "../types";
import { Language } from "../translations";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    throw new Error("API Key is required for Gemini features.");
  }
  return new GoogleGenAI({ apiKey });
};

export const getHabitSuggestions = async (goal: string, language: Language = 'en'): Promise<AIHabitSuggestion[]> => {
  try {
    const ai = getAI();
    const langPrompt = language === 'pl' ? 'in Polish' : 'in English';
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `I want to build better habits. My current goal or focus area is: "${goal}". 
      Suggest 5 specific, actionable, and simple habits I could start.
      Provide the habitName and reason ${langPrompt}.
      IMPORTANT: The 'category' field MUST be one of the following English words exactly, regardless of the output language: Health, Productivity, Mindfulness, Learning, Fitness, Other.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              habitName: { type: Type.STRING, description: `A short, action-oriented title for the habit ${langPrompt}` },
              category: { type: Type.STRING, description: "One of: Health, Productivity, Mindfulness, Learning, Fitness, Other" },
              reason: { type: Type.STRING, description: `Why this helps achieve the goal ${langPrompt}` },
            },
            required: ["habitName", "category", "reason"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as AIHabitSuggestion[];
  } catch (error) {
    console.error("Error fetching habit suggestions:", error);
    return [];
  }
};

export const getHabitMotivation = async (habitTitle: string, streak: number, language: Language = 'en'): Promise<string> => {
  try {
    const ai = getAI();
    const langPrompt = language === 'pl' ? 'Język: Polski' : 'Language: English';
    
    const prompt = `
      You are a motivational habit coach.
      User's Habit: "${habitTitle}"
      Current Streak: ${streak} days.
      
      Task: Generate a short, punchy, and intelligent motivational message (max 2 sentences).
      
      Logic:
      1. If the streak is high (>3 days), calculate/estimate a fun fact related to the habit.
         Example for "No sugar": "That's approx 500 calories saved per day! Your insulin levels are thanking you."
         Example for "Reading": "You've likely read over 50 pages. Your brain connectivity is increasing!"
      2. If the streak is 0 or 1, be encouraging and focus on the power of starting.
      3. Be specific to the habit title. Adapt the tone to be supportive but factual.
      
      Output: Just the plain text message. ${langPrompt}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || (language === 'pl' ? "Nie poddawaj się!" : "Keep going!");
  } catch (error) {
    console.error("Error fetching motivation:", error);
    return language === 'pl' ? "Jesteś na dobrej drodze!" : "You are on the right track!";
  }
};

export const getMotivationalInsight = async (habits: Habit[], categories: Category[], language: Language = 'en'): Promise<string> => {
  try {
    const ai = getAI();
    const langPrompt = language === 'pl' ? 'Język odpowiedzi: Polski' : 'Language: English';

    // Prepare detailed data for AI
    const habitSummary = habits.map(h => {
        const cat = categories.find(c => c.id === h.category_id) || categories.find(c => c.name === h.category_id);
        return {
            title: h.title,
            category: cat ? cat.name : 'General',
            streak: h.streak,
            isCompletedToday: h.completedDates.includes(new Date().toISOString().split('T')[0])
        };
    });

    if (habitSummary.length === 0) {
        return language === 'pl' 
          ? "Dodaj swój pierwszy nawyk, a opowiem Ci o korzyściach z niego płynących!" 
          : "Add your first habit, and I'll tell you about the science behind it!";
    }

    const prompt = `
      You are an expert behavioral scientist and biologist.
      User's Habits Data: ${JSON.stringify(habitSummary)}
      
      Task: Select ONE habit from the list and generate a specific, fact-based insight.
      
      Rules:
      1. DO NOT congratulate explicitly (e.g. "Great job").
      2. Provide a fascinating SCIENTIFIC FACT, STATISTIC, or TRIVIA about the benefits of this specific activity.
      3. If the habit is currently neglected (streak 0), mention a psychological "micro-step" or a surprising fact about recovery.
      4. Keep it short (max 2 sentences).
      
      LINGUISTIC INSTRUCTIONS (VERY IMPORTANT):
      - If generating in Polish: DO NOT put the habit title in quotes. DO NOT paste the title raw.
      - You MUST conjugate/decline the habit name to fit the sentence grammar naturally.
      - Example Bad: "Świetnie radzisz sobie z nawykiem 'nie jedzenie słodyczy'!"
      - Example Good: "Świetnie radzisz sobie z niejedzeniem słodyczy!" or "Odstawienie słodyczy powoduje..."
      - Example Bad: "Twój 'Bieganie' jest super."
      - Example Good: "Regularne bieganie poprawia..."
      - Make it sound like a native Polish speaker, natural and fluid.

      ${langPrompt}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || (language === 'pl' ? "Każdy dzień to nowa szansa na sukces!" : "Every day is a new chance for success!");

  } catch (error) {
    console.error("Error fetching daily insight:", error);
    return language === 'pl' 
      ? "Konsekwencja jest kluczem do sukcesu. Trzymaj tak dalej!" 
      : "Consistency is key. Keep moving forward!";
  }
};
