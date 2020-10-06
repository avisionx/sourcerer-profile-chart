const puppeteer = require("puppeteer");
const Clipper = require("image-clipper");

Clipper.configure({
  canvas: require("canvas"),
});

const username = "avisionx";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 900,
    height: 600,
    deviceScaleFactor: 1,
  });
  await page.goto("https://sourcerer.io/" + username);
  await page.evaluate(() => {
    document.querySelector("#awesome-chart-section").scrollIntoView();
  });
  await page.screenshot({
    path: username + ".png",
  });
  await browser.close();
})().then(() => {
  Clipper(username + ".png", function () {
    this.crop(50, 90, 800, 415).toFile(
      username + "-sourcerer-chart.png",
      function () {
        console.log("Saved File!");
      }
    );
  });
});
