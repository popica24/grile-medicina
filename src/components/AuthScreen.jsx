import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function AuthScreen({ onSuccess }) {
  const [tab, setTab] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const { signIn, signUp, signInWithGoogle } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    if (tab === "login") {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else onSuccess();
    } else {
      const { error } = await signUp(email, password, fullName);
      if (error) setError(error.message);
      else setInfo("Cont creat! Verifică emailul pentru confirmare.");
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // daca merge, redirecteaza automat
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Grile Medicină</h1>
          <p>Platformă de pregătire pentru rezidențiat</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => {
              setTab("login");
              setError(null);
              setInfo(null);
            }}
          >
            Autentificare
          </button>
          <button
            className={`auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => {
              setTab("register");
              setError(null);
              setInfo(null);
            }}
          >
            Cont nou
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {tab === "register" && (
            <div className="form-group">
              <label>Nume complet</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ion Popescu"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Parolă</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                tab === "register" ? "Minim 6 caractere" : "••••••••"
              }
              required
              minLength={6}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}
          {info && <div className="auth-info">{info}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={loading}
          >
            {loading
              ? "Se procesează..."
              : tab === "login"
                ? "Intră în cont"
                : "Creează cont"}
          </button>
        </form>

        <div className="auth-divider">
          <span>sau</span>
        </div>

        <button
          className="btn btn-google"
          onClick={handleGoogle}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"
            />
            <path
              fill="#34A853"
              d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"
            />
            <path
              fill="#FBBC05"
              d="M4.5 10.48A4.8 4.8 0 014.5 7.5V5.43H1.83a8 8 0 000 7.14l2.67-2.09z"
            />
            <path
              fill="#EA4335"
              d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.56-2.56A8 8 0 001.83 5.43L4.5 7.5a4.8 4.8 0 014.48-3.92z"
            />
          </svg>
          Continuă cu Google
        </button>
      </div>
    </div>
  );
}
