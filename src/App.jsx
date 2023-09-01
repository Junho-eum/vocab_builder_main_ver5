import { useState } from "react";
import "./App.css";
import React from "react";
import TextRevealProfile from "./TextRevealProfile";

// Fisher-Yates Shuffle
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function App() {
  const vocabList = [
    {
      word: "암울한",
      synonym: "bleak",
      hint: "The future of the company looked ____ after the stock price fell.",
    },
    {
      word: "구불구불하게 흐르다",
      synonym: "meander",
      hint: "The river ____ through the valley.",
    },
    {
      word: "다부서져가는",
      synonym: "dilapidated",
      hint: "The house was in a dilapidated condition.",
    },
    {
      word: "추방하다",
      synonym: "ostracize",
      hint: "Later in his lif, Leo Tolstoy was ____ by the Russian Orthodox Church for his radical views.",
    },
    {
      word: "악의적인",
      synonym: "baleful",
      hint: "The ____ look on his face made me think that he was about to hit me.",
    },
    {
      word: "조장하는",
      synonym: "inflammatory",
      hint: "The ____ speech by the politician caused a riot.",
    },
    {
      word: "죽어가는",
      synonym: "moribund",
      hint: "The ____ patient was not expected to live through the night.",
    },
    {
      word: "시끄러운",
      synonym: "obstreperous",
      hint: "The ____ child was sent to the principal's office.",
    },
    {
      word: "성급한",
      synonym: "irascible",
      hint: "If you don't want to make him angry, don't mention his ex-wife. He's very ____ about her.",
    },
    {
      word: "비행하는",
      synonym: "miscreant",
      hint: "The ____ was sent to prison for his crimes.",
    },
    {
      word: "풍부한",
      synonym: "flush",
      hint: "The exam's passage was ____ with difficult vocabulary.",
    },
    {
      word: "음모를 꾸미는",
      synonym: "conniving",
      hint: "The queen was so ____ that she had her husband killed so that she could marry her lover.",
    },
    {
        word: "지루한",
        synonym: "prosaic",
        hint: "The ____ writing style of the novel made it difficult to read.",
    },
    {
      word: "진위성",
      synonym: "versimilitude",
      hint: "The ____ of the painting was so great that it looked like a photograph.",
    },
    {
      word: "속임수",
      synonym: "subterfuge",
      hint: "The spy used ____ to get the information he needed.",
    },
    {
      word: "보복",
      synonym: "reprisal",
      hint: "The country launched a ____ attack against its enemy.",
    },
    {
      word: "병렬",
      synonym: "juxatapos",
      hint: "The ____ of the two paintings made it clear that the artist was trying to make a point.",
    },
    {
      word: "형사상의",
      synonym: "pucniary",
      hint: "The ____ reward for the capture of the criminal was $10,000.",
    },
    {
      word: "가난한",
      synonym: "impecunious",
      hint: "The couple was so ____ that they could not afford to buy food.",
    },
    {
      word: "특이한 습관",
      synonym: "idiosyncrasy",
      hint: "The ____ of the artist was that he always painted with his feet.",
    },
    {
      word: "참견하기 좋아하는",
      synonym: "officious",
      hint: "The professor had an ____ manner that made it difficult for students to ask questions.",
    },
    {
      word: "사회적 실수",
      synonym: "gaffe",
      hint: "The politician made a ____ when he accidentally insulted the queen.",
    },
    {
      word: "충실한",
      synonym: "stalwart",
      hint: "The ____ soldier refused to surrender to the enemy.",
    },
    {
      word: "문제를 일으키는",
      synonym: "firebrand",
      hint: "The ____ politician was known for his fiery speeches.",
    },
    {
      word: "~의 탓으로 돌리다",
      synonym: "ascribe",
      hint: "The teacher ____ the student's failure to laziness.",
    },
  ];
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [wronglyAnswered, setWronglyAnswered] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [onStreak, setOnStreak] = useState(false);
  const shuffledVocabList = shuffle([...vocabList]);
  const [scoreList, setScoreList] = useState([]);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [shuffledWrongAnswers, setShuffledWrongAnswers] = useState([]);
  const [remainingQuestions, setRemainingQuestions] = useState(
    vocabList.map((_, idx) => idx)
  );

  React.useEffect(() => {
    const savedScores = localStorage.getItem("scoreList");
    if (savedScores) {
      const sortedScores = JSON.parse(savedScores).sort(
        (a, b) => b.score - a.score
      );
      setScoreList(sortedScores);
    }
  }, []);


  const checkAnswer = () => {
    const isCorrect = inputValue === vocabList[index].synonym;
    const pointValue = 1; // Points for a correct answer

    if (isCorrect) {
      setStreak((prevStreak) => prevStreak + 1);
      setShowCorrectAnswer(false);
      setRemainingQuestions((prev) => prev.filter((i) => i !== index));
      // Check if user has a streak of 3 or more
      if (streak >= 2) {
        setOnStreak(true);
        setScore((prevScore) => prevScore + 3 * pointValue);
      } else {
        setScore((prevScore) => prevScore + pointValue);
      }

      setCorrectCount((prevCount) => prevCount + 1);

      // If answered correctly, remove from wronglyAnswered and shuffledWrongAnswers
      if (wronglyAnswered.includes(index)) {
        setWronglyAnswered((prev) => prev.filter((idx) => idx !== index));
        setShuffledWrongAnswers((prev) => prev.filter((idx) => idx !== index));
      }

      // Immediately proceed to the next question if the answer is correct
      moveToNextQuestion();
    } else {
      setStreak(0); // Reset the streak
      setOnStreak(false);
      setShowCorrectAnswer(true);
      if (!wronglyAnswered.includes(index)) {
        setWronglyAnswered((prev) => [...prev, index]);
      }
      setWrongCount((prevCount) => prevCount + 1);

      // Wait for 3 seconds before moving to the next question after a wrong answer
      setTimeout(() => {
        setShowCorrectAnswer(false);
        moveToNextQuestion();
      }, 3000);
    }
  };

  const moveToNextQuestion = () => {
    let newIndex;

    if (wronglyAnswered.includes(index) && shuffledWrongAnswers.length > 0) {
      const currPosition = shuffledWrongAnswers.indexOf(index);
      newIndex = shuffledWrongAnswers[currPosition + 1];
    } else if (remainingQuestions.length > 0) {
      // This ensures a random question is picked from the remaining questions
      newIndex =
        remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
    } else {
      newIndex = undefined; // All questions have been answered
    }

    // If there's no new question (i.e., all questions have been answered correctly),
    // handle accordingly. For now, we're just resetting to the first question,
    // but you might want a more refined approach.
    if (newIndex === undefined) {
      newIndex = 0; // Or some logic to end the quiz.
    }

    setIndex(newIndex);
    setInputValue("");
  };

  const clearScores = () => {
    localStorage.removeItem("scoreList");
    setScoreList([]);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkAnswer();
    }
  };

  const totalWords = vocabList.length;
  const correctWidth = (correctCount / totalWords) * 100;
  const wrongWidth = (wrongCount / totalWords) * 100;

  const handleFinish = () => {
    const shouldRecord = window.confirm("Do you want to record your score?");
    if (shouldRecord) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}-${currentDate.getHours()}:${currentDate.getMinutes()}${currentDate.getHours() >= 12 ? "pm" : "am"}`;
      const newScore = { score, timestamp: formattedDate };

      const newScoreList = [...scoreList, newScore];
      setScoreList(newScoreList);
      localStorage.setItem("scoreList", JSON.stringify(newScoreList));
    }
  };

  return (
    <>
      <TextRevealProfile />

      <div className="vocab-section">
        {remainingQuestions.length === 1 && (
          <h2 style={{ textAlign: "center" }}>Last Question</h2>
        )}
        <h2>Intermed-06</h2>
        <p>Meaning: {vocabList[index].word}</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter the synonym"
          />
          <button onClick={checkAnswer}>Check</button>
          <button onClick={() => setShowHint(!showHint)}>Hint</button>
          <button
            onClick={handleFinish}
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            Finish
          </button>

          <button
            onClick={clearScores}
            style={{ position: "absolute", top: "10px", right: "120px" }}
          >
            Clear Scores
          </button>

          <div style={{ position: "absolute", top: "40px", right: "10px" }}>
            {scoreList.map((s, index) => (
              <div key={index}>
                Score: {s.score}{" "}
                <span
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.9em",
                    color: "grey",
                  }}
                >
                  {s.timestamp}
                </span>
              </div>
            ))}
          </div>
        </form>

        <div className={`score ${onStreak ? "glow" : ""}`}>Score: {score}</div>

        {/* Show the correct answer when the answer is wrong */}
        <div className={`correct-answer ${showCorrectAnswer ? "fade-in" : ""}`}>
          Correct Answer: {vocabList[index].synonym}
        </div>

        <div className={`hint ${showHint ? "show" : ""}`}>
          {vocabList[index].hint}
        </div>
      </div>
      <div className="progress-section">
        <div className="progress-bar">
          <div
            className="progress correct"
            style={{ width: `${correctWidth}%` }}
          ></div>
        </div>
        <div className="progress-bar">
          <div
            className="progress wrong"
            style={{ width: `${wrongWidth}%` }}
          ></div>
        </div>
      </div>
    </>
  );
              };

export default App;
