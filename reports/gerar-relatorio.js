/* GEPAA 2026 — geração do relatório DOCX no navegador. */
(() => {
  "use strict";

  const CYCLE_RATING_LABELS = ["Ruim", "Regular", "Bom", "Excelente", "Não participei"];
  const ACTIVITY_RATING_LABELS = ["Péssimo", "Regular", "Bom", "Excelente", "Não participei"];

  function paragraph(text, options = {}) {
    const { Paragraph, TextRun, AlignmentType } = window.docx;
    return new Paragraph({
      alignment: options.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { before: options.before ?? 80, after: options.after ?? 100 },
      children: [new TextRun({
        text: String(text ?? ""),
        bold: Boolean(options.bold),
        color: options.color || "1B2B3F",
        size: options.size || 21,
        font: "Arial"
      })]
    });
  }

  function makeTable(rows) {
    const { Table, TableRow, TableCell, Paragraph, WidthType, ShadingType } = window.docx;
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: rows.map((row, index) => new TableRow({
        tableHeader: index === 0,
        children: row.map((cell) => new TableCell({
          shading: index === 0 ? { type: ShadingType.CLEAR, fill: "102B49" } : undefined,
          margins: { top: 90, bottom: 90, left: 110, right: 110 },
          children: [new Paragraph({
            children: [new window.docx.TextRun({
              text: String(cell ?? "—"),
              bold: index === 0,
              color: index === 0 ? "FFFFFF" : "1B2B3F",
              size: 18,
              font: "Arial"
            })]
          })]
        }))
      }))
    });
  }

  function canvasImage(canvas) {
    if (!canvas) return null;
    const base64 = canvas.toDataURL("image/png").split(",")[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function formatDate(value) {
    if (!value) return "Não informado";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Não informado" : new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
  }

  async function generateGepaaDocx(responses) {
    const lib = window.docx;
    if (!lib || !lib.Document || !lib.Packer) throw new Error("A biblioteca de geração do Word não foi carregada. Atualize a página e tente novamente.");
    const { Document, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType } = lib;

    const data = responses.map((row) => ({
      id: row.id,
      created_at: row.created_at,
      answers: row.answers || {}
    }));
    const total = data.length;
    const generalKeys = ["general_clarity", "general_relevance", "general_engagement", "general_duration"];
    const generalNames = ["Clareza e didática", "Relevância dos temas", "Dinâmica e engajamento", "Duração das visitas"];
    const profileOptions = [
      "Aluno(a) de Aprendizagem Industrial Básica",
      "Aluno(a) de Aprendizagem Industrial Técnica",
      "Instrutor(a) / Docente",
      "Equipe Pedagógica / Administrativa / Manutenção",
      "Membro da Equipe GEPAA 2026"
    ];
    const shiftOptions = ["Manhã", "Tarde", "Noite"];
    const profileRows = [
      ["Perfil", "Quantidade"],
      ...profileOptions.map((profile) => [profile, String(data.filter((r) => (r.answers?.profile || []).includes(profile)).length)])
    ];
    const shiftRows = [
      ["Turno", "Quantidade"],
      ...shiftOptions.map((shift) => [shift, String(data.filter((r) => (r.answers?.shifts || []).includes(shift)).length)])
    ];
    const averages = generalKeys.map((key, index) => {
      const values = data.map((r) => Number(r.answers?.general?.[key])).filter((n) => Number.isFinite(n) && n >= 1 && n <= 5);
      const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
      return [generalNames[index], average === null ? "Sem respostas" : average.toFixed(2).replace(".", ","), String(values.length)];
    });

    const cycleMeta = [
      ["Ciclo 1 — Esse Lance é Seguro", "cycle_1"],
      ["Ciclo 1.2 — Alunos Novos", "cycle_12"],
      ["Ciclo 2 — Vale Dar um Jeitinho?", "cycle_2"],
      ["Ciclo 3 — Jogo Limpo da Segurança", "cycle_3"],
      ["Ciclo 4 — Cuide de Você", "cycle_4"]
    ];
    const activityMeta = [
      ["Estatísticas de Segurança", "activity_statistics"],
      ["Cultura de Segurança do Trabalho", "activity_culture"],
      ["CVV — Centro de Valorização da Vida", "activity_cvv"],
      ["Segurança Digital", "activity_digital"],
      ["Primeiros Socorros", "activity_first_aid"]
    ];
    const distributionRows = (meta, group, labels) => [
      ["Atividade / ciclo", ...labels],
      ...meta.map(([name, key]) => [name, ...labels.map((label) => data.filter((r) => r.answers?.[group]?.[key] === label).length)])
    ];

    const children = [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "SENAI CARLOS TANNHAUSER", bold: true, color: "007FBA", size: 22, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, heading: HeadingLevel.TITLE, spacing: { after: 100 }, children: [new TextRun({ text: "RELATÓRIO DE AVALIAÇÃO", bold: true, color: "102B49", size: 36, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 260 }, children: [new TextRun({ text: "GEPAA 2026 · Copa da Segurança", color: "F04B23", bold: true, size: 25, font: "Arial" })] }),
      paragraph(`Relatório gerado em ${formatDate(new Date().toISOString())}.`, { center: true, color: "66778C", size: 18, after: 280 }),
      new Paragraph({ text: "Resumo executivo", heading: HeadingLevel.HEADING_1 }),
      paragraph(`Total de avaliações recebidas: ${total}.`),
      paragraph("As médias abaixo consideram somente as notas numéricas informadas na escala de 1 a 5. Respostas em branco não entram no cálculo."),
      new Paragraph({ text: "Perfil dos participantes", heading: HeadingLevel.HEADING_2 }),
      makeTable(profileRows),
      new Paragraph({ text: "Distribuição por turno", heading: HeadingLevel.HEADING_2 }),
      makeTable(shiftRows),
      new Paragraph({ text: "Médias da avaliação geral", heading: HeadingLevel.HEADING_2 }),
      makeTable([["Critério", "Média", "Respostas válidas"], ...averages]),
      new Paragraph({ text: "Avaliação dos ciclos de Conversas Seguras", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
      makeTable(distributionRows(cycleMeta, "cycles", CYCLE_RATING_LABELS)),
      new Paragraph({ text: "Visitas técnicas, eventos e capacitações", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
      makeTable(distributionRows(activityMeta, "activities", ACTIVITY_RATING_LABELS)),
      new Paragraph({ text: "Percepção de mudança de comportamento e cultura", heading: HeadingLevel.HEADING_1, pageBreakBefore: true })
    ];

    const perceptionLabels = [
      ["Mudanças nas práticas de segurança", "perception_change"],
      ["Gamificação Copa da Segurança", "perception_gamification"],
      ["Prevenção ao assédio e comunicação respeitosa", "perception_harassment"]
    ];
    for (const [label, key] of perceptionLabels) {
      const counts = new Map();
      data.forEach((r) => {
        const value = r.answers?.perception?.[key];
        if (value) counts.set(value, (counts.get(value) || 0) + 1);
      });
      children.push(paragraph(label, { bold: true, color: "102B49", before: 140 }));
      if (!counts.size) children.push(paragraph("Sem respostas registradas."));
      for (const [value, count] of counts.entries()) children.push(paragraph(`${count} resposta(s) — ${value}`));
    }

    children.push(new Paragraph({ text: "Sugestões, elogios e críticas", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }));
    const commentGroups = [
      ["Ação ou tema mais marcante", "memorable"],
      ["Temas ou atividades para 2027", "nextCycle"],
      ["Comentários e sugestões de melhoria", "suggestions"]
    ];
    for (const [label, key] of commentGroups) {
      children.push(paragraph(label, { bold: true, color: "007FBA", before: 160 }));
      const comments = data.map((r) => r.answers?.comments?.[key]).filter((value) => typeof value === "string" && value.trim());
      if (!comments.length) children.push(paragraph("Nenhum comentário registrado."));
      comments.forEach((comment, index) => children.push(paragraph(`${index + 1}. ${comment}`, { size: 19 })));
    }

    children.push(new Paragraph({ text: "Gráficos consolidados", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }));
    for (const [id, label] of [
      ["generalChart", "Média dos critérios gerais"],
      ["cyclesChart", "Distribuição das avaliações dos ciclos"],
      ["activitiesChart", "Distribuição das avaliações das atividades"]
    ]) {
      const bytes = canvasImage(document.getElementById(id));
      if (bytes) {
        children.push(paragraph(label, { bold: true, color: "102B49", before: 180 }));
        children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: "png", data: bytes, transformation: { width: 600, height: id === "activitiesChart" ? 300 : 270 } })] }));
      }
    }

    children.push(new Paragraph({ spacing: { before: 280 }, children: [new TextRun({ text: "SENAI Carlos Tannhauser — GEPAA 2026", bold: true, color: "007FBA", size: 18, font: "Arial" })] }));

    const doc = new Document({
      creator: "GEPAA 2026 — SENAI Carlos Tannhauser",
      title: "Relatório de Avaliação GEPAA 2026",
      subject: "Consolidação das avaliações das atividades do GEPAA",
      sections: [{ properties: { page: { margin: { top: 850, right: 900, bottom: 850, left: 900 } } }, children }]
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-gepaa-2026-${new Date().toISOString().slice(0, 10)}.docx`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  window.GEPAADocxReport = { generateGepaaDocx };
})();
