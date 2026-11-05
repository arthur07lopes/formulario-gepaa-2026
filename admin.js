/* GEPAA 2026 — Painel administrativo protegido por Supabase Auth + RLS. */
(() => {
  "use strict";

  const loginPanel = document.querySelector("#loginPanel");
  const dashboardPanel = document.querySelector("#dashboardPanel");
  const loginForm = document.querySelector("#loginForm");
  const loginStatus = document.querySelector("#loginStatus");
  const dashboardStatus = document.querySelector("#dashboardStatus");
  const loginButton = document.querySelector("#loginButton");
  const logoutButton = document.querySelector("#logoutButton");
  const refreshButton = document.querySelector("#refreshButton");
  const exportDocxButton = document.querySelector("#exportDocxButton");
  const exportCsvButton = document.querySelector("#exportCsvButton");
  const responsesBody = document.querySelector("#responsesBody");

  let client = window.gepaaSupabase || null;
  let responses = [];
  let charts = {};

  function setMessage(element, message, type = "") {
    element.textContent = message;
    element.className = `status${type ? ` ${type}` : ""}`;
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));
  }

  function showLogin(message = "") {
    loginPanel.hidden = false;
    dashboardPanel.hidden = true;
    if (message) setMessage(loginStatus, message, "error");
  }

  function showDashboard() {
    loginPanel.hidden = true;
    dashboardPanel.hidden = false;
  }

  async function hasAdminPermission(user) {
    const { data, error } = await client
      .from("gepaa_admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    return Boolean(data);
  }

  async function loadResponses() {
    setMessage(dashboardStatus, "Atualizando respostas…");
    refreshButton.disabled = true;
    try {
      const { data, error } = await client
        .from("gepaa_responses")
        .select("id, created_at, answers")
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      responses = data || [];
      renderDashboard();
      setMessage(dashboardStatus, `${responses.length} avaliação(ões) carregada(s).`, "success");
      document.querySelector("#lastUpdated").textContent = `Dados atualizados em ${formatDate(new Date().toISOString())}.`;
    } catch (error) {
      console.error("Erro ao consultar avaliações:", error);
      setMessage(dashboardStatus, "Não foi possível consultar os dados. Confira se sua conta está autorizada na tabela gepaa_admins.", "error");
    } finally {
      refreshButton.disabled = false;
    }
  }

  function responseValue(row, group, key) {
    return row.answers?.[group]?.[key] || "";
  }

  function averageGeneral() {
    const keys = ["general_clarity", "general_relevance", "general_engagement", "general_duration"];
    const values = responses.flatMap((row) => keys.map((key) => Number(responseValue(row, "general", key))))
      .filter((value) => Number.isFinite(value) && value >= 1 && value <= 5);
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  }

  function countProfiles() {
    const uniqueProfiles = new Set(responses.flatMap((row) => Array.isArray(row.answers?.profile) ? row.answers.profile : []));
    return uniqueProfiles.size;
  }

  function updateMetrics() {
    document.querySelector("#totalResponses").textContent = String(responses.length);
    const average = averageGeneral();
    document.querySelector("#overallAverage").textContent = average === null ? "—" : average.toFixed(2).replace(".", ",");
    document.querySelector("#profileCount").textContent = String(countProfiles());
    document.querySelector("#latestResponse").textContent = responses.length ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(responses[0].created_at)) : "—";
    document.querySelector("#responseCountLabel").textContent = `${responses.length} registro(s)`;
  }

  function destroyCharts() {
    Object.values(charts).forEach((chart) => chart?.destroy());
    charts = {};
  }

  function renderCharts() {
    if (!window.Chart) {
      setMessage(dashboardStatus, "A biblioteca de gráficos não foi carregada. Verifique sua conexão e atualize a página.", "error");
      return;
    }
    destroyCharts();

    const generalKeys = ["general_clarity", "general_relevance", "general_engagement", "general_duration"];
    const generalLabels = ["Clareza e didática", "Relevância", "Dinâmica e engajamento", "Duração das visitas"];
    const averages = generalKeys.map((key) => {
      const values = responses.map((row) => Number(responseValue(row, "general", key))).filter((value) => Number.isFinite(value) && value >= 1 && value <= 5);
      return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : 0;
    });

    charts.general = new Chart(document.querySelector("#generalChart"), {
      type: "bar",
      data: { labels: generalLabels, datasets: [{ label: "Média (1 a 5)", data: averages, backgroundColor: "#007fba", borderColor: "#005d8c", borderWidth: 1, borderRadius: 6 }] },
      options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", scales: { x: { min: 0, max: 5, ticks: { stepSize: 1 } } }, plugins: { legend: { display: false } } }
    });

    const ratingLabels = ["Ruim", "Regular", "Bom", "Excelente", "Não participei"];
    const cycles = [
      ["Esse Lance é Seguro", "cycle_1"], ["Alunos Novos", "cycle_12"], ["Vale Dar um Jeitinho?", "cycle_2"],
      ["Jogo Limpo da Segurança", "cycle_3"], ["Cuide de Você", "cycle_4"]
    ];
    const cycleColors = ["#d64b3c", "#7d8a99", "#e8a126", "#16834c", "#007fba"];
    charts.cycles = new Chart(document.querySelector("#cyclesChart"), {
      type: "bar",
      data: { labels: cycles.map((item) => item[0]), datasets: ratingLabels.map((label, index) => ({ label, data: cycles.map(([, key]) => responses.filter((row) => responseValue(row, "cycles", key) === label).length), backgroundColor: cycleColors[index] })) },
      options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { position: "bottom" } } }
    });

    const activities = [
      ["Estatísticas", "activity_statistics"], ["Cultura de Segurança", "activity_culture"], ["CVV", "activity_cvv"],
      ["Segurança Digital", "activity_digital"], ["Primeiros Socorros", "activity_first_aid"]
    ];
    const activityLabels = ["Péssimo", "Regular", "Bom", "Excelente", "Não participei"];
    const activityColors = ["#b52a2a", "#e8a126", "#16834c", "#007fba", "#8a95a3"];
    charts.activities = new Chart(document.querySelector("#activitiesChart"), {
      type: "bar",
      data: { labels: activities.map((item) => item[0]), datasets: activityLabels.map((label, index) => ({ label, data: activities.map(([, key]) => responses.filter((row) => responseValue(row, "activities", key) === label).length), backgroundColor: activityColors[index] })) },
      options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { position: "bottom" } } }
    });
  }

  function buildDetail(row) {
    const a = row.answers || {};
    const generalLabels = {
      general_clarity: "Clareza e didática", general_relevance: "Relevância dos temas",
      general_engagement: "Dinâmica e engajamento", general_duration: "Duração das visitas"
    };
    const cycleLabels = { cycle_1: "Ciclo 1 — Esse Lance é Seguro", cycle_12: "Ciclo 1.2 — Alunos Novos", cycle_2: "Ciclo 2 — Vale Dar um Jeitinho?", cycle_3: "Ciclo 3 — Jogo Limpo da Segurança", cycle_4: "Ciclo 4 — Cuide de Você" };
    const activityLabels = { activity_statistics: "Estatísticas de Segurança", activity_culture: "Cultura de Segurança", activity_cvv: "CVV", activity_digital: "Segurança Digital", activity_first_aid: "Primeiros Socorros" };
    const perceptionLabels = { perception_change: "Mudanças nas práticas", perception_gamification: "Copa da Segurança", perception_harassment: "Prevenção ao assédio" };
    const detailBlock = (title, entries) => `<section><h3>${escapeHTML(title)}</h3>${entries.map(([label, value]) => `<p><strong>${escapeHTML(label)}:</strong> ${escapeHTML(value || "Não respondeu")}</p>`).join("")}</section>`;
    const comments = a.comments || {};
    return `<div class="detail-content">
      ${detailBlock("Identificação", [["Perfil", (a.profile || []).join(", ")], ["Curso / Área", a.courseArea], ["Turno", (a.shifts || []).join(", ")]])}
      ${detailBlock("Avaliação geral", Object.entries(generalLabels).map(([key, label]) => [label, a.general?.[key]]))}
      ${detailBlock("Ciclos temáticos", Object.entries(cycleLabels).map(([key, label]) => [label, a.cycles?.[key]]))}
      ${detailBlock("Atividades", Object.entries(activityLabels).map(([key, label]) => [label, a.activities?.[key]]))}
      ${detailBlock("Percepção", Object.entries(perceptionLabels).map(([key, label]) => [label, a.perception?.[key]]))}
      ${detailBlock("Sugestões e comentários", [["Ação mais marcante", comments.memorable], ["Temas para 2027", comments.nextCycle], ["Comentários / melhorias", comments.suggestions]])}
    </div>`;
  }

  function renderResponses() {
    if (!responses.length) {
      responsesBody.innerHTML = '<tr><td colspan="5">Nenhuma avaliação recebida até o momento.</td></tr>';
      return;
    }
    responsesBody.innerHTML = responses.map((row, index) => {
      const a = row.answers || {};
      const summary = Array.isArray(a.profile) ? a.profile.join(", ") : "";
      return `<tr><td>${escapeHTML(formatDate(row.created_at))}</td><td>${escapeHTML(summary || "Não informado")}</td><td>${escapeHTML(a.courseArea || "Não informado")}</td><td>${escapeHTML((a.shifts || []).join(", ") || "Não informado")}</td><td><button class="detail-button" type="button" data-detail-index="${index}" aria-expanded="false">Ver respostas</button></td></tr><tr class="detail-row" id="detail-${index}" hidden><td colspan="5">${buildDetail(row)}</td></tr>`;
    }).join("");
  }

  function renderDashboard() {
    updateMetrics();
    renderCharts();
    renderResponses();
  }

  function csvCell(value) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  }

  function downloadCsv() {
    const headers = ["Data", "Perfil", "Curso/Área", "Turno", "Clareza", "Relevância", "Dinâmica", "Duração", "Ciclo 1", "Ciclo 1.2", "Ciclo 2", "Ciclo 3", "Ciclo 4", "Estatísticas", "Cultura", "CVV", "Segurança Digital", "Primeiros Socorros", "Mudança de comportamento", "Gamificação", "Prevenção ao assédio", "Ação mais marcante", "Temas para 2027", "Comentários"];
    const rows = responses.map((row) => {
      const a = row.answers || {};
      return [row.created_at, (a.profile || []).join("; "), a.courseArea, (a.shifts || []).join("; "),
        a.general?.general_clarity, a.general?.general_relevance, a.general?.general_engagement, a.general?.general_duration,
        a.cycles?.cycle_1, a.cycles?.cycle_12, a.cycles?.cycle_2, a.cycles?.cycle_3, a.cycles?.cycle_4,
        a.activities?.activity_statistics, a.activities?.activity_culture, a.activities?.activity_cvv, a.activities?.activity_digital, a.activities?.activity_first_aid,
        a.perception?.perception_change, a.perception?.perception_gamification, a.perception?.perception_harassment,
        a.comments?.memorable, a.comments?.nextCycle, a.comments?.suggestions];
    });
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(";")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `respostas-gepaa-2026-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!client) {
      setMessage(loginStatus, "O Supabase ainda não foi configurado. O responsável pelo projeto precisa preencher database/supabase.js.", "error");
      return;
    }
    loginButton.disabled = true;
    setMessage(loginStatus, "Verificando acesso…");
    try {
      const email = loginForm.elements.email.value.trim();
      const password = loginForm.elements.password.value;
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const authorized = await hasAdminPermission(data.user);
      if (!authorized) {
        await client.auth.signOut();
        throw new Error("Esta conta ainda não recebeu autorização administrativa do GEPAA.");
      }
      showDashboard();
      await loadResponses();
    } catch (error) {
      console.error("Falha de autenticação administrativa:", error);
      setMessage(loginStatus, error.message || "Não foi possível entrar. Confira o e-mail e a senha.", "error");
    } finally {
      loginButton.disabled = false;
    }
  });

  logoutButton.addEventListener("click", async () => {
    if (client) await client.auth.signOut();
    responses = [];
    destroyCharts();
    showLogin("Sessão encerrada.");
  });

  refreshButton.addEventListener("click", loadResponses);
  exportCsvButton.addEventListener("click", downloadCsv);
  exportDocxButton.addEventListener("click", async () => {
    if (!responses.length) {
      setMessage(dashboardStatus, "Ainda não existem respostas para gerar o relatório.", "error");
      return;
    }
    exportDocxButton.disabled = true;
    setMessage(dashboardStatus, "Preparando relatório DOCX…");
    try {
      await window.GEPAADocxReport.generateGepaaDocx(responses);
      setMessage(dashboardStatus, "Relatório DOCX gerado com sucesso.", "success");
    } catch (error) {
      console.error("Falha ao gerar DOCX:", error);
      setMessage(dashboardStatus, error.message || "Não foi possível gerar o documento Word.", "error");
    } finally {
      exportDocxButton.disabled = false;
    }
  });

  responsesBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-detail-index]");
    if (!button) return;
    const row = document.querySelector(`#detail-${button.dataset.detailIndex}`);
    const isOpening = row.hidden;
    row.hidden = !isOpening;
    button.setAttribute("aria-expanded", String(isOpening));
    button.textContent = isOpening ? "Ocultar" : "Ver respostas";
  });

  async function restoreSession() {
    if (!client) {
      showLogin("O painel ainda não foi conectado ao projeto Supabase.");
      return;
    }
    try {
      const { data: { session } } = await client.auth.getSession();
      if (!session?.user) return;
      const authorized = await hasAdminPermission(session.user);
      if (authorized) {
        showDashboard();
        await loadResponses();
      } else {
        await client.auth.signOut();
        showLogin("Sua conta não possui autorização administrativa.");
      }
    } catch (error) {
      console.error("Não foi possível restaurar a sessão:", error);
      showLogin("Não foi possível validar sua sessão. Entre novamente.");
    }
  }

  showLogin();
  restoreSession();
})();
