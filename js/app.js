(function () {
  const P = window.GavekortPricing;
  const cfg = window.GAVEKORT_CONFIG || {};

  const state = {
    path: "dinner", // "dinner" | "amount"
    guests: P.DEFAULT_GUESTS,
    styleId: P.DEFAULT_STYLE,
    customAmount: null,
    recipient: "",
    message: "",
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    delivery: "digital"
  };

  const els = {
    pathInputs: () => document.querySelectorAll('input[name="gift-path"]'),
    amountPanel: document.getElementById("panel-amount"),
    dinnerPanel: document.getElementById("panel-dinner"),
    guestsValue: document.getElementById("guests-value"),
    guestsDec: document.getElementById("guests-dec"),
    guestsInc: document.getElementById("guests-inc"),
    styleList: document.getElementById("style-list"),
    amountChips: document.getElementById("amount-chips"),
    customAmount: document.getElementById("custom-amount"),
    recipient: document.getElementById("recipient"),
    message: document.getElementById("message"),
    messageCount: document.getElementById("message-count"),
    buyerName: document.getElementById("buyer-name"),
    buyerEmail: document.getElementById("buyer-email"),
    buyerPhone: document.getElementById("buyer-phone"),
    payBtn: document.getElementById("pay-btn"),
    payLabel: document.getElementById("pay-label"),
    previewName: document.getElementById("preview-name"),
    previewMessage: document.getElementById("preview-message"),
    previewAmount: document.getElementById("preview-amount"),
    previewMeta: document.getElementById("preview-meta"),
    dialog: document.getElementById("pay-dialog"),
    dialogBody: document.getElementById("pay-dialog-body"),
    dialogClose: document.getElementById("pay-dialog-close")
  };

  function currentQuote() {
    if (state.path === "amount") {
      const amount = Number(state.customAmount);
      if (!amount || amount <= 0) return null;
      return { total: amount, perPerson: null, guests: null, styleId: null, currency: "dkk", custom: true };
    }
    return P.quote(state.styleId, state.guests, "dkk");
  }

  function styleName(id) {
    const s = P.STYLES.find((x) => x.id === id);
    return s ? s.name : "";
  }

  function renderStyles() {
    els.styleList.innerHTML = P.STYLES.map((s) => {
      const q = P.quote(s.id, state.guests, "dkk");
      const selected = s.id === state.styleId;
      return `<label class="style-row ${selected ? "is-selected" : ""}">
        <input type="radio" name="style" value="${s.id}" ${selected ? "checked" : ""}>
        <span class="style-name">${s.name}</span>
        <span class="style-price">
          <span class="pp">${P.formatAmount(q.perPerson, "dkk")} pp</span>
          <span class="tot">${P.formatAmount(q.total, "dkk")} total</span>
        </span>
      </label>`;
    }).join("");
    els.styleList.querySelectorAll('input[name="style"]').forEach((input) => {
      input.addEventListener("change", () => {
        state.styleId = input.value;
        renderStyles();
        renderPreview();
      });
    });
  }

  function renderAmountChips() {
    if (!els.amountChips) return;
    els.amountChips.innerHTML = P.SUGGESTED_AMOUNTS_DKK.map((n) => {
      const selected = Number(state.customAmount) === n;
      return `<button type="button" class="chip ${selected ? "is-selected" : ""}" data-amount="${n}">${P.formatAmount(n, "dkk")}</button>`;
    }).join("");
    els.amountChips.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.customAmount = Number(btn.dataset.amount);
        els.customAmount.value = String(state.customAmount);
        renderAmountChips();
        renderPreview();
      });
    });
  }

  function renderPreview() {
    const q = currentQuote();
    const name = state.recipient.trim() || "Someone special";
    els.previewName.textContent = name;
    const msg = state.message.trim();
    els.previewMessage.textContent = msg;
    els.previewMessage.hidden = !msg;

    if (q) {
      els.previewAmount.textContent = P.formatAmount(q.total, "dkk");
      els.previewAmount.hidden = false;
      if (q.custom) {
        els.previewMeta.textContent = "Gift voucher";
      } else {
        els.previewMeta.textContent = `${styleName(q.styleId)} for ${q.guests} guest${q.guests === 1 ? "" : "s"}`;
      }
      els.previewMeta.hidden = false;
      els.payLabel.textContent = `Continue to payment · ${P.formatAmount(q.total, "dkk")}`;
      els.payBtn.disabled = false;
    } else {
      els.previewAmount.hidden = true;
      els.previewMeta.hidden = true;
      els.payLabel.textContent = "Continue to payment";
      els.payBtn.disabled = state.path === "amount";
    }

    els.guestsValue.textContent = String(state.guests);
    els.guestsDec.disabled = state.guests <= P.MIN_GUESTS;
    els.guestsInc.disabled = state.guests >= P.MAX_GUESTS;
    if (els.messageCount) {
      els.messageCount.textContent = state.message.length + "/40";
    }
  }

  function setPath(path) {
    state.path = path;
    document.querySelectorAll(".path-card").forEach((card) => {
      card.classList.toggle("is-selected", card.dataset.path === path);
    });
    els.amountPanel.hidden = path !== "amount";
    els.dinnerPanel.hidden = path !== "dinner";
    renderStyles();
    renderAmountChips();
    renderPreview();
  }

  function buildReference(q) {
    const parts = [
      "gk",
      state.path,
      q.custom ? "custom" : state.styleId,
      q.custom ? "" : String(state.guests),
      String(q.total),
      state.delivery
    ].filter(Boolean);
    const name = state.recipient.trim().replace(/[^a-zA-Z0-9æøåÆØÅ _-]/g, "").slice(0, 40);
    if (name) parts.push(name);
    return parts.join("_").slice(0, 200);
  }

  function openDialog(html) {
    els.dialogBody.innerHTML = html;
    els.dialog.showModal();
  }


  function berlinTimestamp() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Berlin",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).formatToParts(new Date());
    const g = (t) => parts.find((p) => p.type === t).value;
    return `${g("year")}-${g("month")}-${g("day")} ${g("hour")}:${g("minute")}:${g("second")} Europe/Berlin`;
  }

  function collectOrderPayload(q) {
    return {
      _subject: "New gift card order — " + P.formatAmount(q.total, "dkk"),
      _template: "table",
      _captcha: "false",
      _honey: "",
      _replyto: state.buyerEmail.trim() || undefined,
      gift_type: q.custom ? "Gift an amount" : "Gift a whole dinner",
      guests: q.custom ? "—" : String(state.guests),
      style: q.custom ? "—" : styleName(q.styleId),
      amount: P.formatAmount(q.total, "dkk"),
      recipient_name: state.recipient.trim() || "—",
      personal_message: state.message.trim() || "—",
      buyer_name: state.buyerName.trim() || "—",
      email: state.buyerEmail.trim() || "—",
      phone: state.buyerPhone.trim() || "—",
      delivery: state.delivery === "physical" ? "Physical" : "Digital",
      timestamp: berlinTimestamp()
    };
  }

  function notifyKonrad(payload) {
    const url = "https://formsubmit.co/ajax/konrad@chefmade.dk";
    const body = JSON.stringify(payload);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body,
      signal: controller.signal,
      keepalive: true
    }).catch(() => {}).finally(() => clearTimeout(timer));
  }

  function goToPayment() {
    const q = currentQuote();
    if (!q || !q.total) {
      openDialog("<p>Please choose a gift amount, or pick the number of guests and a style.</p>");
      return;
    }
    const min = cfg.minCustomAmountDkk || 0;
    const max = cfg.maxCustomAmountDkk || 0;
    if (state.path === "amount" && (q.total < min || (max && q.total > max))) {
      openDialog(`<p>Please choose an amount between ${P.formatAmount(min, "dkk")} and ${P.formatAmount(max, "dkk")}.</p>`);
      return;
    }

    const email = state.buyerEmail.trim();
    const link = (cfg.paymentLinkUrl || "").trim();

    if (!link) {
      openDialog(`
        <h3>Payment link not connected yet</h3>
        <p>This preview is ready, but no Stripe <strong>test-mode</strong> Payment Link has been created. The Chefmade Stripe connector is currently live-only, and no live objects were created.</p>
        <p>When a test Payment Link is available, this button will open it with the amount below already filled in. The buyer can still edit a pay-what-you-want amount, so the team should check the paid amount against the order.</p>
        <dl class="summary">
          <dt>Amount</dt><dd>${P.formatAmount(q.total, "dkk")}</dd>
          <dt>Type</dt><dd>${q.custom ? "Chosen amount" : `${styleName(q.styleId)} · ${q.guests} guests`}</dd>
          <dt>For</dt><dd>${state.recipient.trim() || "—"}</dd>
          <dt>Message</dt><dd>${state.message.trim() || "—"}</dd>
          <dt>Delivery</dt><dd>${state.delivery === "physical" ? "Physical" : "Digital"}</dd>
          <dt>Buyer</dt><dd>${state.buyerName || "—"} · ${email || "—"} · ${state.buyerPhone || "—"}</dd>
        </dl>
        <p class="fine">Recipient, message and Digital/Physical will also be collected as Stripe custom fields on the Payment Link, once it exists.</p>
      `);
      return;
    }

    const url = new URL(link);
    url.searchParams.set("prefilled_amount", String(Math.round(q.total * 100)));
    if (email) url.searchParams.set("prefilled_email", email);
    url.searchParams.set("client_reference_id", buildReference(q));

    const payload = collectOrderPayload(q);
    els.payBtn.disabled = true;
    Promise.race([
      notifyKonrad(payload),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]).finally(() => {
      window.location.href = url.toString();
    });
  }

  function bind() {
    els.pathInputs().forEach((input) => {
      input.addEventListener("change", () => setPath(input.value));
    });
    document.querySelectorAll(".path-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("input")) return;
        const input = card.querySelector("input");
        input.checked = true;
        setPath(input.value);
      });
    });
    els.guestsDec.addEventListener("click", () => {
      state.guests = Math.max(P.MIN_GUESTS, state.guests - 1);
      renderStyles();
      renderPreview();
    });
    els.guestsInc.addEventListener("click", () => {
      state.guests = Math.min(P.MAX_GUESTS, state.guests + 1);
      renderStyles();
      renderPreview();
    });
    els.customAmount.addEventListener("input", () => {
      const v = els.customAmount.value.replace(/[^\d]/g, "");
      state.customAmount = v ? Number(v) : null;
      renderAmountChips();
      renderPreview();
    });
    els.recipient.addEventListener("input", () => {
      state.recipient = els.recipient.value;
      renderPreview();
    });
    els.message.addEventListener("input", () => {
      state.message = els.message.value.slice(0, 40);
      if (els.message.value !== state.message) els.message.value = state.message;
      renderPreview();
    });
    els.buyerName.addEventListener("input", () => { state.buyerName = els.buyerName.value; });
    els.buyerEmail.addEventListener("input", () => { state.buyerEmail = els.buyerEmail.value; });
    els.buyerPhone.addEventListener("input", () => { state.buyerPhone = els.buyerPhone.value; });
    document.querySelectorAll('input[name="delivery"]').forEach((input) => {
      input.addEventListener("change", () => { state.delivery = input.value; });
    });
    document.querySelectorAll(".delivery-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("input")) return;
        const input = card.querySelector("input");
        input.checked = true;
        state.delivery = input.value;
        document.querySelectorAll(".delivery-card").forEach((c) => {
          c.classList.toggle("is-selected", c === card);
        });
      });
    });
    els.payBtn.addEventListener("click", (e) => {
      e.preventDefault();
      goToPayment();
    });
    if (els.dialogClose) {
      els.dialogClose.addEventListener("click", () => els.dialog.close());
    }
    els.dialog.addEventListener("click", (e) => {
      if (e.target === els.dialog) els.dialog.close();
    });

    document.querySelectorAll(".faq-item button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const open = item.classList.contains("is-open");
        document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("is-open"));
        if (!open) item.classList.add("is-open");
      });
    });
  }


  bind();
  setPath("dinner");
  const params = new URLSearchParams(location.search);
  if (params.get("demo") === "1") {
    els.recipient.value = "Anna";
    state.recipient = "Anna";
    els.message.value = "Happy 40th — let’s celebrate together";
    state.message = els.message.value;
    renderPreview();
  }
})();
