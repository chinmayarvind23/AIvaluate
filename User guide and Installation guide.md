# User Guide and Installation Guide for AIValuate

This user guide is designed to help users navigate and utilize the different functionalities of the project. The guide is divided into three sections based on user roles: Student, Evaluator, and Admin. Each section provides detailed instructions on accessing and using the features relevant to each role. Additionally, an installation guide is included to ensure the software is correctly set up on a user's machine.

## Table of Contents
- [Installation Guide](#installation-guide)
- [Student Guide](#student-guide)
  - [Dashboard](#dashboard)
  - [Join a Course](#join-a-course)
  - [Grades](#grades)
  - [Assignments](#assignments)
  - [People](#people)
  - [Submissions](#submissions)
  - [Further Assistance](#further-assistance)
- [Evaluator Guide](#evaluator-guide)
  - [Dashboard](#dashboard-1)
  - [Create a Course](#create-a-course)
  - [Management](#management)
  - [Student Grades](#student-grades)
  - [Assignments](#assignments-1)
  - [Students](#students)
  - [All Submissions](#all-submissions)
  - [Using Rubrics](#using-rubrics)
  - [Using the AI Tool to Grade Assignments](#using-the-ai-tool-to-grade-assignments)
  - [Further Assistance](#further-assistance-1)
- [Admin Guide](#admin-guide)
  - [Managing Evaluators](#managing-evaluators)
  - [Managing Students](#managing-students)
  - [Further Assistance](#further-assistance-2)

## Installation Guide
To ensure the software runs smoothly on a user's machine, follow these steps:

- **Download Docker and VS Code:**
  - Ensure Docker is installed on your desktop and ready to accept containers. If Docker is not installed, download and install it from [Docker's official website](https://www.docker.com/products/docker-desktop/).
  - Ensure VS Code is insalled on your desktop and install it if not [VS Code Download](https://code.visualstudio.com/download)
- **Clone the Repository:**
  - Open a terminal or command prompt.
  - Clone the project repository to your desktop by running the following command:
    ```bash
    git clone <repository_url>
    ```

- **Open the Project:**
  - Open the cloned repository in Visual Studio Code (VS Code) or your preferred code editor.

- **Navigate to the App Folder:**
  - In the terminal or command prompt, change directory to the app folder by running:
    ```bash
    cd app
    ```

- **Build and Run the Docker Containers:**
  - To connect with the containers and run the program, type the following command:
    ```bash
    docker-compose up --build
    ```

- **Access the Application:**
  - Open a web browser and use the following URLs to access the respective login pages:
    - **Student Login Page:** [http://localhost:5173/stu/login](http://localhost:5173/stu/login)
    - **Evaluator Login Page:** [http://localhost:5173/eval/login](http://localhost:5173/eval/login)
    - **Admin Login Page:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

By following these steps, you will be able to set up and run the software on your machine successfully. If you encounter any issues during the installation process, please refer to the user guide sections for each role for further assistance or contact support at aivaluateoffical@gmail.com.

## Student Guide
### Dashboard 
- **Accessing the Dashboard:**
  - Log in to view the main dashboard.
  - Here, you can see all courses and notifications at a glance.

### Join a Course
- **How to Join a Course:**
  - Navigate to 'Join a Course' from the dashboard using the navbar.
  - Select the course you wish to join from the list provided.

### Grades 
- **Viewing Your Grades:**
  - Navigate to 'Grades' to view your grade summary.
  - Click on an assignment name to view the submissions and grades for that particular assignment.

### Assignments 
- **Submitting Assignments:**
  - Access the 'Assignments' section to view and submit assignments.

### People 
- **Viewing the Student List:**
  - Select 'People' from the menu to see a list of all students enrolled in the course.

### Submissions 
- **Reviewing Submissions:**
  - Click on 'Submissions' to review all assignments submitted.
  - This feature allows you to track your submissions and any feedback provided.

### Further Assistance
- **Contact Support:**
  - If you require additional support or have any questions, please contact us at aivaluateoffical@gmail.com.

## Evaluator Guide
### Dashboard
- **Accessing the Dashboard:** 
  - Log in to view the main dashboard.
  - Here, you can see all courses and notifications at a glance.

### Create a Course
- **Creating a Course:**
  - Navigate to 'Create a Course' from the dashboard.
  - Provide the necessary course details and assign any teaching assistants as needed.
  - Click 'Create Course' to add the new course.

### Management
- **Edit Course:**
  - Modify and update the course information as required.
- **Assign TA:**
  - Allocate Teaching Assistants to the course to assist with administrative and grading duties.
- **Archive Course:**
  - Temporarily disable the course from the active list without deleting historical data or student records.
- **Delete Course:**
  - Permanently remove the course and all its associated data from the system. This action is irreversible.

### Student Grades
- **Managing Grades:**
  - Navigate to 'Student Grades' to view grade summary.
  - Click on an assignment name to view the submissions and grades for that particular assignment.

### Assignments
- **Creating and Managing Assignments:**
  - Go to the 'Assignments' section to create new assignments.
  - Fill out the form with the assignment name, assignment rubric, max points, and upload the solution.

### Students
- **Viewing the Student List:**
  - Select 'Students' from the menu to see a list of all enrolled students.

### All Submissions
- **Reviewing Submissions:**
  - Click on 'All Submissions' to review all assignments by students.

### Using Rubrics
- **Using Rubrics:**
  - Under 'Rubrics', create and modify scoring criteria for assignments.
  - Select an assignment to apply a rubric and ensure grading consistency and transparency.

### Using the AI Tool to Grade Assignments
- **AI Grading:**
  - Navigate to the 'Assignments' section and select the assignment you wish to grade.
  - Click on the 'Use AI to Grade' button.
  - Review the AI-generated grades and feedback.
  - Adjust grades or feedback if necessary.
  - Confirm and finalize the grades to be recorded in the system.

### Further Assistance
- **Contact Support:**
  - If you require additional support or have any questions, please contact us at aivaluateoffical@gmail.com.

## Admin Guide
### Managing Evaluators
- **Adding a New Evaluator:**
  - Navigate to the Evaluator Manager in the Admin Home Portal.
  - Click on 'Add Evaluator', fill out the evaluator's profile details, and submit.
- **Searching for an Evaluator:**
  - Use the search bar at the top of the Evaluator Manager to quickly find evaluators by name.
  - Enter the name of the evaluator and press enter.
- **Updating Evaluator Profiles:**
  - Select an evaluator from the list, click 'Edit', make any necessary changes to their profile, and save your updates.
- **Assigning a TA Role:**
  - Use the 'Prof' slider button located below their name to assign an evaluator as a TA. Click and confirm this selection.
- **Removing an Evaluator:**
  - Click the 'Delete user' button next to the evaluator's details and confirm the deletion to remove them from the system.

### Managing Students
- **Searching for a Student:**
  - Use the search bar at the top of the Student Manager to quickly locate students by name. Type the student's name and press enter.
- **Updating Student Profiles:**
  - Select a student from the list, click 'Edit', make any necessary changes to their profile, and save your updates.
- **Dropping Courses:**
  - In the student's profile, use the 'Drop' button in front of each course to manage their courses.
- **Deleting a Student Account:**
  - To remove a student completely, click the 'Delete user' button at the bottom of their profile and confirm the deletion.

### Further Assistance
- **Contact Support:**
  - If you require additional support or have any questions, please contact us at aivaluateoffical@gmail.com.

























