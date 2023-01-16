import { isCorrect, correct, levenshteinIsCorrect } from "./correctString";
import wineData from "../pages/api/vin.json";

describe("isCorrect - fuzzy string comparision with treshold", () => {
  test("test one", () => {
    const correctAnswer = "Châteauneuf-du-Pape";
    expect(isCorrect("Chateauneuf-du-Pape", correctAnswer, 0.8)).toBe("ok");
    expect(isCorrect("Chateauneuf-du-Pape", correctAnswer, 1)).not.toBe("ok");
  });
});

describe("isCorrect - multiple wines", () => {
  const correctAnswer = "Châteauneuf-du-Pape";
  const wineListOk = [
    "Châteauneuf-du-Pape",
    "Chateauneuf-du-Pape",
    "Chatauneuf-du-Pape",
    "ChâteauneufduPape",
    "Châteauneuf du Pape",
    "chateauneuf-du-pape",
    "chateauneuf-Du-Paape",
  ];
  const treshold = 0.7;
  it.each(wineListOk)("%s", (a) => {
    expect(isCorrect(a, correctAnswer, treshold)).toBe("ok");
  });
});

describe("isCorrect - åäö", () => {
  const correctAnswer = "på spåret";
  const nordicLettersListOk = [
    "på spåret",
    "pa spåret",
    "pö spåret",
    "på sparet",
    "pa spåret",
  ];
  const treshold = 0.7;
  it.each(nordicLettersListOk)("%s", (a) => {
    expect(isCorrect(a, correctAnswer, treshold)).toBe("ok");
  });
});

describe("levenshteinIsCorrect - multiple wines", () => {
  const correctAnswer = "Châteauneuf-du-Pape";
  const wineListOk = [
    "Châteauneuf-du-Pape",
    "Chateauneuf-du-Pape",
    "Chatauneuf-du-Pape",
    "ChâteauneufduPape",
    "Châteauneuf du Pape",
    "chateauneuf-du-pape",
    "chateauneuf-Du-Paape",
  ];
  const treshold = 4;
  it.each(wineListOk)("%s", (a) => {
    expect(levenshteinIsCorrect(a, correctAnswer, treshold)).toBe("ok");
  });
});

describe("correct - vin.json", () => {
  const valids = wineData.options
    .filter((options) => options.is_correct == true)
    .map((item) => item.option);
  const blacklisted = wineData.options
    .filter((options) => options.is_correct == false)
    .map((item) => item.option);
  const wineListOk = [
    "Châteauneuf-du-Pape",
    "Chateauneuf-du-Pape",
    "Chatauneuf-du-Pape",
    "ChâteauneufduPape",
    "Châteauneuf du Pape",
    "chateauneuf-du-pape",
    "chateauneufsdfsdfs-du-paape",
    "âteauneuf Pape",
  ];
  const treshold = 0.7;
  it.each(wineListOk)("%s", (a) => {
    expect(correct(a, valids, blacklisted, treshold)).toBe("ok");
  });
});
