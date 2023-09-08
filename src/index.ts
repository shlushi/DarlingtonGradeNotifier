import "dotenv/config";

import { launch, ElementHandle, Page, PuppeteerLaunchOptions } from "puppeteer";
import config from "./configs/main.json";
import pages from "./configs/pages.json";
import { GradeUpdate, Day } from "./types";
import {
  extractAssignmentInfo,
  extractGrade,
  arraysAreEqual,
  objectsAreEqual,
  getRandomMessage,
  sleep,
} from "./util";
import { sendMessage } from "./subsystems/telnyx";

let currentGradebookTable: GradeUpdate[] = [];

async function findTable(page: Page) {
  const tables = await page.$$("thead");
  let gradebookTableIndex = -1;

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const text = await table.evaluate((el) => el.textContent);

    if (text?.includes("Gradebook")) {
      gradebookTableIndex = i;
      break;
    }
  }

  if (gradebookTableIndex === -1) {
    throw new Error("No gradebook table found");
  }

  const tableHandle = await tables[gradebookTableIndex].evaluateHandle(
    (el) => el.parentElement
  );
  if (!tableHandle) {
    throw new Error("No table handle found");
  }

  const table = tableHandle.asElement();
  if (!table) {
    throw new Error("No table element found");
  }

  return table;
}

async function extractTableData(table: ElementHandle<Node>) {
  const tableBody = await table.$("tbody");
  if (!tableBody) {
    throw new Error("No table body found");
  }

  const rows = await tableBody.$$("tr");
  if (!rows) {
    throw new Error("No rows found");
  }

  const gradebookTable: GradeUpdate[] = [];

  for (const row of rows) {
    const tds = await row.$$("td");

    if (!tds || tds.length !== 5) {
      throw new Error("Invalid row format");
    }

    const [day, date, time, gradeText, classInfoText] = await Promise.all([
      tds[0].evaluate((el) => el.textContent) as Promise<string>,
      tds[1].evaluate((el) => el.textContent) as Promise<string>,
      tds[2].evaluate((el) => el.textContent) as Promise<string>,
      tds[3].evaluate((el) => el.textContent) as Promise<string>,
      tds[4].evaluate((el) => el.textContent) as Promise<string>,
    ]);

    const { classInfo, assignment } = extractAssignmentInfo(classInfoText)!;
    const grade = extractGrade(gradeText);
    const link = await (
      await (await tds[4].$$("a"))[2].getProperty("href")
    ).jsonValue();

    gradebookTable.push({
      class: classInfo,
      assignment,
      grade,
      day: day as Day,
      date,
      time,
      link,
    });
  }

  return gradebookTable;
}

async function checkForTableChanges(page: Page) {
  try {
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("table");

    const table = await findTable(page);
    const newGradebookTable = await extractTableData(table);

    if (
      !arraysAreEqual<GradeUpdate>(newGradebookTable, currentGradebookTable)
    ) {
      console.log("Table data has changed!");

      notifyUser(
        newGradebookTable.filter((newItem) => {
          return !currentGradebookTable.some((prevItem) =>
            objectsAreEqual(newItem, prevItem)
          );
        })
      );

      currentGradebookTable = newGradebookTable.slice();
    } else {
      console.log("No changes!");
    }
  } catch (error) {
    console.error("Error checking for table changes:", error);
  }
}

async function notifyUser(data: GradeUpdate[]) {
  for await (const item of data) {
    await sendMessage(getRandomMessage(item));
  }
}

async function initBrowser() {
  const browser = await launch(
    config.puppeteerLaunchArgs as PuppeteerLaunchOptions
  );
  const [page] = await browser.pages();

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.resourceType() == "font" || req.resourceType() == "image") {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(pages.login);
  await page.$eval(
    "input[id=Email]",
    (el, value) => (el.value = value),
    process.env.DAR_USER!
  );
  await page.$eval(
    "input[id=Password]",
    (el, value) => (el.value = value),
    process.env.DAR_PASSWORD!
  );
  await page.$eval("input[id=RememberMe]", (check) => (check.checked = true));
  await sleep(1000);
  await page.click("button[type=submit]");
  await page.waitForSelector(".sg-subtitle");
  await page.goto(pages.studentRecords);
  await page.waitForSelector("table");

  const table = await findTable(page);
  const gradebookTable = await extractTableData(table);
  currentGradebookTable = gradebookTable.slice();

  setInterval(() => {
    console.log("Checking for changes...");
    checkForTableChanges(page);
  }, config.checkInterval);

  // Simulate a change for development purposes
  // setTimeout(async () => {
  //   console.log("Simulating change...");
  //   await page.select("#dayselect-desktop", "2");
  // }, 13 * 1000);
}

initBrowser();
