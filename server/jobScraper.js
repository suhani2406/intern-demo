const fs = require("fs");
const extractEmails = require("./emailExtractor");

async function scrapeLinkedInPosts(page, keywords) {
  const encodedKeywords = encodeURIComponent(keywords);

  const searchUrl = `https://www.linkedin.com/search/results/content/?keywords=${encodedKeywords}`;

  console.log("Opening LinkedIn search:", searchUrl);

  await page.goto(searchUrl, {
    waitUntil: "networkidle2",
    timeout: 60000
  });

  await new Promise(resolve => setTimeout(resolve, 5000));

  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  const posts = await page.evaluate(() => {
    const elements = Array.from(
      document.querySelectorAll("div, span, article")
    );

    return elements
      .map(el => el.innerText)
      .filter(text => text && text.length > 80)
      .slice(0, 80);
  });

  const cleanPosts = [...new Set(posts)];

  const matchedPosts = cleanPosts.filter(post => {
    const lower = post.toLowerCase();

    return (
      lower.includes("java") &&
      lower.includes("developer") &&
      lower.includes("contract")
    );
  });

  const results = [];

  for (const post of matchedPosts) {
    const emails = extractEmails(post);

    if (emails.length > 0) {
      results.push({
        postText: post,
        emails
      });
    }
  }

  return results;
}

function scrapeSamplePosts() {
  const path = require("path");

const samplePath = path.join(__dirname, "samplePosts.txt");

if (!fs.existsSync(samplePath)) {
  return [];
}

const data = fs.readFileSync(samplePath, "utf-8");

  const posts = data.split("-----");

  const results = [];

  for (const post of posts) {
    const emails = extractEmails(post);

    if (emails.length > 0) {
      results.push({
        postText: post.trim(),
        emails
      });
    }
  }

  return results;
}

module.exports = {
  scrapeLinkedInPosts,
  scrapeSamplePosts
};