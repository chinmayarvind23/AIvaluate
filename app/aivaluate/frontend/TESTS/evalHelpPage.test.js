import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Eval Help Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Eval Help page loads and displays content', async () => {
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

      // Wait for redirection to the evaluator home page
      await driver.wait(until.urlContains('/eval/dashboard'), 20000);
      console.log('Navigated to /eval/dashboard');

      // Navigate to the eval help page
      await driver.get('http://localhost:5173/eval/help');
      console.log('Navigated to /eval/help');

      // Wait for the help content to load
      const helpSection = await driver.wait(until.elementLocated(By.css('.help-section')), 20000);
      console.log('Help section displayed');

      // Verify that the "Home" section is displayed
      const homeHeading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="Home"]')), 20000);
      expect(homeHeading).toBeTruthy();
      console.log('Home section displayed');

      // Verify that the "Student Grades" section is displayed
      const studentGradesHeading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="Student Grades"]')), 20000);
      expect(studentGradesHeading).toBeTruthy();
      console.log('Student Grades section displayed');

      // Verify that the "Assignments" section is displayed
      const assignmentsHeading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="Assignments"]')), 20000);
      expect(assignmentsHeading).toBeTruthy();
      console.log('Assignments section displayed');

      // Verify that the "Students" section is displayed
      const studentsHeading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="Students"]')), 20000);
      expect(studentsHeading).toBeTruthy();
      console.log('Students section displayed');

      // Verify that the "All Submissions" section is displayed
      const allSubmissionsHeading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="All Submissions"]')), 20000);
      expect(allSubmissionsHeading).toBeTruthy();
      console.log('All Submissions section displayed');

      // Verify that the "Rubrics" section is displayed
      const rubricsHeading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="Rubrics"]')), 20000);
      expect(rubricsHeading).toBeTruthy();
      console.log('Rubrics section displayed');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});

