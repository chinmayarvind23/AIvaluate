import { Builder, By, until } from 'selenium-webdriver';

describe('Selenium Admin Home Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Admin Home page loads and displays students', async () => {
    await driver.get('http://localhost:5173/admin/login');

    // Login as admin
    const emailInput = await driver.findElement(By.name('email'));
    const passwordInput = await driver.findElement(By.name('password'));
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));

    await emailInput.sendKeys('admin@email.com');
    await passwordInput.sendKeys('pass123');
    await loginButton.click();

    // Wait for redirection to the admin home page
    await driver.wait(until.urlContains('/admin/home'), 5000);

    // Wait for the student list to load
    await driver.wait(until.elementsLocated(By.css('.student-list li')), 5000);

    // Verify that at least one student is displayed
    const studentItems = await driver.findElements(By.css('.student-list li'));
    expect(studentItems.length).toBeGreaterThan(0);

    // Select the first student
    const firstStudent = studentItems[0];
    await firstStudent.click();

    // Wait for the student details to load
    await driver.wait(until.elementLocated(By.css('.user-details')), 5000);

    // Verify that student details are displayed
    const userDetails = await driver.findElement(By.css('.user-details'));
    expect(userDetails).toBeTruthy();

    // Click the back button
    const backButton = await driver.findElement(By.css('.back-button'));
    await backButton.click();

    // Verify that the student list is displayed again
    await driver.wait(until.elementsLocated(By.css('.student-list li')), 5000);
  });

  test('Admin can delete a student', async () => {
    await driver.get('http://localhost:5173/admin/login');

    // Login as admin
    const emailInput = await driver.findElement(By.name('email'));
    const passwordInput = await driver.findElement(By.name('password'));
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));

    await emailInput.sendKeys('admin@email.com');
    await passwordInput.sendKeys('pass123');
    await loginButton.click();

    // Wait for redirection to the admin home page
    await driver.wait(until.urlContains('/admin/home'), 5000);

    // Wait for the student list to load
    await driver.wait(until.elementsLocated(By.css('.student-list li')), 5000);

    // Select the first student
    const studentItems = await driver.findElements(By.css('.student-list li'));
    const firstStudent = studentItems[0];
    await firstStudent.click();

    // Wait for the student details to load
    await driver.wait(until.elementLocated(By.css('.user-details')), 5000);

    // Click the delete button
    const deleteButton = await driver.findElement(By.css('.delete-button'));
    await deleteButton.click();

    // Confirm deletion by checking the student is removed from the list
    await driver.wait(until.stalenessOf(firstStudent), 5000);
  });

  test('Admin can drop a course for a student', async () => {
    await driver.get('http://localhost:5173/admin/login');

    // Login as admin
    const emailInput = await driver.findElement(By.name('email'));
    const passwordInput = await driver.findElement(By.name('password'));
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));

    await emailInput.sendKeys('admin@email.com');
    await passwordInput.sendKeys('pass123');
    await loginButton.click();

    // Wait for redirection to the admin home page
    await driver.wait(until.urlContains('/admin/home'), 5000);

    // Wait for the student list to load
    await driver.wait(until.elementsLocated(By.css('.student-list li')), 5000);

    // Select the first student
    const studentItems = await driver.findElements(By.css('.student-list li'));
    const firstStudent = studentItems[0];
    await firstStudent.click();

    // Wait for the student details to load
    await driver.wait(until.elementLocated(By.css('.user-details')), 5000);

    // Check if the student has courses
    const courseItems = await driver.findElements(By.css('.student-list li'));
    if (courseItems.length > 0) {
      // Drop the first course
      const firstCourse = courseItems[0];
      const dropButton = await firstCourse.findElement(By.css('.delete-button'));
      await dropButton.click();

      // Confirm the course is dropped
      await driver.wait(until.stalenessOf(firstCourse), 5000);
    }
  });
});
