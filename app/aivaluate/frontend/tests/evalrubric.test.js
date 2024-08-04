import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Evaluator Rubrics Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Evaluator Rubrics page loads and displays content', async () => {
    try {
      await driver.get('http://localhost:5173/eval/login');

      // Debugging: Log to check if the page loaded
      console.log('Navigated to /eval/login');

      // Wait for the email input to be present
      const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 20000);
      console.log('Email input located');

      // Wait for the password input to be present
      const passwordInput = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 20000);
      console.log('Password input located');

      // Wait for the login button to be present
      const loginButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 20000);
      console.log('Login button located');

      await emailInput.sendKeys('testprof@email.com');
      await passwordInput.sendKeys('pass123');
      await loginButton.click();
      console.log('Login form submitted');

      // Wait for redirection to the evaluator dashboard
      await driver.wait(until.urlContains('/eval/dashboard'), 20000);
      console.log('Navigated to /eval/dashboard');

      // Navigate to the Rubrics page
      await driver.get('http://localhost:5173/eval/rubrics/1');
      console.log('Navigated to /eval/rubrics');

      // Wait for the Rubrics page content to load
      const rubricsSection = await driver.wait(until.elementLocated(By.css('.portal-container')), 20000);
      console.log('Rubrics section displayed');

      // Verify that the Your Rubrics heading is displayed
      const rubricsHeading = await driver.wait(until.elementLocated(By.xpath('//h1[text()="Your Rubrics"]')), 20000);
      expect(rubricsHeading).toBeTruthy();
      console.log('Your Rubrics heading displayed');

      // Verify that the search bar is displayed
      const searchBar = await driver.wait(until.elementLocated(By.css('.search-box input[type="text"]')), 20000);
      expect(searchBar).toBeTruthy();
      console.log('Search bar displayed');

      // Verify that the list of rubrics is displayed
      const rubricList = await driver.wait(until.elementLocated(By.css('.filetab')), 20000);
      expect(rubricList).toBeTruthy();
      console.log('Rubric list displayed');

      // Verify pagination controls are displayed
      const paginationControls = await driver.wait(until.elementLocated(By.css('.pagination-controls')), 20000);
      expect(paginationControls).toBeTruthy();
      console.log('Pagination controls displayed');

      // Verify next and previous buttons are displayed
      const prevButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Previous"]')), 20000);
      const nextButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Next"]')), 20000);
      expect(prevButton).toBeTruthy();
      expect(nextButton).toBeTruthy();
      console.log('Next and Previous buttons displayed');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
