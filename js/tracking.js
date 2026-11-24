/**
 * Tracking for the gift-card hosts only.
 *
 * The German and Danish gift sites share this repo and HTML. GTM, Consent
 * Mode and the banner run only on gutschein.chefmade.de and
 * gavekort.chefmade.dk — never on any other host.
 *
 * chefmade.de / chefmade.dk use a custom cookie banner (CookieYes is only a
 * leftover preconnect, not the CMP) and cookie_consent = {analytics,
 * marketing}. This file mirrors that consent model and cookie shape, with
 * Consent Mode v2 defaults set before GTM loads. The container is inserted
 * in JS rather than as a static noscript snippet, so the shared HTML cannot
 * fire the wrong container when JS is off.
 *
 *   gutschein.chefmade.de  → GTM-5F56QXJ6, DE/EN banner, EUR
 *   gavekort.chefmade.dk   → GTM-NB3Z824,  DA/EN banner, DKK
 */
(function (global) {
  var COOKIE_NAME = "cookie_consent";
  var CALLBACK_MS = 800;

  var EN_COPY = {
    text: "We use cookies to improve your experience. Manage your settings below.",
    accept: "Accept all",
    reject: "Reject all",
    manage: "Manage settings",
    title: "Manage cookie settings",
    intro: "Choose which types of cookies should be enabled.",
    analytics: "Allow analytics cookies",
    marketing: "Allow marketing cookies",
    save: "Save settings",
    cancel: "Cancel"
  };

  var SITES = {
    "gutschein.chefmade.de": {
      gtmId: "GTM-5F56QXJ6",
      currency: "EUR",
      itemName: "Chefmade Gutschein",
      copy: {
        en: EN_COPY,
        de: {
          text: "Wir verwenden Cookies, um deine Erfahrung zu verbessern. Verwalte deine Einstellungen unten.",
          accept: "Alle akzeptieren",
          reject: "Alle ablehnen",
          manage: "Einstellungen verwalten",
          title: "Cookie-Einstellungen verwalten",
          intro: "Wähle aus, welche Arten von Cookies aktiviert werden sollen.",
          analytics: "Analytics-Cookies erlauben",
          marketing: "Marketing-Cookies erlauben",
          save: "Einstellungen speichern",
          cancel: "Abbrechen"
        }
      }
    },
    "gavekort.chefmade.dk": {
      gtmId: "GTM-NB3Z824",
      currency: "DKK",
      itemName: "Chefmade Gavekort",
      copy: {
        en: EN_COPY,
        da: {
          text: "Vi bruger cookies for at forbedre din oplevelse. Administrer dine indstillinger nedenfor.",
          accept: "Accepter alle",
          reject: "Afvis alle",
          manage: "Administrer indstillinger",
          title: "Administrer cookieindstillinger",
          intro: "Vælg, hvilke typer cookies der skal aktiveres.",
          analytics: "Tillad analytics-cookies",
          marketing: "Tillad marketing-cookies",
          save: "Gem indstillinger",
          cancel: "Annuller"
        }
      }
    }
  };

  function siteConfig() {
    try {
      var host = (global.location && global.location.hostname || "").toLowerCase();
      return SITES[host] || null;
    } catch (e) {
      return null;
    }
  }

  function beginCheckoutNoop() {
    return Promise.resolve();
  }

  var site = siteConfig();
  if (!site) {
    global.GavekortTracking = {
      enabled: false,
      beginCheckout: beginCheckoutNoop
    };
    return;
  }

  var GTM_ID = site.gtmId;

  global.dataLayer = global.dataLayer || [];
  function gtag() {
    global.dataLayer.push(arguments);
  }
  global.gtag = global.gtag || gtag;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    personalization_storage: "denied",
    functionality_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500
  });

  function getCookie(name) {
    try {
      var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? decodeURIComponent(match[2]) : null;
    } catch (e) {
      return null;
    }
  }

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      expires +
      "; path=/; SameSite=Lax; Secure";
  }

  function readConsent() {
    var raw = getCookie(COOKIE_NAME);
    if (!raw) return null;
    try {
      var parsed = JSON.parse(raw);
      return {
        analytics: !!parsed.analytics,
        marketing: !!parsed.marketing
      };
    } catch (e) {
      return null;
    }
  }

  function applyConsentUpdate(consent) {
    if (!consent) return;
    var analytics = consent.analytics ? "granted" : "denied";
    var marketing = consent.marketing ? "granted" : "denied";
    gtag("consent", "update", {
      analytics_storage: analytics,
      ad_storage: marketing,
      ad_user_data: marketing,
      ad_personalization: marketing,
      personalization_storage: marketing,
      functionality_storage: marketing,
      security_storage: "granted"
    });
  }

  var existing = readConsent();
  if (existing) applyConsentUpdate(existing);

  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0];
    var j = d.createElement(s);
    var dl = l !== "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(global, document, "script", "dataLayer", GTM_ID);

  function copy() {
    var lang = (document.documentElement.lang || "").toLowerCase();
    if (lang.indexOf("en") === 0 && site.copy.en) return site.copy.en;
    if (lang.indexOf("da") === 0 && site.copy.da) return site.copy.da;
    if (lang.indexOf("de") === 0 && site.copy.de) return site.copy.de;
    return site.copy.da || site.copy.de || site.copy.en;
  }

  function injectStyles() {
    if (document.getElementById("cm-consent-styles")) return;
    var style = document.createElement("style");
    style.id = "cm-consent-styles";
    style.textContent =
      "#cm-consent-banner{position:fixed;bottom:16px;left:16px;right:16px;z-index:9999;background:#fff;color:#221a19;border:1px solid #d7d0c8;border-radius:16px;box-shadow:0 12px 40px rgba(34,26,25,.16);padding:16px 20px;display:flex;flex-wrap:wrap;gap:12px 16px;align-items:center;justify-content:space-between;font-family:inherit;}" +
      "#cm-consent-banner[hidden],#cm-consent-modal[hidden]{display:none !important;}" +
      "#cm-consent-banner .cm-consent-text{flex:1;min-width:220px;font-size:14px;line-height:1.45;}" +
      "#cm-consent-banner .cm-consent-actions,#cm-consent-modal .cm-consent-actions{display:flex;flex-wrap:wrap;gap:8px;}" +
      "#cm-consent-banner button,#cm-consent-modal button{font:inherit;font-size:14px;font-weight:700;border:0;border-radius:999px;padding:10px 16px;cursor:pointer;}" +
      "#cm-consent-banner .cm-accept,#cm-consent-modal .cm-save{background:linear-gradient(90deg,#577f67,#097032);color:#fff;}" +
      "#cm-consent-banner .cm-reject,#cm-consent-modal .cm-cancel{background:#ece8e3;color:#221a19;}" +
      "#cm-consent-banner .cm-manage{background:#221a19;color:#fff;}" +
      "#cm-consent-modal{position:fixed;inset:0;z-index:10000;background:rgba(34,26,25,.5);display:flex;align-items:center;justify-content:center;padding:16px;}" +
      "#cm-consent-modal .cm-consent-card{background:#fff;color:#221a19;border-radius:16px;max-width:420px;width:100%;padding:24px;box-shadow:0 12px 40px rgba(34,26,25,.2);}" +
      "#cm-consent-modal h2{margin:0 0 8px;font-size:18px;}" +
      "#cm-consent-modal p{margin:0 0 16px;font-size:14px;line-height:1.45;}" +
      "#cm-consent-modal label{display:flex;gap:8px;align-items:center;margin:0 0 8px;font-size:14px;}";
    (document.head || document.documentElement).appendChild(style);
  }

  function saveConsent(analytics, marketing) {
    var consent = { analytics: !!analytics, marketing: !!marketing };
    setCookie(COOKIE_NAME, JSON.stringify(consent), 365);
    applyConsentUpdate(consent);
    var banner = document.getElementById("cm-consent-banner");
    var modal = document.getElementById("cm-consent-modal");
    if (banner) banner.hidden = true;
    if (modal) modal.hidden = true;
  }

  function renderBanner() {
    injectStyles();
    if (document.getElementById("cm-consent-banner")) return;
    var t = copy();
    var banner = document.createElement("div");
    banner.id = "cm-consent-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML =
      '<div class="cm-consent-text">' + t.text + "</div>" +
      '<div class="cm-consent-actions">' +
      '<button type="button" class="cm-accept" id="cm-accept-all">' + t.accept + "</button>" +
      '<button type="button" class="cm-reject" id="cm-reject-all">' + t.reject + "</button>" +
      '<button type="button" class="cm-manage" id="cm-manage">' + t.manage + "</button>" +
      "</div>";

    var modal = document.createElement("div");
    modal.id = "cm-consent-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="cm-consent-card" role="dialog" aria-modal="true" aria-labelledby="cm-consent-title">' +
      '  <h2 id="cm-consent-title">' + t.title + "</h2>" +
      "  <p>" + t.intro + "</p>" +
      '  <label><input type="checkbox" id="cm-analytics-checkbox"> ' + t.analytics + "</label>" +
      '  <label><input type="checkbox" id="cm-marketing-checkbox"> ' + t.marketing + "</label>" +
      '  <div class="cm-consent-actions">' +
      '    <button type="button" class="cm-save" id="cm-save">' + t.save + "</button>" +
      '    <button type="button" class="cm-cancel" id="cm-cancel">' + t.cancel + "</button>" +
      "  </div>" +
      "</div>";

    document.body.appendChild(banner);
    document.body.appendChild(modal);

    document.getElementById("cm-accept-all").addEventListener("click", function () {
      saveConsent(true, true);
    });
    document.getElementById("cm-reject-all").addEventListener("click", function () {
      saveConsent(false, false);
    });
    document.getElementById("cm-manage").addEventListener("click", function () {
      modal.hidden = false;
    });
    document.getElementById("cm-cancel").addEventListener("click", function () {
      modal.hidden = true;
    });
    document.getElementById("cm-save").addEventListener("click", function () {
      saveConsent(
        document.getElementById("cm-analytics-checkbox").checked,
        document.getElementById("cm-marketing-checkbox").checked
      );
    });
  }

  function initBanner() {
    if (readConsent()) return;
    renderBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBanner);
  } else {
    initBanner();
  }

  function beginCheckout(details) {
    details = details || {};
    var value = Number(details.value);
    if (!isFinite(value)) value = 0;
    var price = details.price != null ? Number(details.price) : value;
    if (!isFinite(price)) price = value;

    return new Promise(function (resolve) {
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        resolve();
      }
      setTimeout(finish, CALLBACK_MS);
      try {
        global.dataLayer = global.dataLayer || [];
        global.dataLayer.push({
          event: "begin_checkout",
          currency: site.currency,
          value: value,
          items: [
            {
              item_name: site.itemName,
              price: price,
              quantity: 1
            }
          ],
          eventCallback: finish,
          eventTimeout: CALLBACK_MS
        });
      } catch (e) {
        finish();
      }
    });
  }

  global.GavekortTracking = {
    enabled: true,
    beginCheckout: beginCheckout
  };
})(window);
