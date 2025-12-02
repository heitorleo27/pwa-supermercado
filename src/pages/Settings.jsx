import { useState, useEffect } from "react";
import "./Settings.css";

export default function Settings({ user }) {
  const [profile, setProfile] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    telefone: user?.telefone || "",
  });

  const [notifications, setNotifications] = useState({
    enabled: true,
    horario: "08:00",
  });

  const [thresholds, setThresholds] = useState({
    green: 21,
    yellow: 11,
    red: 10,
  });

  const [tema, setTema] = useState("auto");
  const [dailyLimitFree, setDailyLimitFree] = useState(20);

  // Carregar configurações salvas
  useEffect(() => {
    const saved = localStorage.getItem("shelfscan_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.thresholds) setThresholds(parsed.thresholds);
        if (parsed.tema) setTema(parsed.tema);
        if (parsed.dailyLimitFree) setDailyLimitFree(parsed.dailyLimitFree);
      } catch (e) {
        console.error("Erro ao carregar configurações:", e);
      }
    }
  }, []);

  // Salvar Configurações
  const salvar = () => {
    const payload = {
      profile,
      notifications,
      thresholds,
      tema,
      dailyLimitFree,
    };

    localStorage.setItem("shelfscan_config", JSON.stringify(payload));
    alert("Configurações salvas com sucesso!");
  };

  const updateProfile = (field, value) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const updateThreshold = (field, value) =>
    setThresholds((prev) => ({ ...prev, [field]: Number(value) }));

  return (
    <div className="settings-container">
      <h1 className="settings-title">Configurações</h1>

      {/*PERFIL DO USUÁRIO*/}
      <section className="settings-section">
        <h2 className="section-title">Conta</h2>

        <label className="form-label">Nome completo</label>
        <input
          className="form-input"
          value={profile.nome}
          onChange={(e) => updateProfile("nome", e.target.value)}
        />

        <label className="form-label">E-mail</label>
        <input
          className="form-input"
          type="email"
          value={profile.email}
          onChange={(e) => updateProfile("email", e.target.value)}
        />

        <label className="form-label">Telefone (opcional)</label>
        <input
          className="form-input"
          value={profile.telefone}
          onChange={(e) => updateProfile("telefone", e.target.value)}
        />
      </section>

      {/*NOTIFICAÇÕES*/}
      <section className="settings-section">
        <h2 className="section-title">Notificações</h2>

        <div className="toggle-row">
          <label>Ativar notificações</label>
          <input
            type="checkbox"
            checked={notifications.enabled}
            onChange={(e) =>
              setNotifications((prev) => ({ ...prev, enabled: e.target.checked }))
            }
          />
        </div>

        <label className="form-label">Horário do alerta diário</label>
        <input
          type="time"
          className="form-input"
          value={notifications.horario}
          onChange={(e) =>
            setNotifications((prev) => ({ ...prev, horario: e.target.value }))
          }
        />

        <h3 className="mini-title">Avisos de validade (dias)</h3>
        <div className="threshold-row">
          <div>
            <label>Verde</label>
            <input
              type="number"
              className="form-input small"
              value={thresholds.green}
              onChange={(e) => updateThreshold("green", e.target.value)}
            />
          </div>

          <div>
            <label>Amarelo</label>
            <input
              type="number"
              className="form-input small"
              value={thresholds.yellow}
              onChange={(e) => updateThreshold("yellow", e.target.value)}
            />
          </div>

          <div>
            <label>Vermelho</label>
            <input
              type="number"
              className="form-input small"
              value={thresholds.red}
              onChange={(e) => updateThreshold("red", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/*TEMA*/}
      <section className="settings-section">
        <h2 className="section-title">Tema</h2>

        <select
          className="form-input"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
        >
          <option value="auto">Automático</option>
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
        </select>
      </section>

      {/*PLANO*/}
      <section className="settings-section">
        <h2 className="section-title">Plano</h2>

        <p className="plan-text">
          Limite diário do plano gratuito: <strong>{dailyLimitFree}</strong> cadastros
        </p>
      </section>

      {/*SUPORTE*/}
      <section className="settings-section">
        <h2 className="section-title">Ajuda & Suporte</h2>

        <button className="support-btn" onClick={() => window.open("mailto:suporte@shelfscan.com")}>
          Contato
        </button>

        <button className="support-btn" onClick={() => window.open("/termos", "_blank")}>
          Termos de Uso
        </button>

        <button className="support-btn" onClick={() => window.open("/politica", "_blank")}>
          Política de Privacidade
        </button>
      </section>

      <button className="save-btn" onClick={salvar}>
        Salvar Configurações
      </button>
    </div>
  );
}
