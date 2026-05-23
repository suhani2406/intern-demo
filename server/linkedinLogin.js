const puppeteer = require("puppeteer");

async function loginLinkedIn() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: "./linkedin_session",
    args: ["--start-maximized"]
  });

  const page = await browser.newPage();

  await page.goto("https://www.linkedin.com/login", {
    waitUntil: "networkidle2"
  });

  const currentUrl = page.url();

  if (currentUrl.includes("/feed")) {
    console.log("Already logged in to LinkedIn.");
    return { browser, page };
  }

  try {
    await page.waitForSelector("#username", { timeout: 10000 });

    await page.type("#username", process.env.LINKEDIN_EMAIL, { delay: 60 });
    await page.type("#password", process.env.LINKEDIN_PASSWORD, { delay: 60 });

    await page.click("button[type='submit']");

    await page.waitForNavigation({
      waitUntil: "networkidle2",
      timeout: 60000
    });

    console.log("LinkedIn login completed.");
  } catch (error) {
    console.log("Manual login may be required.");
    console.log("If LinkedIn asks for captcha/OTP, complete it manually in browser.");
  }

  return { browser, page };
}

module.exports = loginLinkedIn;