import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Assignment Overview Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Assignment Overview page loads and displays assignments', async () => {
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

      // Navigate to the assignment overview page
      await driver.get('http://localhost:5173/stu/assignment/1');
      console.log('Navigated to /stu/assignments');

      // Wait for the assignments to load
      const assignmentTable = await driver.wait(until.elementLocated(By.css('.assignment-table')), 30000);
      console.log('Assignment table displayed');

      // Verify that the assignment table is displayed
      expect(assignmentTable).toBeTruthy();

      // Verify that the search input is displayed
      const searchInput = await driver.findElement(By.css('input[type="text"]'));
      expect(searchInput).toBeTruthy();
      console.log('Search input displayed');

      // Verify that at least one assignment is displayed
      const assignments = await driver.findElements(By.css('.assignment-table tbody tr'));
      expect(assignments.length).toBeGreaterThan(0);
      console.log('Assignments displayed');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
