import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Admin Help Page Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();

    await driver.get('http://localhost:5173/admin/login');

    // Login as admin
    const emailInput = await driver.wait(until.elementLocated(By.name('email')), 5000);
    const passwordInput = await driver.wait(until.elementLocated(By.name('password')), 5000);
    const loginButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 5000);

    await emailInput.sendKeys('admin@email.com');
    await passwordInput.sendKeys('pass123');
    await loginButton.click();

    // Wait for redirection to the admin home page
    await driver.wait(until.urlContains('/admin/home'), 5000);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Admin Help page loads and displays content', async () => {
    await driver.get('http://localhost:5173/admin/help');

    // Wait for the help content to load
    const helpSection = await driver.wait(until.elementLocated(By.css('.help-section')), 5000);

    // Verify that the help section is displayed
    expect(helpSection).toBeTruthy();

    // Verify that the Evaluator Manager section is displayed
    const evaluatorManagerHeading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="Evaluator Manager"]')), 5000);
    expect(evaluatorManagerHeading).toBeTruthy();

    // Verify that the Student Manager section is displayed
    const studentManagerHeading = await driver.wait(until.elementLocated(By.xpath('//h3[text()="Student Manager"]')), 5000);
    expect(studentManagerHeading).toBeTruthy();
  });

  // Add more tests here that will reuse the login session
});
