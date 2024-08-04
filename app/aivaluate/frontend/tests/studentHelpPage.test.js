import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Help Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Help page loads and displays content', async () => {
    try {
      await driver.get('http://localhost:5173/login');

      // Debugging: Log to check if the page loaded
      console.log('Navigated to /login');

      // Wait for the email input to be present
      const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 20000);
      console.log('Email input located');

      // Wait for the password input to be present
      const passwordInput = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 20000);
      console.log('Password input located');

      // Wait for the login button to be present
      const loginButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 20000);
      console.log('Login button located');

      await emailInput.sendKeys('aayush@email.com');
      await passwordInput.sendKeys('pass123');
      await loginButton.click();
      console.log('Login form submitted');

      // Wait for redirection to the home page
      await driver.wait(until.urlContains('/stu/dashboard'), 20000);
      console.log('Navigated to /home');

      // Navigate to the help page
      await driver.get('http://localhost:5173/stu/help');
      console.log('Navigated to /help');

      // Wait for the help content to load
      const helpSection = await driver.wait(until.elementLocated(By.css('.help-section')), 20000);
      console.log('Help section displayed');

      // Verify that the "Step 1: Assignment Submission" section is displayed
      const step1Heading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="Step 1: Assignment Submission"]')), 20000);
      expect(step1Heading).toBeTruthy();
      console.log('Step 1: Assignment Submission section displayed');

      // Verify that the "Step 2: AI Analysis" section is displayed
      const step2Heading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="Step 2: AI Analysis"]')), 20000);
      expect(step2Heading).toBeTruthy();
      console.log('Step 2: AI Analysis section displayed');

      // Verify that the "Step 3: Feedback Generation" section is displayed
      const step3Heading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="Step 3: Feedback Generation"]')), 20000);
      expect(step3Heading).toBeTruthy();
      console.log('Step 3: Feedback Generation section displayed');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
