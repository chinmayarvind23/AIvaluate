import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Admin Help Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Admin Help page loads and displays content', async () => {
    try {
      await driver.get('http://localhost:5173/admin/login');

      // Debugging: Log to check if the page loaded
      console.log('Navigated to /admin/login');

      // Wait for the email input to be present
      const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 20000);
      console.log('Email input located');

      // Wait for the password input to be present
      const passwordInput = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 20000);
      console.log('Password input located');

      // Wait for the login button to be present
      const loginButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 20000);
      console.log('Login button located');

      await emailInput.sendKeys('admin@email.com');
      await passwordInput.sendKeys('pass123');
      await loginButton.click();
      console.log('Login form submitted');

      // Wait for redirection to the admin home page
      await driver.wait(until.urlContains('/admin/evaluatormanager'), 20000);
      console.log('Navigated to /admin/home');

      // Navigate to the admin help page
      await driver.get('http://localhost:5173/admin/help');
      console.log('Navigated to /admin/help');

      // Wait for the help content to load
      const helpSection = await driver.wait(until.elementLocated(By.css('.help-section')), 20000);
      console.log('Help section displayed');

      // Verify that the Evaluator Manager section is displayed
      const evaluatorManagerHeading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="Evaluator Manager"]')), 20000);
      expect(evaluatorManagerHeading).toBeTruthy();
      console.log('Evaluator Manager section displayed');

      // Verify that the Student Manager section is displayed
      const studentManagerHeading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="Student Manager"]')), 20000);
      expect(studentManagerHeading).toBeTruthy();
      console.log('Student Manager section displayed');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
