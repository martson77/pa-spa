import stringSimilarity from "string-similarity";
import levenshtein from "js-levenshtein";

function isCorrect(check, correctAnswer, treshold = 0.8) {
  const similarity = stringSimilarity.compareTwoStrings(check, correctAnswer);
  return similarity >= treshold ? "ok" : `${similarity}`;
}

function levenshteinIsCorrect(check, correctAnswer, treshold = 4) {
  const similarity = levenshtein(check, correctAnswer);
  return similarity <= treshold ? "ok" : `${similarity}`;
}

const clean = (str) => {
  // The accents and hyphen we want to replace, keeping å, ä, ö
  var accents = "àáâãòóôõøèéêëðçìíîïùúûüñšÿýž-";
  var accentsOut = "aaaaoooooeeeeeciiiiuuuunsyyz ";
  str = str.toLowerCase();
  str = str.split("");
  var strLen = str.length;
  var i, x;
  for (i = 0; i < strLen; i++) {
    if ((x = accents.indexOf(str[i])) != -1) {
      str[i] = accentsOut[x];
    }
  }
  str = str.join("");
  return str.replace(/[^\w\såäö]/gi, "");
};

function correct(answerInput, valids = [], blacklist = [], treshold = 0.7) {
  const cleanValids = valids.map((item) => clean(item));
  const cleanBlacklist = blacklist.map((item) => clean(item));
  const cleanAnswer = clean(answerInput);

  const matches = stringSimilarity.findBestMatch(cleanAnswer, cleanValids);

  const blackMatches = stringSimilarity.findBestMatch(
    cleanAnswer,
    cleanBlacklist
  );

  const bestRating = matches.bestMatch.rating;
  const blackRating = blackMatches.bestMatch.rating;

  if (blackRating > bestRating || bestRating < treshold) {
    return bestRating;
  } else {
    return "ok";
  }
}

export { isCorrect, correct, levenshteinIsCorrect };
