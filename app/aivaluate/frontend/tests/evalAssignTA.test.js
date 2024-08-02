import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Assign TA Modal Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Assign TA modal loads and displays content', async () => {
    try {
      await driver.get('http://localhost:5173/eval/login');

      // Debugging: Log to check if the page loaded
      console.log('Navigated to /eval/login');

      // Wait for the email input to be present
      const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 20000);
      console.log('Email input located');

      // Wait for the password input to be present
      const passwordInput = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 20000);
      console.log('Password input located');

      // Wait for the login button to be present
      const loginButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 20000);
      console.log('Login button located');

      await emailInput.sendKeys('testprof@email.com');
      await passwordInput.sendKeys('pass123');
      await loginButton.click();
      console.log('Login form submitted');

      // Wait for redirection to the evaluator dashboard page
      await driver.wait(until.urlContains('/eval/dashboard'), 20000);
      console.log('Navigated to /eval/dashboard');

      // Navigate to the course management page
      await driver.get('http://localhost:5173/eval/coursehome/1'); // Adjust the URL to match your route
      console.log('Navigated to /eval/course/1');

      // Open the Assign TA Modal
      const assignTaButton = await driver.wait(until.elementLocated(By.css('button.assign-ta-button')), 20000);
      await assignTaButton.click();
      console.log('Assign TA button clicked');

      // Wait for the modal to be displayed
      const modal = await driver.wait(until.elementLocated(By.css('.ta-modal')), 20000);
      console.log('Assign TA modal displayed');
      expect(modal).toBeTruthy();

      // Verify that the modal title is displayed
      const modalTitle = await driver.wait(until.elementLocated(By.css('.modal-title')), 20000);
      console.log('Modal title displayed');
      expect(modalTitle.getText()).toBe('Assign Teaching Assistants');

      // Verify that the TA list is displayed
      const taList = await driver.wait(until.elementLocated(By.css('.ta-list')), 20000);
      console.log('TA list displayed');
      expect(taList).toBeTruthy();

      // Check the first TA in the list
      const firstTaCheckbox = await driver.wait(until.elementLocated(By.css('.ta-list .ta-item input[type="checkbox"]')), 20000);
      await firstTaCheckbox.click();
      console.log('First TA checkbox clicked');

      // Save the selection
      const saveButton = await driver.wait(until.elementLocated(By.css('.ta-save-button')), 20000);
      await saveButton.click();
      console.log('Save button clicked');

      // Verify that the modal is closed
      await driver.wait(until.stalenessOf(modal), 20000);
      console.log('Modal closed');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
