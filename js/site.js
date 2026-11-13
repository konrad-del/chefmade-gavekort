/**
 * Hostname (or ?site=dk|de) switch for the shared Chefmade gift-card site.
 * DK: gavekort.chefmade.dk and chefmade-gavekort-*.ondigitalocean.app
 * DE: gutschein.chefmade.de (pending) and chefmade-gutschein-*.ondigitalocean.app
 */
(function (global) {
  const SITES = {
    dk: {
      id: "dk",
      defaultLang: "da",
      langs: ["da", "en"],
      currency: "dkk",
      currencyUnit: { da: "kr.", en: "DKK" },
      paymentLinkUrl: "https://buy.stripe.com/00waEXe73fQFexz47WaMV1B",
      minCustomAmount: 500,
      maxCustomAmount: 50000,
      hintMinAmount: 8000,
      successPath: "tak.html",
      homeUrl: "https://chefmade.dk",
      businessMailto: "info@chefmade.dk",
      stripeLocale: { da: "da" },
      referencePrefix: "gk"
    },
    de: {
      id: "de",
      defaultLang: "de",
      langs: ["de", "en"],
      currency: "eur",
      currencyUnit: { de: "€", en: "€" },
      paymentLinkUrl: "https://buy.stripe.com/7sY4gzbYVcEtblnfQEaMV1C",
      /* PLACEHOLDER: confirm EUR custom minimum with Konrad. */
      minCustomAmount: 50,
      maxCustomAmount: 5000,
      /* PLACEHOLDER: EUR figure for “Most chefs’ minimum fees…” is unknown. */
      hintMinAmount: 1000,
      successPath: "tak.html",
      homeUrl: "https://chefmade.de",
      businessMailto: "info@chefmade.dk",
      stripeLocale: { de: "de" },
      referencePrefix: "gs"
    }
  };

  function detectSiteId() {
    try {
      const q = new URLSearchParams(location.search).get("site");
      if (q === "de" || q === "dk") return q;
      const host = (location.hostname || "").toLowerCase();
      if (
        host === "chefmade.de" ||
        host.endsWith(".chefmade.de") ||
        host.indexOf("gutschein") !== -1 ||
        host.indexOf("chefmade-gutschein") !== -1
      ) {
        return "de";
      }
    } catch (e) {}
    return "dk";
  }

  const site = Object.assign({}, SITES[detectSiteId()] || SITES.dk);

  function storageKey() {
    return "gavekort-lang-" + site.id;
  }

  function applyChrome() {
    const I = global.GavekortI18n;
    const lang = (I && I.getLang && I.getLang()) || document.documentElement.lang || site.defaultLang;
    document.documentElement.setAttribute("data-site", site.id);
    document.querySelectorAll("[data-home]").forEach((el) => {
      el.setAttribute("href", site.homeUrl);
    });
    document.querySelectorAll("[data-footer-site]").forEach((el) => {
      el.hidden = el.getAttribute("data-footer-site") !== site.id;
    });
    document.querySelectorAll(".footer-legal-links a[href]").forEach((el) => {
      el.setAttribute(
        "href",
        el.getAttribute("href").replace(/https:\/\/chefmade\.(dk|de)/, site.homeUrl)
      );
    });
    const nav = document.querySelector(".lang-switch");
    if (nav) {
      const labels = { da: "DA", de: "DE", en: "EN" };
      nav.innerHTML = site.langs
        .map((code, i) => {
          const sep = i ? '<span class="lang-sep" aria-hidden="true">|</span>' : "";
          const active = code === lang;
          return (
            sep +
            '<a href="?lang=' +
            code +
            '" data-lang="' +
            code +
            '"' +
            (active ? ' class="is-active" aria-current="true"' : "") +
            ">" +
            (labels[code] || code.toUpperCase()) +
            "</a>"
          );
        })
        .join("");
    }
  }

  try {
    document.documentElement.setAttribute("data-site", site.id);
    let lang;
    const q = new URLSearchParams(location.search).get("lang");
    if (site.langs.indexOf(q) !== -1) lang = q;
    else {
      try {
        lang = localStorage.getItem(storageKey());
        if (site.langs.indexOf(lang) === -1 && site.id === "dk") {
          lang = localStorage.getItem("gavekort-lang");
        }
      } catch (e) {}
    }
    if (site.langs.indexOf(lang) === -1) lang = site.defaultLang;
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-early-lang", lang);
  } catch (e) {}

  global.GAVEKORT_SITE = site;
  global.GAVEKORT_CONFIG = {
    currency: site.currency,
    paymentLinkUrl: site.paymentLinkUrl,
    minCustomAmount: site.minCustomAmount,
    maxCustomAmount: site.maxCustomAmount,
    successPath: site.successPath
  };
  global.GavekortSite = {
    site: site,
    detectSiteId: detectSiteId,
    storageKey: storageKey,
    applyChrome: applyChrome,
    SITES: SITES
  };
})(window);
