(function (global) {
  const STORAGE_KEY = "gavekort-lang";
  const STRINGS = {
    da: {
      "meta.title": "Chefmade Gavekort",
      "meta.description": "En original, lækker og stilfuld gave. Kan bruges til alle Chefmade-oplevelser.",
      "thanks.metaTitle": "Tak — Chefmade Gavekort",
      "lang.label": "Sprog",
      "hero.title": "Giv gaven af<br>Chefmade",
      "hero.lede": "En original, lækker og stilfuld gave. Kan bruges til alle Chefmade-oplevelser.",
      "hero.buy": "Køb gavekort",
      "hero.how": "Sådan virker det",
      "hero.trustpilot": "<strong>5,0</strong> på Trustpilot",
      "hero.alt": "En handske, der holder et Chefmade-gavekort",
      "feature.1.title": "Én gave, alle kokke",
      "feature.1.body": "Privat middag, catering eller et kokkekursus. De vælger selv.",
      "feature.2.title": "Udløber aldrig",
      "feature.2.body": "Ingen travlhed. De booker, når tiden er den rette.",
      "feature.3.title": "Digitalt eller fysisk",
      "feature.3.body": "Sendes som PDF, eller som et trykt kort med posten.",
      "business.title": "Gavekort til erhverv",
      "business.body": "Vis din taknemmelighed over for medarbejdere og kunder med en gave, der er nem at give ved enhver lejlighed.",
      "business.cta": "Kom i gang",
      "business.subject": "Gavekort til erhverv",
      "business.alt": "En stak Chefmade-gavekort",
      "faq.title": "Ofte stillede spørgsmål",
      "faq.q1": "Kan jeg købe et gavekort i butikker?",
      "faq.a1": "Ikke i øjeblikket. Chefmade-gavekort købes online her på siden.",
      "faq.q2": "Hvad dækker gavekortet?",
      "faq.a2": "Gavekortet kan bruges til en fuld middag med privat kok eller til enhver Chefmade-oplevelse. Se vores anbefalede beløb nedenfor, hvis du vil give en komplet middag – den endelige pris fastsættes dog og afhænger af den valgte kok.",
      "faq.q3": "Udløber gavekortet?",
      "faq.a3": "Nej. Chefmade-gavekort udløber aldrig.",
      "faq.q4": "Hvordan indløser jeg mit Chefmade-gavekort?",
      "faq.a4": "Når betalingen er gennemført, modtager du en gavekode. Indtast den ved checkout, så trækkes beløbet automatisk – eller del koden og beløbet med os, så hjælper vi med at finde den rette oplevelse.",
      "faq.q5": "Hvilke betalingsmetoder accepterer I?",
      "faq.a5": "Betalingen sker sikkert via Stripe. Kort som Visa og Mastercard accepteres. De præcise metoder ved checkout afhænger af Chefmades opsætning hos Stripe.",
      "faq.q6": "Kan jeg købe gavekort i større antal til erhverv?",
      "faq.a6": "Ja. Du kan købe gavekort her på siden, eller kontakte Chefmade, hvis du har brug for en større erhvervsordre.",
      "checkout.title": "Giv en middag, man husker",
      "checkout.sub": "Kan bruges til alle kokke, menuer og datoer.",
      "step.1": "Hvad vil du gerne give?",
      "path.amount.title": "Giv et beløb",
      "path.amount.body": "Vælg gavekortets værdi",
      "path.dinner.title": "Giv en hel middag",
      "path.dinner.body": "En komplet middag med privat kok til et bestemt antal gæster",
      "amount.custom": "Vælg dit eget beløb (kr.)",
      "amount.hint": "De fleste kokkes minimumshonorar starter fra 8.000 kr. Gavekortet kan bruges til hele middagen eller som et bidrag.",
      "guests.label": "Hvor mange gæster?",
      "guests.row": "Gæster",
      "guests.dec": "Færre gæster",
      "guests.inc": "Flere gæster",
      "style.label": "Vælg stil",
      "style.pp": "pr. pers.",
      "style.total": "i alt",
      "step.2": "Hvem er den heldige?",
      "form.recipient": "Modtagerens navn",
      "form.message": "Din personlige hilsen",
      "step.3": "Dine oplysninger",
      "form.buyerName": "Dit navn",
      "form.buyerEmail": "Din e-mail",
      "form.buyerPhone": "Dit telefonnummer",
      "delivery.label": "Hvordan skal det leveres",
      "delivery.digital.title": "Digitalt",
      "delivery.digital.body": "Vi sender dig en PDF, du selv kan printe",
      "delivery.physical.title": "Fysisk",
      "delivery.physical.body": "Vi kontakter dig for at aftale levering. Fragt er gratis.",
      "pay.continue": "Fortsæt til betaling",
      "pay.trustpilot": "5,0 Trustpilot",
      "pay.expires": "Udløber aldrig",
      "pay.anyChef": "Kan bruges hos alle kokke",
      "preview.label": "FORHÅNDSVISNING",
      "preview.kicker": "GAVEKORT",
      "preview.for": "TIL",
      "preview.someone": "En særlig person",
      "preview.voucher": "Gavekort",
      "preview.dinner": "{style} til {count} {guestWord}",
      "preview.guestOne": "gæst",
      "preview.guestMany": "gæster",
      "dialog.close": "Luk",
      "dialog.chooseAmount": "Vælg et beløb, eller antal gæster og en stil.",
      "dialog.amountRange": "Vælg et beløb mellem {min} og {max}.",
      "dialog.noLinkTitle": "Betalingslink er ikke forbundet endnu",
      "dialog.noLinkBody": "Forhåndsvisningen er klar, men der er endnu ikke tilknyttet et Stripe-betalingslink.",
      "thanks.kicker": "CHEFMADE GAVEKORT",
      "thanks.title": "Tak",
      "thanks.p1": "Vi har modtaget din betaling. Stripe sender en kvittering til den e-mail, du brugte ved checkout.",
      "thanks.p2": "Har du valgt et digitalt gavekort, sender vi en PDF, du kan printe eller videresende. Har du valgt fysisk levering, kontakter vi dig for at aftale detaljerne. Fragt er gratis. Dit gavekort udløber aldrig.",
      "thanks.back": "Tilbage til gavekortet",
      "footer.contact": "Tag kontakt i dag",
      "footer.inspiration": "Inspiration",
      "footer.erhverv": "Erhverv",
      "footer.birthday": "Fødselsdag",
      "footer.wedding": "Bryllup",
      "footer.confirmation": "Konfirmation",
      "footer.social": "Social middag",
      "footer.easter": "Påskemiddag",
      "footer.partners": "For partnere",
      "footer.becomeChef": "Bliv Chefmade kok",
      "footer.shortcuts": "Genveje",
      "footer.restaurants": "Restauranter & Kokke",
      "footer.menus": "Menuer",
      "footer.buy": "Køb gavekort",
      "footer.support": "Support",
      "footer.faq": "FAQ",
      "footer.terms": "Betingelser",
      "footer.privacy": "Privatliv",
      "footer.sitemap": "Sitemap",
      "demo.message": "Tillykke med de 40 — vi ses til middag"
    },
    en: {
      "meta.title": "Chefmade Gift Card",
      "meta.description": "An original, tasty and classy present. To be used for any type of Chefmade experience.",
      "thanks.metaTitle": "Thank you — Chefmade Gift Card",
      "lang.label": "Language",
      "hero.title": "Give the gift of<br>Chefmade",
      "hero.lede": "An original, tasty and classy present. To be used for any type of Chefmade experience",
      "hero.buy": "Buy a gift card",
      "hero.how": "How it works",
      "hero.trustpilot": "<strong>5.0</strong> on Trustpilot",
      "hero.alt": "A gloved hand holding a Chefmade gift card",
      "feature.1.title": "One gift, every chef",
      "feature.1.body": "Private dinners, catering or a cooking class. They choose.",
      "feature.2.title": "Never expires",
      "feature.2.body": "No rush. They book whenever the moment is right.",
      "feature.3.title": "Digital or printed",
      "feature.3.body": "Sent as a PDF, or as a printed card by post.",
      "business.title": "Gift cards for business",
      "business.body": "Show your appreciation for employees and customers with a gift that's easy to give for any occasion.",
      "business.cta": "Get started",
      "business.subject": "Business gift cards",
      "business.alt": "A stack of Chefmade gift cards",
      "faq.title": "Frequently asked questions",
      "faq.q1": "Can I buy a gift card in stores?",
      "faq.a1": "Not at the moment. Chefmade gift cards are bought online on this page.",
      "faq.q2": "What is covered by the gift card?",
      "faq.a2": "Gift cards can be used toward a full private-chef dinner or any Chefmade Experience. Check our recommended amounts below to gift a complete dinner, though final pricing is set and depends on the selected chef.",
      "faq.q3": "Do gift cards expire?",
      "faq.a3": "No. Chefmade gift cards never expire.",
      "faq.q4": "How to apply my Chefmade gift card?",
      "faq.a4": "After payment, you'll receive a voucher code. Simply enter it at checkout to apply the balance automatically, or share the code and value with our team for help finding the right experience.",
      "faq.q5": "What payment methods do you accept to buy gift cards?",
      "faq.a5": "Payment is handled securely by Stripe. Cards such as Visa and Mastercard are accepted. The exact methods shown at checkout depend on Stripe’s setup for Chefmade.",
      "faq.q6": "Can I buy gift cards in bulk for a business?",
      "faq.a6": "Yes. You can buy cards on this page, or get in touch with the Chefmade team if you need a larger business order.",
      "checkout.title": "Give a dinner to remember",
      "checkout.sub": "To be used for any chef, menu & date.",
      "step.1": "What would you like to gift?",
      "path.amount.title": "Gift an amount",
      "path.amount.body": "Choose the value of the voucher",
      "path.dinner.title": "Gift a whole dinner",
      "path.dinner.body": "A complete private chef dinner for a set number of guests",
      "amount.custom": "Choose your own amount (DKK)",
      "amount.hint": "Most chefs’ minimum fees start from 8.000 kr. Vouchers can be used for the whole or a part of the dinner.",
      "guests.label": "How many guests?",
      "guests.row": "Guests",
      "guests.dec": "Fewer guests",
      "guests.inc": "More guests",
      "style.label": "Choose Style",
      "style.pp": "pp",
      "style.total": "total",
      "step.2": "Who is the lucky one",
      "form.recipient": "Recipient Name",
      "form.message": "Your personal message",
      "step.3": "Final Information",
      "form.buyerName": "Your Name",
      "form.buyerEmail": "Your Email",
      "form.buyerPhone": "Your Phone Number",
      "delivery.label": "How should it arrive",
      "delivery.digital.title": "Digital",
      "delivery.digital.body": "We send you a PDF to print yourself",
      "delivery.physical.title": "Physical",
      "delivery.physical.body": "We reach out to you for delivery details. Shipping is free.",
      "pay.continue": "Continue to payment",
      "pay.trustpilot": "5.0 Trustpilot",
      "pay.expires": "Never expires",
      "pay.anyChef": "Use with any chef",
      "preview.label": "LIVE PREVIEW",
      "preview.kicker": "GIFT CARD",
      "preview.for": "FOR",
      "preview.someone": "Someone special",
      "preview.voucher": "Gift voucher",
      "preview.dinner": "{style} for {count} {guestWord}",
      "preview.guestOne": "guest",
      "preview.guestMany": "guests",
      "dialog.close": "Close",
      "dialog.chooseAmount": "Please choose a gift amount, or pick the number of guests and a style.",
      "dialog.amountRange": "Please choose an amount between {min} and {max}.",
      "dialog.noLinkTitle": "Payment link not connected yet",
      "dialog.noLinkBody": "This preview is ready, but no Stripe Payment Link has been connected yet.",
      "thanks.kicker": "CHEFMADE GIFT CARD",
      "thanks.title": "Thank you",
      "thanks.p1": "Your payment has been received. Stripe will send a receipt to the email used at checkout.",
      "thanks.p2": "If you chose a digital card, we will send a PDF you can print or forward. If you chose physical delivery, the team will reach out to arrange the details. Shipping is free. Your gift card never expires.",
      "thanks.back": "Back to the gift card",
      "footer.contact": "Get in touch",
      "footer.inspiration": "Inspiration",
      "footer.erhverv": "Business",
      "footer.birthday": "Birthday",
      "footer.wedding": "Wedding",
      "footer.confirmation": "Confirmation",
      "footer.social": "Social dining",
      "footer.easter": "Easter dinner",
      "footer.partners": "For partners",
      "footer.becomeChef": "Become a Chefmade chef",
      "footer.shortcuts": "Shortcuts",
      "footer.restaurants": "Restaurants & chefs",
      "footer.menus": "Menus",
      "footer.buy": "Buy a gift card",
      "footer.support": "Support",
      "footer.faq": "FAQ",
      "footer.terms": "Terms",
      "footer.privacy": "Privacy",
      "footer.sitemap": "Sitemap",
      "demo.message": "Happy 40th — let’s celebrate together"
    }
  };

  const listeners = [];
  let lang = "da";

  function normalize(value) {
    return value === "en" || value === "da" ? value : "da";
  }

  function readLang() {
    try {
      const q = new URLSearchParams(location.search).get("lang");
      if (q === "en" || q === "da") return q;
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "da") return stored;
    } catch (e) {}
    return "da";
  }

  function persist(next, updateUrl) {
    lang = normalize(next);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    if (updateUrl) {
      try {
        const url = new URL(location.href);
        url.searchParams.set("lang", lang);
        history.replaceState({}, "", url);
      } catch (e) {}
    }
  }

  function t(key, vars) {
    const table = STRINGS[lang] || STRINGS.da;
    let value = table[key] != null ? table[key] : (STRINGS.da[key] || key);
    if (vars) {
      Object.keys(vars).forEach((k) => {
        value = value.replace(new RegExp("\\{" + k + "\\}", "g"), String(vars[k]));
      });
    }
    return value;
  }

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      el.setAttribute("alt", t(el.getAttribute("data-i18n-alt")));
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n-title"));
    });
    const titleKey = document.body.classList.contains("thanks") ? "thanks.metaTitle" : "meta.title";
    document.title = t(titleKey);
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.description"));
    document.querySelectorAll("[data-i18n-mailto-subject]").forEach((el) => {
      el.setAttribute("href", "mailto:info@chefmade.dk?subject=" + encodeURIComponent(t("business.subject")));
    });
    document.querySelectorAll(".lang-switch a[data-lang]").forEach((a) => {
      const active = a.getAttribute("data-lang") === lang;
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  function setLang(next, updateUrl) {
    persist(next, updateUrl !== false);
    apply();
    listeners.forEach((fn) => {
      try { fn(lang); } catch (e) {}
    });
  }

  function onChange(fn) { listeners.push(fn); }

  lang = readLang();
  persist(lang, false);
  document.documentElement.lang = lang;

  function bindSwitcher() {
    document.querySelectorAll(".lang-switch a[data-lang]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        setLang(a.getAttribute("data-lang"), true);
      });
    });
  }

  function init() {
    apply();
    bindSwitcher();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.GavekortI18n = { getLang: () => lang, setLang, t, apply, onChange };
})(window);
