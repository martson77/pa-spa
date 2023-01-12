import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import stringSimilarity from "string-similarity";
/*
Change filename to test other data
// import data from "./api/fotboll.json";
// import data from "./api/flod.json";
*/
import data from "./api/vin.json";

export default function Home() {


const clean = (str) => {
  // The accents and hyphen we want to replace, keeping å, ä, ö
  var accents =    'àáâãòóôõøèéêëðçìíîïùúûüñšÿýž-';
  var accentsOut = 'aaaaoooooeeeeeciiiiuuuunsyyz ';
  str = str.toLowerCase();
  str = str.split('');
  var strLen = str.length;
  var i, x;
  for (i = 0; i < strLen; i++) {
      if ((x = accents.indexOf(str[i])) != -1) {
          str[i] = accentsOut[x];
      }
  }
  str = str.join('')
  return str.replace(/[^\w\såäö]/gi, '');
}
/*
const replaceSpecialChars = (str) => {
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/([^\w]+|\s+)/g, '-') // Replace space and other characters by hyphen
		.replace(/\-\-+/g, '-')	// Replaces multiple hyphens by one hyphen
		.replace(/(^-+|-+$)/g, '').toLowerCase(); // Remove extra hyphens from beginning or end of the string
}
*/

  const [answerInput, setAnswerInput] = useState("");
  const [result, setResult] = useState();
  const [info, setInfo] = useState();
  const [item, setInput] = useState('');

  const changeHandle = e => {
    setInput(e.target.value)
  }

  function asPercent(x) {
    return Number.parseFloat(x * 100).toFixed(2) + "%";
  }

  function onSubmit(event) {
    event.preventDefault();

    let str = answerInput;

    const valids = data.options.filter(options => options.is_correct == true);
    const blacklisted = data.options.filter(options => options.is_correct == false);

    let validsObject = [];
    let blacklistObject = [];

    valids && valids.map((item, i) => (
      validsObject.push(clean(item.option)) 
    ))

    blacklisted && blacklisted.map((item, i) => (
        blacklistObject.push(clean(item.option)) 
    ))
    


    let matches = stringSimilarity.findBestMatch(clean(answerInput), 
      validsObject
    );

    let blackMatches = stringSimilarity.findBestMatch(clean(answerInput),
      blacklistObject
    );

    console.log(matches);
    console.log(blackMatches);

    const limit = 0.55;

    let bestRating = matches.bestMatch.rating;
    let blackRating = blackMatches.bestMatch.rating;
    let result = "";

    let info = "Actual checked answer: \"" + clean(answerInput) + "\", best correct match \"" + matches.bestMatch.target + "\" " + asPercent(bestRating) + ", best blacklisted match \"" + blackMatches.bestMatch.target + " " + asPercent(blackRating) + "\"";

    if(blackRating > bestRating || bestRating < limit) {
      result = "❌ " + answerInput + " är tyvärr fel ( " + asPercent(bestRating) + " | " + asPercent(blackRating) + " )";
    } else {
      result = "✔ " + answerInput + " är rätt! ( " + asPercent(bestRating) + " | " + asPercent(blackRating) + " )";
    }

    setResult(result);
    setInfo(info);
    setAnswerInput("");
  }


  function ListIt({ thecorrect = false }) {
    
    const datan = data;

    console.log(thecorrect);

    const filtered = datan.options.filter(options => options.is_correct == thecorrect);

    let idPrefix = thecorrect ? "correctoption_" : "blacklist_";

    return (
      <div>
        {filtered &&
          filtered.map((item, i) => (
            <div key={i}>
              <input className={styles.shy} type="text" name={idPrefix + i} id={idPrefix + i} value={item.option} placeholder={"Godkänt svarsalternativ " + i} onChange={changeHandle} />
            </div>
          ))
        }
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>På Spåret test</title>
      </Head>
      
      <main className={styles.main}>
        <img src="/pasparet.jpeg" className={styles.icon} />
        <h3>Testar Dice's Coefficient</h3>
        <form onSubmit={onSubmit}>

        <div>
          <label className={styles.label}>{data.question}</label>
          <input
            type="text"
            name="answer"
            placeholder="Ditt svar"
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
          />
          </div>
        <div>
        <label className={styles.label}>Godkända svarsalternativ</label>

        <ListIt thecorrect={true} />

        </div>
        <div>
        <label className={styles.label}>Spärrlista (flervalsalternativen)</label>

          <ListIt />
          
          </div>

          <input type="submit" value="Rätta mitt svar" />
        </form>
        <div className={styles.result}>{result}</div>
        <div className={styles.info}>{info}</div>
      </main>
    </div>
  );
}
