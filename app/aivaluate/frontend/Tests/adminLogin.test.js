const { Builder, By, until } = require('selenium-webdriver');

describe('Selenium Admin Login Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Login test with Selenium', async () => {
    await driver.get('http://localhost:5173/admin/login');

    const emailInput = await driver.findElement(By.xpath('//input[@placeholder="Email Address"]'));
    const passwordInput = await driver.findElement(By.xpath('//input[@placeholder="Password"]'));
    const loginButton = await driver.findElement(By.xpath('//button[@type="submit" and text()="Login"]'));

    await emailInput.sendKeys('admin@email.com');
    await passwordInput.sendKeys('pass123');
    await loginButton.click();

    await driver.wait(until.urlContains('/admin/evaluatormanager'), 5000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/admin/evaluatormanager');
  });
});
