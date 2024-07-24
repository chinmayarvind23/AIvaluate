import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Course Home Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Course Home page loads and displays course details', async () => {
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

      // Navigate to the course home page
      await driver.get('http://localhost:5173/eval/coursehome/1');
      console.log('Navigated to /eval/course-home');

      // Wait for the course management content to load
      const courseManagementHeading = await driver.wait(until.elementLocated(By.css('h1')), 20000);
      expect(courseManagementHeading).toBeTruthy();
      console.log('Course management content displayed');

      // Verify that the AI Test button is displayed
      const aiTestButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="AI Test"]')), 20000);
      expect(aiTestButton).toBeTruthy();
      console.log('AI Test button displayed');

      // Verify that the Edit Course button is displayed
      const editCourseButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Edit Course"]')), 20000);
      expect(editCourseButton).toBeTruthy();
      console.log('Edit Course button displayed');

      // Verify that the Assign TA button is displayed
      const assignTaButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Assign TA"]')), 20000);
      expect(assignTaButton).toBeTruthy();
      console.log('Assign TA button displayed');

      // Verify that the Archive Course button is displayed
      const archiveCourseButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Archive Course"]')), 20000);
      expect(archiveCourseButton).toBeTruthy();
      console.log('Archive Course button displayed');

      // Verify that the Delete Course button is displayed
      const deleteCourseButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Delete Course"]')), 20000);
      expect(deleteCourseButton).toBeTruthy();
      console.log('Delete Course button displayed');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
