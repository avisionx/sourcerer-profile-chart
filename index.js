const puppeteer = require("puppeteer");
const Clipper = require("image-clipper");

Clipper.configure({
  canvas: require("canvas"),
});

const usernames = require("./usernames");

async function generateChart(username) {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 900,
    height: 600,
    deviceScaleFactor: 3,
  });
  await page
    .goto("https://sourcerer.io/" + username, {
      waitUntil: "networkidle2",
    })
    .catch((err) => {
      console.log(err);
    });
  if (page.url().includes("notfound")) {
    browser.close();
    return;
  }
  const closeBrowser = await page.evaluate(() => {
    var overviewSelector = document.querySelector("#awesome-chart-section");
    if (overviewSelector === null) {
      return true;
    } else {
      overviewSelector.scrollIntoView();
      return false;
    }
  });
  if (closeBrowser) {
    browser.close();
    return;
  }
  await page.screenshot({
    path: "./charts/" + username + ".png",
  });
  await browser.close();
}

(() => {
  usernames.forEach((username) => {
    generateChart(username)
      .then(() => {
        Clipper("./charts/" + username + ".png", function () {
          this.crop(150, 100, 2400, 1450).toFile(
            "./charts/" + username + "-sourcerer-chart.png",
            function () {
              console.log("Generated charts for " + username + "!");
            }
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
})();
