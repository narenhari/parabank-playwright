function toCents(text) {
  const cleaned = text.replace(/[^0-9.-]/g, '');
  return Math.round(parseFloat(cleaned) * 100);
}

module.exports = { toCents };