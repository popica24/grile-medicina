import { useState } from "react";
import { SetupScreen } from "./components/SetupScreen";
import { SessionScreen } from "./components/SessionScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { QuestionCard } from "./components/QuestionCard";
import { getBookmarks, toggleBookmark } from "./storage";

export default function App() {
  const [screen, setScreen] = useState("setup");
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});

  function handleStart(config) {
    setSession(config);
    setAnswers({});
    setScreen("session");
  }

  function handleFinish(finalAnswers) {
    setAnswers(finalAnswers);
    setScreen("results");
  }

  function handleRestart() {
    setSession(null);
    setAnswers({});
    setScreen("setup");
  }

  function handleRetryIncorrect() {
    const incorrect = session.questions.filter((q) => {
      const sel = new Set(answers[q.id] || []);
      const correctSet = new Set(q.correct);
      for (let i = 0; i < q.options.length; i++) {
        if (correctSet.has(i) !== sel.has(i)) return true;
      }
      return false;
    });
    setSession({
      ...session,
      questions: incorrect,
      label: "Reia greșitele",
    });
    setAnswers({});
    setScreen("session");
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Grile Medicină</h1>
        <span className="subtitle">Mediu de învățare</span>
      </header>

      {screen === "setup" && <SetupScreen onStart={handleStart} />}
      {screen === "session" && (
        <SessionScreen
          session={session}
          onFinish={handleFinish}
          onExit={handleRestart}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          session={session}
          answers={answers}
          onRestart={handleRestart}
          onReviewInline={() => setScreen("review")}
          onRetryIncorrect={handleRetryIncorrect}
        />
      )}
      {screen === "review" && (
        <ReviewScreen
          session={session}
          answers={answers}
          onBack={() => setScreen("results")}
        />
      )}
    </div>
  );
}

function ReviewScreen({ session, answers, onBack }) {
  const [bookmarks, setBookmarks] = useState(getBookmarks());

  function handleBookmark(qid) {
    setBookmarks(toggleBookmark(qid));
  }

  return (
    <>
      <div className="session-header">
        <button className="back" onClick={onBack}>
          ← Înapoi la scor
        </button>
        <div className="progress">
          Review · răspunsurile corecte sunt marcate
        </div>
      </div>
      {session.questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          index={i}
          selected={answers[q.id] || []}
          onToggle={() => {}}
          mode="exam"
          revealed={true}
          bookmarked={bookmarks.has(q.id)}
          onToggleBookmark={() => handleBookmark(q.id)}
        />
      ))}
    </>
  );
}
