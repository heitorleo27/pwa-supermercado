/* src/pages/Settings.jsx */
import React, { useState, useEffect } from "react";
import "./Settings.css";

export default function Settings({ user }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState("08:00");
  const [thresholds, setThresholds] = useState({ green: 21, yellow: 11, red: 10 });
  const [darkMode, setDarkMode] = useState("auto");
  const [dailyLimitFree, setDailyLimitFree] = useState(20);

  useEffect(() => {
    const saved = localStorage.getItem("shelfscan_settings");
    if (saved) {
      const s = JSON.parse(saved);
      setNotificationsEnabled(s.notificationsEnabled);
      setNotificationTime(s.notificationTime);
      setThresholds(s.thresholds);
      setDarkMode(s.darkMode);
      setDailyLimitFree(s.dailyLimitFree);
    }
  }, []);

  const handleSave = () => {
    const settings = { notificationsEnabled, notificationTime, thresholds, darkMode, dailyLimitFree };
    localStorage.setItem("shelfscan_settings", JSON.stringify(settings));
    alert("Configurações salvas!");
  };

  return (
    <div className="settings-container">
      <h2>Configurações</h2>

      <section className="settings-section">
        <h3>Dados do usuário</h3>
        <label>Nome completo</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <label>E-mail</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Telefone (opcional)</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} />
      </section>

      <section className="settings-section">
        <h3>Notificações</h3>
        <label>Ativar notificações</label>
        <input type="checkbox" checked={notificationsEnabled} onChange={e => setNotificationsEnabled(e.target.checked)} />
        <label>Horário do alerta diário</label>
        <input type="time" value={notificationTime} onChange={e => setNotificationTime(e.target.value)} />
        <label>Thresholds de aviso (dias antes do vencimento)</label>
        <div className="threshold-inputs">
          <input type="number" value={thresholds.green} onChange={e => setThresholds({ ...thresholds, green: Number(e.target.value) })} /> Verde
          <input type="number" value={thresholds.yellow} onChange={e => setThresholds({ ...thresholds, yellow: Number(e.target.value) })} /> Amarelo
          <input type="number" value={thresholds.red} onChange={e => setThresholds({ ...thresholds, red: Number(e.target.value) })} /> Vermelho
        </div>
      </section>

      <section className="settings-section">
        <h3>Tema</h3>
        <select value={darkMode} onChange={e => setDarkMode(e.target.value)}>
          <option value="auto">Automático</option>
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
        </select>
      </section>

      <section className="settings-section">
        <h3>Plano atual</h3>
        <p>Limite diário do plano gratuito: {dailyLimitFree} cadastros</p>
      </section>

      <section className="settings-section">
        <h3>Suporte e Termos</h3>
        <button onClick={() => window.open("mailto:suporte@shelfscan.com", "_blank")}>Contato</button>
        <button onClick={() => window.open("/termos", "_blank")}>Termos de Uso</button>
        <button onClick={() => window.open("/politica", "_blank")}>Política de Privacidade</button>
      </section>

      <button className="settings-save-btn" onClick={handleSave}>Salvar Configurações</button>
    </div>
  );
}
