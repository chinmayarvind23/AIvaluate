import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Admin Login Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Admin login and redirection to evaluator manager', async () => {
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

    // Wait for redirection to the evaluator manager dashboard
    await driver.wait(until.urlContains('/admin/evaluatormanager'), 20000);
    console.log('Navigated to /admin/evaluatormanager');

    // Verify that the evaluator manager page has loaded
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/admin/evaluatormanager');
  });
});
