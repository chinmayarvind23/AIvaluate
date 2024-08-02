import { Builder, By, until } from 'selenium-webdriver';
import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';

describe('Selenium Signup Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Signup page loads and allows user to create an account', async () => {
    try {
      await driver.get('http://localhost:5173/stu/signup');

      // Debugging: Log to check if the page loaded
      console.log('Navigated to /stu/signup');

      // Wait for the first name input to be present
      const firstNameInput = await driver.wait(until.elementLocated(By.css('input[placeholder="First Name"]')), 20000);
      console.log('First name input located');

      // Wait for the last name input to be present
      const lastNameInput = await driver.wait(until.elementLocated(By.css('input[placeholder="Last Name"]')), 20000);
      console.log('Last name input located');

      // Wait for the email input to be present
      const emailInput = await driver.wait(until.elementLocated(By.css('input[placeholder="Email Address"]')), 20000);
      console.log('Email input located');

      // Wait for the password input to be present
      const passwordInput = await driver.wait(until.elementLocated(By.css('input[placeholder="Password"]')), 20000);
      console.log('Password input located');

      // Wait for the confirm password input to be present
      const confirmPasswordInput = await driver.wait(until.elementLocated(By.css('input[placeholder="Confirm Password"]')), 20000);
      console.log('Confirm password input located');

      // Wait for the create account button to be present
      const createAccountButton = await driver.wait(until.elementLocated(By.css('button.auth-submit')), 20000);
      console.log('Create account button located');

      await firstNameInput.sendKeys('John');
      await lastNameInput.sendKeys('Doe');
      await emailInput.sendKeys('doe@example.com');
      await passwordInput.sendKeys('password123');
      await confirmPasswordInput.sendKeys('password123');
      await createAccountButton.click();
      console.log('Signup form submitted');

      // Wait for redirection to the login page
      await driver.wait(until.urlContains('/stu/login'), 20000);
      console.log('Navigated to /stu/login');

      // Verify that the user is redirected to the login page
      const loginHeading = await driver.wait(until.elementLocated(By.xpath('//h2[text()="Login"]')), 20000);
      expect(loginHeading).toBeTruthy();
      console.log('Login heading displayed');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
