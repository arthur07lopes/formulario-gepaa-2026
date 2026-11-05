/* GEPAA 2026 — Envio do formulário público para Supabase. */
(() => {
  "use strict";

  const form = document.querySelector("#gepaaForm");
  if (!form) return;

  const statusMessage = document.querySelector("#formStatus");
  const submitButton = document.querySelector("#submitButton");
  const senaiLogo = document.querySelector(".senai-logo");
  const senaiFallback = document.querySelector(".senai-wordmark-fallback");
  let submissionInProgress = false;

  function showSenaiFallback() {
    if (senaiLogo) senaiLogo.hidden = true;
    if (senaiFallback) senaiFallback.style.display = "inline-block";
  }

  if (senaiLogo) {
    senaiLogo.addEventListener("error", showSenaiFallback);
    if (senaiLogo.complete && senaiLogo.naturalWidth === 0) showSenaiFallback();
  }

  const FIELD_NAMES = {
    general: ["general_clarity", "general_relevance", "general_engagement", "general_duration"],
    cycles: ["cycle_1", "cycle_12", "cycle_2", "cycle_3", "cycle_4"],
    activities: ["activity_statistics", "activity_culture", "activity_cvv", "activity_digital", "activity_first_aid"],
    perception: ["perception_change", "perception_gamification", "perception_harassment"]
  };

  function selectedValue(name) {
    const selected = form.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : "";
  }

  function selectedValues(name) {
    return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
  }

  function collectAnswers() {
    return {
      formVersion: "GEPAA-2026-v1",
      submittedAt: new Date().toISOString(),
      profile: selectedValues("profile"),
      courseArea: form.elements.courseArea.value.trim(),
      shifts: selectedValues("shift"),
      general: Object.fromEntries(FIELD_NAMES.general.map((name) => [name, selectedValue(name)])),
      cycles: Object.fromEntries(FIELD_NAMES.cycles.map((name) => [name, selectedValue(name)])),
      activities: Object.fromEntries(FIELD_NAMES.activities.map((name) => [name, selectedValue(name)])),
      perception: Object.fromEntries(FIELD_NAMES.perception.map((name) => [name, selectedValue(name)])),
      comments: {
        memorable: form.elements.memorable.value.trim(),
        nextCycle: form.elements.nextCycle.value.trim(),
        suggestions: form.elements.suggestions.value.trim()
      }
    };
  }

  function setStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = "form-status";
    if (type) statusMessage.classList.add(`is-${type}`);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("");

    if (!form.reportValidity()) return;
    if (submissionInProgress) {
      setStatus("Seu envio já está sendo processado. Aguarde a confirmação.", "error");
      return;
    }

    const client = window.gepaaSupabase;
    if (!client) {
      setStatus("O recebimento ainda não está configurado. Nenhuma resposta foi enviada.", "error");
      return;
    }

    submissionInProgress = true;
    submitButton.disabled = true;
    setStatus("Enviando sua avaliação…");

    try {
      const answers = collectAnswers();
      const { error } = await client
        .from("gepaa_responses")
        .insert({ answers });

      if (error) throw error;

      setStatus("Avaliação registrada com sucesso. Obrigado pela sua participação!", "success");
      form.reset();
      statusMessage.focus();
    } catch (error) {
      console.error("Falha ao enviar avaliação GEPAA:", error);
      setStatus("Não foi possível registrar sua avaliação. Verifique sua conexão e tente novamente.", "error");
    } finally {
      submissionInProgress = false;
      submitButton.disabled = false;
    }
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => setStatus(""), 0);
  });
})();
