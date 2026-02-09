const AppConfig = require("../models/AppConfig");

let cache = null;
let cacheAt = 0;
const TTL_MS = 60_000;

async function getActiveAppConfig() {
  const now = Date.now();
  if (cache && now - cacheAt < TTL_MS) return cache;

  const cfg = await AppConfig.findOne({ active: true }).sort({ updatedAt: -1 }).lean();
  if (!cfg) throw new Error("No active appconfig found (collection: appconfig).");

  cache = cfg;
  cacheAt = now;
  return cfg;
}

function clearAppConfigCache() {
  cache = null;
  cacheAt = 0;
}

module.exports = { getActiveAppConfig, clearAppConfigCache };
