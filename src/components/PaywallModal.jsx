import { useAccess, TRIAL_TOTAL } from "../hooks/useAccess";

export function PaywallModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card paywall-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="paywall-icon">🔒</div>
        <h2>Ai atins limita trial</h2>
        <p className="paywall-sub">
          Ai rezolvat toate cele {TRIAL_TOTAL} grile disponibile în contul
          trial.
        </p>

        <div className="paywall-features">
          <div className="paywall-feature">
            ✓ Acces la toate grilele din toate capitolele
          </div>
          <div className="paywall-feature">✓ Sesiuni nelimitate</div>
          <div className="paywall-feature">
            ✓ Statistici detaliate și progres
          </div>
          <div className="paywall-feature">✓ Mod examen simulat</div>
        </div>

        <div className="paywall-price">
          <span className="price-amount">TBD</span>
          <span className="price-period">/ lună</span>
        </div>

        <button
          className="btn btn-primary btn-lg paywall-cta"
          onClick={() => {
            // TODO: Stripe Checkout
            alert("Stripe checkout — coming soon.");
          }}
        >
          Abonează-te acum
        </button>

        <button className="paywall-dismiss" onClick={onClose}>
          Înapoi
        </button>
      </div>
    </div>
  );
}

// Banner warning — 80-99% folosit
export function TrialWarningBanner({ used, limit, onUpgrade }) {
  const remaining = limit - used;
  const pct = Math.round((used / limit) * 100);

  return (
    <div className="trial-banner warning">
      <div className="trial-banner-text">
        <strong>
          Trial: {remaining} {remaining === 1 ? "grilă rămasă" : "grile rămase"}
        </strong>{" "}
        din {limit} ({pct}% folosit)
        <div className="trial-progress-bar">
          <div className="trial-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <button className="btn btn-primary btn-sm" onClick={onUpgrade}>
        Upgrade
      </button>
    </div>
  );
}

// Banner blocked — 100% folosit
export function TrialBlockedBanner({ onUpgrade }) {
  return (
    <div className="trial-banner blocked">
      <div className="trial-banner-text">
        <strong>🔒 Trial epuizat</strong> — ai folosit toate cele {TRIAL_TOTAL}{" "}
        grile gratuite
      </div>
      <button className="btn btn-primary btn-sm" onClick={onUpgrade}>
        Deblochează
      </button>
    </div>
  );
}
