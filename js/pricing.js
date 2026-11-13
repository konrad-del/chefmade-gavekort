/**
 * Chefmade gift-card pricing, from Google Sheet
 * "Chefmade Pricing" (id 19ubdAb1WJxoKdltOeuqfttL6QbDB2F8Ve68L3wWIVXg), Sheet1.
 * Columns: New Name, From Persons, To, From PP DK, From PP DE,
 * Implicit minum price DK, Implicit minimum price DE, New Implicit Minium DE.
 * Total = guests × per-person rate for the band that contains the guest count.
 * The "implicit minimum" column equals From Persons × From PP (the price at the
 * bottom of each band), not the price for every guest count in the band.
 */
(function (global) {
  const STYLES = [
    { id: "casual", name: "Casual" },
    { id: "gourmet", name: "Gourmet" },
    { id: "michelin", name: "Michelin Experience" }
  ];

  const BANDS = {
    casual: [
      { from: 2, to: 3, ppDkk: 1800, ppEur: 240, minDkk: 3600, minEur: 480 },
      { from: 4, to: 6, ppDkk: 1250, ppEur: 160, minDkk: 5000, minEur: 640 },
      { from: 7, to: 9, ppDkk: 1000, ppEur: 130, minDkk: 7000, minEur: 910 },
      { from: 10, to: 15, ppDkk: 750, ppEur: 95, minDkk: 7500, minEur: 950 },
      { from: 16, to: Infinity, ppDkk: 580, ppEur: 75, minDkk: 9280, minEur: 1200 }
    ],
    gourmet: [
      { from: 2, to: 3, ppDkk: 2500, ppEur: 330, minDkk: 5000, minEur: 660 },
      { from: 4, to: 6, ppDkk: 1500, ppEur: 200, minDkk: 6000, minEur: 800 },
      { from: 7, to: 9, ppDkk: 1200, ppEur: 160, minDkk: 8400, minEur: 1120 },
      { from: 10, to: 15, ppDkk: 1100, ppEur: 145, minDkk: 11000, minEur: 1450 },
      { from: 16, to: Infinity, ppDkk: 950, ppEur: 130, minDkk: 15200, minEur: 2080 }
    ],
    michelin: [
      { from: 2, to: 3, ppDkk: 4700, ppEur: 650, minDkk: 9400, minEur: 1300 },
      { from: 4, to: 6, ppDkk: 2700, ppEur: 380, minDkk: 10800, minEur: 1520 },
      { from: 7, to: 9, ppDkk: 2000, ppEur: 250, minDkk: 14000, minEur: 1750 },
      { from: 10, to: 15, ppDkk: 1700, ppEur: 200, minDkk: 17000, minEur: 2000 },
      { from: 16, to: Infinity, ppDkk: 1500, ppEur: 180, minDkk: 24000, minEur: 2880 }
    ]
  };

  const MIN_GUESTS = 2;
  const MAX_GUESTS = 30;
  const DEFAULT_GUESTS = 8;
  const DEFAULT_STYLE = "gourmet";

  /* Suggested custom amounts, derived from typical sheet totals — not official denominations. */
  const SUGGESTED_AMOUNTS_DKK = [3600, 5000, 8000, 12000];

  function bandFor(styleId, guests) {
    const bands = BANDS[styleId];
    if (!bands) return null;
    return bands.find((b) => guests >= b.from && guests <= b.to) || null;
  }

  function quote(styleId, guests, currency) {
    const g = Math.max(MIN_GUESTS, Math.min(MAX_GUESTS, Number(guests) || MIN_GUESTS));
    const band = bandFor(styleId, g);
    if (!band) return null;
    const pp = currency === "eur" ? band.ppEur : band.ppDkk;
    return {
      styleId,
      guests: g,
      band,
      perPerson: pp,
      total: pp * g,
      currency: currency === "eur" ? "eur" : "dkk"
    };
  }

  function formatAmount(amount, currency) {
    if (currency === "eur") {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0
      }).format(amount);
    }
    return new Intl.NumberFormat("da-DK", {
      style: "currency",
      currency: "DKK",
      maximumFractionDigits: 0
    }).format(amount);
  }

  global.GavekortPricing = {
    STYLES,
    BANDS,
    MIN_GUESTS,
    MAX_GUESTS,
    DEFAULT_GUESTS,
    DEFAULT_STYLE,
    SUGGESTED_AMOUNTS_DKK,
    bandFor,
    quote,
    formatAmount
  };
})(window);
