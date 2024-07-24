import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Submit Assignment Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Submit Assignment page loads and allows file upload', async () => {
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

      // Navigate to the submit assignment page
      await driver.get('http://localhost:5173/stu/submit/1/1'); // Update with appropriate courseId and assignmentId
      console.log('Navigated to /stu/submit/1/1');

      // Wait for the assignment details to load
      const assignmentDetails = await driver.wait(until.elementLocated(By.css('.assignment-container')), 30000);
      console.log('Assignment details section displayed');

      // Verify that the assignment title is displayed
      const assignmentTitle = await driver.wait(until.elementLocated(By.css('.assignment-title')), 30000);
      console.log('Assignment title located');
      expect(assignmentTitle).toBeTruthy();

      // Verify that the file upload section is displayed
      const fileUploadSection = await driver.wait(until.elementLocated(By.css('.file-upload')), 30000);
      console.log('File upload section located');
      expect(fileUploadSection).toBeTruthy();

      // Upload a test file
      const fileInput = await driver.findElement(By.css('input[type="file"]'));
      await fileInput.sendKeys('/path/to/testfile.js'); // Update with the path to a test file on your machine
      console.log('Test file uploaded');

      // Verify that the uploaded file is displayed
      const uploadedFile = await driver.wait(until.elementLocated(By.css('.uploaded-files-container ul li')), 30000);
      console.log('Uploaded file located');
      expect(uploadedFile).toBeTruthy();

      // Submit the assignment
      const submitButton = await driver.findElement(By.css('.submit-button'));
      await submitButton.click();
      console.log('Submit button clicked');

      // Verify that the success message is displayed
      const successMessage = await driver.wait(until.alertIsPresent(), 30000);
      console.log('Success message displayed');
      expect(successMessage).toBeTruthy();

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
