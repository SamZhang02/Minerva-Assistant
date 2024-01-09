import puppeteer from 'puppeteer';
import config from './config.json' assert { type: 'json' };


const MINERVA = "https://horizon.mcgill.ca/"
const COURSES = config.courses
const TIMEOUT = config.timeout

const timeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const initialize = async () => {
  console.log("Initializing Minerva")

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto(MINERVA);

  return page

}

const login = async (page) => {
  await page.waitForXPath("//button[contains(text(), 'Login')]", { timeout: 10000 });

  const loginButton = await page.$x("//button[contains(text(), 'Login')]");

  await loginButton[0].click();

  await page.waitForXPath('//a[contains(text(), "Student Menu")]', { timeout: 600000 });
}

const register = async (page) => {

  const studentMenu = '//a[contains(text(), "Student Menu")]';
  const registrationMenu = '//a[contains(text(), "Registration Menu")]'
  const addDropPage = '//a[contains(text(), "Quick Add or Drop Course Sections")]'
  const submitTerm = '/html/body/div[3]/form/input';
  const submitChanges = '/html/body/div[3]/form/input[19]';

  await page.waitForXPath(studentMenu, { timeout: 10000 });
  const studentMenuButton = await page.$x(studentMenu)
  await studentMenuButton[0].click()

  await timeout(1000)

  await page.waitForXPath(registrationMenu, { timeout: 10000 });
  const registrationMenuButton = await page.$x(registrationMenu)
  await registrationMenuButton[0].click()

  await timeout(1000)

  await page.waitForXPath(addDropPage, { timeout: 10000 });
  const addDropPageButton = await page.$x(addDropPage)
  await addDropPageButton[0].click()

  await timeout(1000)

  await page.waitForXPath(submitTerm, { timeout: 10000 });
  const submitTermButton = await page.$x(submitTerm)
  await submitTermButton[0].click()

  await timeout(1000)

  await page.waitForXPath(submitChanges, { timeout: 10000 });

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  for (let i = 0; i < COURSES.length; i++) {

    const course = COURSES[i]
    const inputBox = await page.$x(`//*[@id="crn_id${i + 1}"]`)

    console.log(`Entering course ${course}`)
    await inputBox[0].type(course)

    await timeout(500)
  }

  const submitChangesButton = await page.$x(submitChanges)
  await submitChangesButton[0].click()

  await page.waitForNavigation()

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
}

const run = async () => {
  const page = await initialize()

  console.log("Minerva opened.")


  let count = 0;

  for (; ;) {
    await login(page)

    register(page)
    await timeout(30000)

    await page.goto(MINERVA);
    await timeout(TIMEOUT) // every 2 minutes

    count++;

    console.log(`Registration done ${count} times`)
  }
};

if (COURSES.length > 10) {
  throw Error("Can't add more than 10 courses at once.")
}

run()
