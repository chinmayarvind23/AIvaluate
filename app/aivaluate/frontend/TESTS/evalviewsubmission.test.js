import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Eval View Submissions Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Eval View Submissions page loads and displays content', async () => {
    try {
      await driver.get('http://localhost:5173/eval/login');

      // Debugging: Log to check if the page loaded
      console.log('Navigated to /eval/login');

      // Wait for the email input to be present
      const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 30000);
      console.log('Email input located');

      // Wait for the password input to be present
      const passwordInput = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 30000);
      console.log('Password input located');

      // Wait for the login button to be present
      const loginButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 30000);
      console.log('Login button located');

      await emailInput.sendKeys('testprof@email.com');
      await passwordInput.sendKeys('pass123');
      await loginButton.click();
      console.log('Login form submitted');

      // Wait for redirection to the evaluator home page
      await driver.wait(until.urlContains('/eval/dashboard'), 30000);
      console.log('Navigated to /eval/dashboard');

      // Navigate to the eval view submissions page
      await driver.get('http://localhost:5173/eval/view-submissions');
      console.log('Navigated to /eval/view-submissions');

      // Wait for the submissions content to load
      const submissionsSection = await driver.wait(until.elementLocated(By.css('.accented-outside')), 30000);
      console.log('Submissions section displayed');
      expect(submissionsSection).toBeTruthy();

      // Verify that the "Student Submissions" heading is displayed
      const submissionsHeading = await driver.wait(until.elementLocated(By.xpath('//h1[text()="Student Submissions"]')), 30000);
      expect(submissionsHeading).toBeTruthy();
      console.log('Student Submissions heading displayed');

      // Verify that the search box is displayed
      const searchBox = await driver.wait(until.elementLocated(By.css('.search-box input')), 30000);
      expect(searchBox).toBeTruthy();
      console.log('Search box displayed');

      // Verify that the pagination controls are displayed
      const paginationControls = await driver.wait(until.elementLocated(By.css('.pagination-controls')), 30000);
      expect(paginationControls).toBeTruthy();
      console.log('Pagination controls displayed');

      // Verify that at least one file item is displayed
      const fileItem = await driver.wait(until.elementLocated(By.css('.file-item')), 30000);
      expect(fileItem).toBeTruthy();
      console.log('File item displayed');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
