import { Builder, By, until } from 'selenium-webdriver';
import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';

describe('Selenium Dashboard Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Dashboard page loads and displays content', async () => {
    try {
      await driver.get('http://localhost:5173/stu/login');

      // Debugging: Log to check if the page loaded
      console.log('Navigated to /stu/login');

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

      // Wait for redirection to the dashboard page
      await driver.wait(until.urlContains('/stu/dashboard'), 20000);
      console.log('Navigated to /stu/dashboard');

      // Wait for the message container to load
      const messageContainer = await driver.wait(until.elementLocated(By.css('.message-container')), 20000);
      console.log('Message container displayed');

      // Verify that the notification text is displayed
      const notificationText = await driver.wait(until.elementLocated(By.css('.notification-text')), 20000);
      expect(notificationText).toBeTruthy();
      console.log('Notification text displayed');

      // Verify that the courses heading is displayed
      const coursesHeading = await driver.wait(until.elementLocated(By.xpath('//h1[text()="Your courses..."]')), 20000);
      expect(coursesHeading).toBeTruthy();
      console.log('Courses heading displayed');

      
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
