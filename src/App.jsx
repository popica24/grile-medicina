import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { AuthScreen } from "./components/AuthScreen";
import { AdminDashboard } from "./components/AdminDashboard";
import { SetupScreen } from "./components/SetupScreen";
import { SessionScreen } from "./components/SessionScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { QuestionCard } from "./components/QuestionCard";
import {
  getBookmarks,
  toggleBookmark,
  getCheckpoint,
  clearCheckpoint,
} from "./storage";

export default function App() {
  const { user, profile, loading, isAdmin, signOut } = useAuth();

  const [screen, setScreen] = useState("setup");
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [resumeData, setResumeData] = useState(null);
  const checkpoint = getCheckpoint();
  const [showCheckpoint, setShowCheckpoint] = useState(true);

  // Loading auth
  if (loading) {
    return (
      <div
        className="app"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div style={{ color: "var(--text-muted)", fontSize: 15 }}>
          Se încarcă...
        </div>
      </div>
    );
  }

  // Neautentificat
  if (!user) {
    return <AuthScreen onSuccess={() => {}} />;
  }

  // Admin dashboard
  if (screen === "admin") {
    return (
      <div className="app">
        <AdminDashboard onExit={() => setScreen("setup")} />
      </div>
    );
  }

  function handleStart(config) {
    clearCheckpoint();
    setSession(config);
    setAnswers({});
    setResumeData(null);
    setScreen("session");
  }

  function handleResume() {
    const cp = getCheckpoint();
    if (!cp) return;
    setSession(cp.session);
    setAnswers(cp.answers);
    setResumeData({ checkedSet: cp.checkedSet });
    setScreen("session");
  }

  function handleFinish(finalAnswers) {
    setAnswers(finalAnswers);
    setScreen("results");
  }

  function handleRestart() {
    setSession(null);
    setAnswers({});
    setResumeData(null);
    setShowCheckpoint(true);
    setScreen("setup");
  }

  function handleClearCheckpoint() {
    clearCheckpoint();
    setShowCheckpoint(false);
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
    clearCheckpoint();
    setSession({ ...session, questions: incorrect, label: "Reia greșitele" });
    setAnswers({});
    setResumeData(null);
    setScreen("session");
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Grile Medicină</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isAdmin && (
            <button className="btn btn-sm" onClick={() => setScreen("admin")}>
              ⚙ Admin
            </button>
          )}
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Salut, {profile?.full_name || profile?.email}
          </span>
          <button className="btn btn-sm" onClick={signOut}>
            Deconectare
          </button>
        </div>
      </header>

      {screen === "setup" && (
        <>
          {checkpoint && showCheckpoint && (
            <div className="checkpoint-banner">
              <div className="checkpoint-info">
                <strong>Sesiune neterminată</strong>
                <span>
                  {checkpoint.session.label || "Sesiune anterioară"} ·{" "}
                  {checkpoint.session.questions.length} grile · salvată{" "}
                  {formatTimeAgo(checkpoint.savedAt)}
                </span>
              </div>
              <div className="checkpoint-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleResume}
                >
                  Continuă
                </button>
                <button className="btn btn-sm" onClick={handleClearCheckpoint}>
                  Ignoră
                </button>
              </div>
            </div>
          )}
          <SetupScreen onStart={handleStart} />
        </>
      )}

      {screen === "session" && (
        <SessionScreen
          session={session}
          answers={resumeData ? answers : undefined}
          checkedSet={resumeData?.checkedSet}
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

function formatTimeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "acum câteva secunde";
  if (diff < 3600) return `acum ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `acum ${Math.floor(diff / 3600)}h`;
  return `acum ${Math.floor(diff / 86400)} zile`;
}
