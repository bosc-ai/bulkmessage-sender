// Mobile nav toggle
const topbar = document.querySelector(".topbar");
const toggle = document.querySelector("[data-menu-toggle]");

if (toggle && topbar) {
  toggle.addEventListener("click", () => {
    topbar.classList.toggle("open");
  });
}

// Send demo message (whatsapp_business_messaging)
const sendDemoButton = document.querySelector("[data-send-demo]");
const demoLog        = document.querySelector("[data-demo-log]");
const demoPhone      = document.querySelector("[data-demo-phone]");

if (sendDemoButton && demoLog && demoPhone) {
  sendDemoButton.addEventListener("click", () => {
    const template  = document.querySelector("#templateName")?.value || "order_update";
    const recipient = document.querySelector("#recipient")?.value   || "+91 90000 00000";
    const now       = new Date().toISOString();

    const bubble = document.createElement("div");
    bubble.className = "bubble sent";
    bubble.textContent = `Template "${template}" sent to ${recipient}.`;
    demoPhone.appendChild(bubble);

    demoLog.textContent = [
      `POST /v20.0/{phone-number-id}/messages`,
      `time=${now}`,
      `recipient=${recipient}`,
      `template=${template}`,
      `status=queued`,
      `webhook=message_status.sent`,
      `webhook=message_status.delivered`,
      `quality_rating=green`,
      "",
      demoLog.textContent,
    ].join("\n");
  });
}

// Create template (whatsapp_business_management)
const templateForm      = document.querySelector("[data-template-form]");
const templateTableBody = document.querySelector("[data-template-table]");

if (templateForm && templateTableBody) {
  templateForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const rawName = document.querySelector("#tmpl-name")?.value || "new_template";
    const name     = rawName.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    const category = document.querySelector("#tmpl-category")?.value || "UTILITY";
    const label    = category.charAt(0) + category.slice(1).toLowerCase();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${label}</td>
      <td><span class="badge amber">Pending</span></td>
      <td>Submitted for Meta review — awaiting approval</td>
    `;
    templateTableBody.insertBefore(row, templateTableBody.firstChild);

    // Reset to defaults
    if (document.querySelector("#tmpl-name"))   document.querySelector("#tmpl-name").value   = "delivery_notification";
    if (document.querySelector("#tmpl-sample")) document.querySelector("#tmpl-sample").value = "#ORD-12345";
    if (document.querySelector("#tmpl-body"))   document.querySelector("#tmpl-body").value   =
      "Your order {{1}} has been dispatched and is on the way. Expected delivery: {{2}}. Track your package: {{3}}";

    // Scroll the template list into view so the new row is visible
    document.querySelector("#templates")?.scrollIntoView({ behavior: "smooth" });
  });
}
