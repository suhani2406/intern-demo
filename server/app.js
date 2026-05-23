require("dotenv").config();

const loginLinkedIn = require("./linkedinLogin");
const { scrapeLinkedInPosts, scrapeSamplePosts } = require("./jobScraper");
const sendJobApplication = require("./gmailSender");

async function main() {
  const keywords = process.env.KEYWORDS || "Java Developer Contract";
  const shouldSendEmails = process.env.SEND_EMAILS === "true";

  let browser;

  try {
    console.log("Starting Job Automation System...");
    console.log("Keywords:", keywords);

    let results = [];

    try {
      const loginResult = await loginLinkedIn();

      browser = loginResult.browser;
      const page = loginResult.page;

      results = await scrapeLinkedInPosts(page, keywords);
    } catch (error) {
      console.log("LinkedIn scraping failed. Using sample posts fallback.");
    }

    if (results.length === 0) {
      console.log("No recruiter emails found from LinkedIn.");
      console.log("Using samplePosts.txt for demo.");
      results = scrapeSamplePosts();
    }

    if (results.length === 0) {
      console.log("No emails found.");
      return;
    }

    const allEmails = [];

    for (const result of results) {
      for (const email of result.emails) {
        allEmails.push(email);
      }
    }

    const uniqueEmails = [...new Set(allEmails)];

    console.log("Recruiter Emails Found:");
    console.log(uniqueEmails);

    if (!shouldSendEmails) {
      console.log("SEND_EMAILS=false, so emails were not sent.");
      console.log("Set SEND_EMAILS=true in .env to send emails.");
      return;
    }

    for (const email of uniqueEmails) {
      await sendJobApplication(email);
    }

    console.log("Automation completed successfully.");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();