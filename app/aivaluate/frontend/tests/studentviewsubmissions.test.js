import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Student View Submissions Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Student View Submissions page loads and displays content', async () => {
    try {
      await driver.get('http://localhost:5173/stu/login');

      // Debugging: Log to check if the page loaded
      console.log('Navigated to /stu/login');

      // Wait for the email input to be present
      const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 30000);
      console.log('Email input located');

      // Wait for the password input to be present
      const passwordInput = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 30000);
      console.log('Password input located');

      // Wait for the login button to be present
      const loginButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 30000);
      console.log('Login button located');

      await emailInput.sendKeys('aayush@email.com');
      await passwordInput.sendKeys('pass123');
      await loginButton.click();
      console.log('Login form submitted');

      // Wait for redirection to the student dashboard
      await driver.wait(until.urlContains('/stu/dashboard'), 30000);
      console.log('Navigated to /stu/dashboard');

      // Navigate to the student view submissions page
      await driver.get('http://localhost:5173/stu/submissions/1');
      console.log('Navigated to /stu/submissions');

      // Wait for the submissions section to load
      const submissionsSection = await driver.wait(until.elementLocated(By.css('.portal-container')), 30000);
      console.log('Submissions section displayed');

      // Verify that the "Student Submissions" heading is displayed
      const submissionsHeading = await driver.wait(until.elementLocated(By.css('.top-bar h1')), 30000);
      console.log('Student Submissions heading located');
      expect(submissionsHeading).toBeTruthy();

      // Verify that the search box is displayed
      const searchBox = await driver.wait(until.elementLocated(By.css('.search-box input')), 30000);
      console.log('Search box located');
      expect(searchBox).toBeTruthy();

      // Verify that the file items are displayed
      const fileItems = await driver.wait(until.elementsLocated(By.css('.file-item')), 30000);
      console.log('File items located');
      expect(fileItems.length).toBeGreaterThan(0);

      // Verify pagination controls
      const paginationControls = await driver.wait(until.elementLocated(By.css('.pagination-controls')), 30000);
      console.log('Pagination controls located');
      expect(paginationControls).toBeTruthy();

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
