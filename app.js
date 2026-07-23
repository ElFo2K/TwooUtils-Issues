(() => {
  "use strict";

  const TRACKER = "https://github.com/ElFo2K/TwooUtils-Issues";
  const DRAFT_KEY = "twoutils-bug-report-v1";
  const form = document.querySelector("#bug-form");
  const progressValue = document.querySelector("#progress-value");
  const progressBar = document.querySelector("#progress-bar");
  const titleCount = document.querySelector("#title-count");
  const submitButton = document.querySelector("#submit-report");
  const copyButton = document.querySelector("#copy-report");

  document.querySelectorAll(".tracker-issues").forEach((link) => {
    link.href = `${TRACKER}/issues`;
  });
  document.querySelector("#tracker-home").href = TRACKER;

  const fields = [
    "title", "minecraftVersion", "modVersion", "loader", "loaderVersion", "severity",
    "description", "steps", "expected", "actual", "extraMods", "evidence", "contact",
    "checkedDuplicates", "checkedPrivacy",
  ];

  const getData = () => {
    const data = Object.fromEntries(new FormData(form).entries());
    data.checkedDuplicates = form.elements.checkedDuplicates.checked;
    data.checkedPrivacy = form.elements.checkedPrivacy.checked;
    return data;
  };

  const restoreDraft = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY));
      if (!saved) return;
      fields.forEach((name) => {
        if (!(name in saved) || !form.elements[name]) return;
        if (form.elements[name].type === "checkbox") form.elements[name].checked = Boolean(saved[name]);
        else form.elements[name].value = saved[name];
      });
      if (saved.reportType) {
        const radio = form.querySelector(`[name="reportType"][value="${CSS.escape(saved.reportType)}"]`);
        if (radio) radio.checked = true;
      }
    } catch (_) {}
  };

  const updateUi = () => {
    const data = getData();
    const completed = [data.title?.trim(), data.modVersion?.trim(), data.description?.trim(), data.steps?.trim(), data.actual?.trim(), data.checkedDuplicates, data.checkedPrivacy].filter(Boolean).length;
    const progress = Math.round((completed / 7) * 100);
    progressValue.textContent = `${progress}%`;
    progressBar.style.width = `${progress}%`;
    titleCount.textContent = `${data.title?.length || 0}/110`;
    submitButton.disabled = completed !== 7;

    document.querySelectorAll(".type-card").forEach((card) => {
      card.classList.toggle("selected", card.querySelector("input").checked);
    });

    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (_) {}
  };

  const value = (text) => String(text || "").trim() || "No indicado";
  const makeBody = (data) => `## Descripción del problema
${value(data.description)}

## Pasos para reproducirlo
${value(data.steps)}

## Resultado esperado
${value(data.expected)}

## Resultado obtenido
${value(data.actual)}

## Entorno
- **Tipo de reporte:** ${data.reportType}
- **Minecraft:** ${value(data.minecraftVersion)}
- **TwooUtils:** ${value(data.modVersion)}
- **Loader:** ${value(data.loader)} ${data.loaderVersion ? `(${data.loaderVersion.trim()})` : ""}
- **Gravedad:** ${data.severity}
- **Otros mods relevantes:** ${value(data.extraMods)}

## Logs, vídeo o capturas
${value(data.evidence)}

## Contacto opcional
${value(data.contact)}

---
_Reporte generado desde el centro de errores de TwooUtils._`;

  const getIssueUrl = (data) => {
    const params = new URLSearchParams({
      title: `[${data.reportType}] ${data.title.trim()}`,
      body: makeBody(data),
      labels: "bug",
    });
    return `${TRACKER}/issues/new?${params.toString()}`;
  };

  form.addEventListener("input", updateUi);
  form.addEventListener("change", updateUi);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = getData();
    if (submitButton.disabled || !form.reportValidity()) return;
    window.open(getIssueUrl(data), "_blank", "noopener,noreferrer");
  });

  copyButton.addEventListener("click", async () => {
    const data = getData();
    try {
      await navigator.clipboard.writeText(`[${data.reportType}] ${data.title.trim()}\n\n${makeBody(data)}`);
      copyButton.textContent = "¡Copiado!";
      setTimeout(() => { copyButton.textContent = "Copiar reporte"; }, 1800);
    } catch (_) {
      copyButton.textContent = "No se pudo copiar";
      setTimeout(() => { copyButton.textContent = "Copiar reporte"; }, 1800);
    }
  });

  restoreDraft();
  updateUi();
})();
