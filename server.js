const KEYS = {
  "STRcfg-1-DAY": 1,
  "STRcfg-3-DAYS": 3,
  "STRcfg-7-DAYS": 7
};

function activateKey(key, now = Date.now()) {
  const days = KEYS[key];

  if (!days) {
    return { ok: false, message: "Kalit noto‘g‘ri" };
  }

  const expiresAt = now + days * 24 * 60 * 60 * 1000;

  return {
    ok: true,
    expiresAt: new Date(expiresAt).toISOString()
  };
}

function checkExpiry(expiresAt, now = Date.now()) {
  return now < Date.parse(expiresAt);
}

console.log(activateKey("DEMO-1-DAY"));
