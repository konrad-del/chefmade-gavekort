(function () {
  const P = window.GavekortPricing;
  const cfg = window.GAVEKORT_CONFIG || {};
  const site = window.GAVEKORT_SITE || {};
  const I = window.GavekortI18n;
  const t = (key, vars) => (I && I.t) ? I.t(key, vars) : key;
  const currency = site.currency || cfg.currency || "dkk";

  function money(amount) {
    return P.formatAmount(amount, currency);
  }

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
      return { total: amount, perPerson: null, guests: null, styleId: null, currency: currency, custom: true };
    }
    return P.quote(state.styleId, state.guests, currency);
  }

  function styleName(id) {
    const s = P.STYLES.find((x) => x.id === id);
    return s ? s.name : "";
  }

  function renderStyles() {
    els.styleList.innerHTML = P.STYLES.map((s) => {
      const q = P.quote(s.id, state.guests, currency);
      const selected = s.id === state.styleId;
      return `<label class="style-row ${selected ? "is-selected" : ""}">
        <input type="radio" name="style" value="${s.id}" ${selected ? "checked" : ""}>
        <span class="style-name">${s.name}</span>
        <span class="style-price">
          <span class="pp">${money(q.perPerson)} ${t("style.pp")}</span>
          <span class="tot">${money(q.total)} ${t("style.total")}</span>
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
    els.amountChips.innerHTML = (P.suggestedAmounts ? P.suggestedAmounts(currency) : P.SUGGESTED_AMOUNTS_DKK).map((n) => {
      const selected = Number(state.customAmount) === n;
      return `<button type="button" class="chip ${selected ? "is-selected" : ""}" data-amount="${n}">${money(n)}</button>`;
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
    const name = state.recipient.trim() || t("preview.someone");
    els.previewName.textContent = name;
    const msg = state.message.trim();
    els.previewMessage.textContent = msg;
    els.previewMessage.hidden = !msg;

    if (q) {
      els.previewAmount.textContent = money(q.total);
      els.previewAmount.hidden = false;
      if (q.custom) {
        els.previewMeta.textContent = t("preview.voucher");
      } else {
        const guestWord = q.guests === 1 ? t("preview.guestOne") : t("preview.guestMany");
        els.previewMeta.textContent = t("preview.dinner", { style: styleName(q.styleId), count: q.guests, guestWord });
      }
      els.previewMeta.hidden = false;
      els.payLabel.textContent = `${t("pay.continue")} · ${money(q.total)}`;
      els.payBtn.disabled = false;
    } else {
      els.previewAmount.hidden = true;
      els.previewMeta.hidden = true;
      els.payLabel.textContent = t("pay.continue");
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
      site.referencePrefix || "gk",
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
      _subject: "New gift card order — " + money(q.total),
      _template: "table",
      _captcha: "false",
      _honey: "",
      _replyto: state.buyerEmail.trim() || undefined,
      gift_type: q.custom ? "Gift an amount" : "Gift a whole dinner",
      guests: q.custom ? "—" : String(state.guests),
      style: q.custom ? "—" : styleName(q.styleId),
      amount: money(q.total),
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
      openDialog("<p>" + t("dialog.chooseAmount") + "</p>");
      return;
    }
    const min = site.minCustomAmount || cfg.minCustomAmount || cfg.minCustomAmountDkk || 0;
    const max = site.maxCustomAmount || cfg.maxCustomAmount || cfg.maxCustomAmountDkk || 0;
    if (state.path === "amount" && (q.total < min || (max && q.total > max))) {
      openDialog("<p>" + t("dialog.amountRange", { min: money(min), max: money(max) }) + "</p>");
      return;
    }

    const email = state.buyerEmail.trim();
    const link = (cfg.paymentLinkUrl || "").trim();

    if (!link) {
      openDialog(`
        <h3>${t("dialog.noLinkTitle")}</h3>
        <p>${t("dialog.noLinkBody")}</p>
        <dl class="summary">
          <dt>Amount</dt><dd>${money(q.total)}</dd>
          <dt>Type</dt><dd>${q.custom ? t("path.amount.title") : `${styleName(q.styleId)} · ${q.guests} ${q.guests === 1 ? t("preview.guestOne") : t("preview.guestMany")}`}</dd>
          <dt>For</dt><dd>${state.recipient.trim() || "—"}</dd>
          <dt>Message</dt><dd>${state.message.trim() || "—"}</dd>
          <dt>Delivery</dt><dd>${state.delivery === "physical" ? t("delivery.physical.title") : t("delivery.digital.title")}</dd>
          <dt>Buyer</dt><dd>${state.buyerName || "—"} · ${email || "—"} · ${state.buyerPhone || "—"}</dd>
        </dl>
      `);
      return;
    }

    const url = new URL(link);
    url.searchParams.set("prefilled_amount", String(Math.round(q.total * 100)));
    if (email) url.searchParams.set("prefilled_email", email);
    url.searchParams.set("client_reference_id", buildReference(q));
    const localeMap = site.stripeLocale || {};
    const locale = I && localeMap[I.getLang()];
    if (locale) url.searchParams.set("locale", locale);

    const payload = collectOrderPayload(q);
    els.payBtn.disabled = true;
    const notifyDone = Promise.race([
      notifyKonrad(payload),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]);
    const trackingDone = (window.GavekortTracking && typeof window.GavekortTracking.beginCheckout === "function")
      ? window.GavekortTracking.beginCheckout({ value: q.total, price: q.total })
      : Promise.resolve();
    Promise.all([notifyDone, trackingDone]).finally(() => {
      window.location.href = url.toString();
    });
  }

  function bind() {
    if (els.customAmount) {
      const min = site.minCustomAmount || cfg.minCustomAmount || 0;
      const max = site.maxCustomAmount || cfg.maxCustomAmount || 0;
      if (min) els.customAmount.min = String(min);
      if (max) els.customAmount.max = String(max);
    }
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


  if (I && I.onChange) {
    I.onChange(() => {
      renderStyles();
      renderAmountChips();
      renderPreview();
    });
  }

  bind();
  setPath("dinner");
  const params = new URLSearchParams(location.search);
  if (params.get("demo") === "1") {
    els.recipient.value = "Anna";
    state.recipient = "Anna";
    els.message.value = t("demo.message");
    state.message = els.message.value;
    renderPreview();
  }
})();
