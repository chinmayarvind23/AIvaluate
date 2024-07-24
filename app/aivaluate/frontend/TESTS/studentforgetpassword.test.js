import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Forgot Password Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Forgot Password page loads and submits form', async () => {
    try {
      await driver.get('http://localhost:5173/stu/forgotpassword');

      // Debugging: Log to check if the page loaded
      console.log('Navigated to /stu/forgotpassword');

      // Wait for the email input to be present
      const emailInput = await driver.wait(until.elementLocated(By.css('input[placeholder="Email Address"]')), 30000);
      console.log('Email input located');

      // Wait for the confirm email input to be present
      const confirmEmailInput = await driver.wait(until.elementLocated(By.css('input[placeholder="Confirm Email Address"]')), 30000);
      console.log('Confirm Email input located');

      // Wait for the submit button to be present
      const submitButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 30000);
      console.log('Submit button located');

      await emailInput.sendKeys('aayush@email.com');
      await confirmEmailInput.sendKeys('aayush@email.com');
      await submitButton.click();
      console.log('Forgot Password form submitted');

      // Wait for a success or error message to be displayed
      const message = await driver.wait(until.elementLocated(By.css('.message, .error-message')), 30000);
      console.log('Message displayed');

      // Verify that the message is displayed
      expect(message).toBeTruthy();

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
