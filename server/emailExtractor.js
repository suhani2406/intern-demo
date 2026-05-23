function extractEmails(text) {
  if (!text) return [];

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/g;

  const emails = text.match(emailRegex) || [];

  return [...new Set(emails)];
}

module.exports = extractEmails;