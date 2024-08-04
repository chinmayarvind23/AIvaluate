import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Browse All Assignments Eval Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Browse All Assignments Eval page loads and displays content', async () => {
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

      // Wait for redirection to the evaluator dashboard
      await driver.wait(until.urlContains('/eval/dashboard'), 30000);
      console.log('Navigated to /eval/dashboard');

      // Navigate to the Browse All Assignments Eval page
      await driver.get('http://localhost:5173/eval/browse/assignments');
      console.log('Navigated to eval/assignments/all');

      // Wait for the page content to load
      const helpSection = await driver.wait(until.elementLocated(By.css('.main-margin')), 30000);
      console.log('Page content displayed');

      // Verify that the search input is displayed
      const searchInput = await driver.wait(until.elementLocated(By.css('input[type="text"]')), 30000);
      console.log('Search input located');
      expect(searchInput).toBeTruthy();

      // Verify that the first assignment is displayed
      const firstAssignment = await driver.wait(until.elementLocated(By.css('.file-item')), 30000);
      console.log('First assignment located');
      expect(firstAssignment).toBeTruthy();

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
