import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useAuth } from "../context/AuthContext";

const STATUS_LABELS = {
  trial: { label: "Trial", color: "#d97706", bg: "#fef3c7" },
  active: { label: "Activ", color: "#16a34a", bg: "#dcfce7" },
  expired: { label: "Expirat", color: "#dc2626", bg: "#fee2e2" },
  cancelled: { label: "Anulat", color: "#6b7280", bg: "#f3f4f6" },
};

export function AdminDashboard({ onExit }) {
  const { profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); // userId in curs de update

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_users_view")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setUsers(data || []);
    setLoading(false);
  }

  async function updateSubscription(userId, newStatus) {
    setUpdating(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ subscription_status: newStatus })
      .eq("id", userId);

    if (error) alert("Eroare: " + error.message);
    else await fetchUsers();
    setUpdating(null);
  }

  const totalUsers = users.length;
  const activeUsers = users.filter(
    (u) => u.subscription_status === "active",
  ).length;
  const trialUsers = users.filter(
    (u) => u.subscription_status === "trial",
  ).length;

  return (
    <div className="admin-dashboard">
      <div className="session-header">
        <button className="back" onClick={onExit}>
          ← Înapoi
        </button>
        <div className="progress">Admin Dashboard</div>
        <span style={{ fontSize: 12, color: "var(--text-faint)" }}>
          {profile?.email}
        </span>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total utilizatori</div>
          <div className="stat-value">{totalUsers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Subscripții active</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>
            {activeUsers}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">În trial</div>
          <div className="stat-value" style={{ color: "var(--warning)" }}>
            {trialUsers}
          </div>
        </div>
      </div>

      {error && (
        <div className="auth-error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            color: "var(--text-muted)",
          }}
        >
          Se încarcă...
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Utilizator</th>
                <th>Status</th>
                <th>Trial folosit</th>
                <th>Sesiuni</th>
                <th>Întrebări</th>
                <th>Scor mediu</th>
                <th>Ultima sesiune</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const st =
                  STATUS_LABELS[u.subscription_status] || STATUS_LABELS.trial;
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>
                        {u.full_name || "-"}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
                        {u.email}
                      </div>
                    </td>
                    <td>
                      <span
                        className="status-pill"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td>{u.trial_questions_used}</td>
                    <td>{u.total_sessions}</td>
                    <td>{u.total_questions_answered}</td>
                    <td>
                      {u.avg_score_pct
                        ? Math.round(u.avg_score_pct) + "%"
                        : "-"}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {u.last_session_at
                        ? new Date(u.last_session_at).toLocaleDateString(
                            "ro-RO",
                          )
                        : "-"}
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        value={u.subscription_status}
                        disabled={updating === u.id}
                        onChange={(e) =>
                          updateSubscription(u.id, e.target.value)
                        }
                      >
                        <option value="trial">Trial</option>
                        <option value="active">Activ</option>
                        <option value="expired">Expirat</option>
                        <option value="cancelled">Anulat</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
