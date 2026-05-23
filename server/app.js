// require("dotenv").config();
require("dotenv").config({ path: ".env" });

const { scrapeSamplePosts } = require("./jobScraper");
const sendJobApplication = require("./gmailSender");

async function main() {
  const shouldSendEmails = process.env.SEND_EMAILS === "true";
 const demoMode = true;

  console.log("Starting Job Automation System...");
  console.log("Mode:", demoMode ? "DEMO MODE" : "LIVE LINKEDIN MODE");

  let results = [];

  if (demoMode) {
    console.log("Reading sample LinkedIn job posts...");
    results = scrapeSamplePosts();
  }

  if (results.length === 0) {
    console.log("No recruiter emails found.");
    return;
  }

  const emails = [...new Set(results.flatMap(item => item.emails))];

  console.log("Recruiter Emails Found:");
  console.log(emails);

  if (!shouldSendEmails) {
    console.log("SEND_EMAILS=false, email sending skipped.");
    console.log("Set SEND_EMAILS=true to send Gmail applications.");
    return;
  }

  for (const email of emails) {
    await sendJobApplication(email);
  }

  console.log("Automation completed successfully.");
}

main();