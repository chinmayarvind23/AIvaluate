import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Admin Create Account Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Admin Create Account page loads and submits form', async () => {
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

      // Navigate to the Create Account page
      await driver.get('http://localhost:5173/admin/CreateAccPT');
      console.log('Navigated to /admin/CreateAccPT');

      // Wait for the Create Account page content to load
      const createAccountSection = await driver.wait(until.elementLocated(By.css('.CreateAccPT-content')), 20000);
      console.log('Create Account section displayed');

      // Fill out the form
      const firstNameInput = await driver.wait(until.elementLocated(By.css('input[name="firstName"]')), 20000);
      const lastNameInput = await driver.wait(until.elementLocated(By.css('input[name="lastName"]')), 20000);
      const emailFormInput = await driver.wait(until.elementLocated(By.css('input[name="email"]')), 20000);
      const passwordFormInput = await driver.wait(until.elementLocated(By.css('input[name="password"]')), 20000);
      const taCheckbox = await driver.wait(until.elementLocated(By.css('input[type="checkbox"]')), 20000);
      const submitButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 20000);

      await firstNameInput.sendKeys('John');
      await lastNameInput.sendKeys('Doe');
      await emailFormInput.sendKeys('john.doe@email.com');
      await passwordFormInput.sendKeys('Password1');
      await taCheckbox.click();
      console.log('Form filled out');

      // Submit the form
      await submitButton.click();
      console.log('Form submitted');

      // Wait for the confirmation dialog to be displayed
      const confirmButton = await driver.wait(until.elementLocated(By.xpath('//div[contains(@class, "custom-ui")]//button[text()="Confirm"]')), 20000);
      console.log('Confirmation dialog displayed');

      // Click the confirm button
      await confirmButton.click();
      console.log('Confirmation dialog confirmed');

      // Verify that the message is displayed
      expect(message).toBeTruthy();

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
