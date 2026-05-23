const puppeteer = require("puppeteer");

async function loginLinkedIn() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: "./linkedin_session",
    args: ["--start-maximized"]
  });

  const page = await browser.newPage();

  await page.goto("https://www.linkedin.com/feed/", {
    waitUntil: "domcontentloaded",
    timeout: 60000
  });

  console.log("If LinkedIn login page opens, login manually in the browser.");
  console.log("Waiting 60 seconds for manual login...");

  await new Promise(resolve => setTimeout(resolve, 60000));

  console.log("Continuing automation...");

  return { browser, page };
}

module.exports = loginLinkedIn;