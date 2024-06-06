# System Design Plan - Team 8 (AI-powered web-development course platform - AIValuate)

## Introduction

The goal of our project is to produce dependable, robust, and user-friendly software capable of effectively and efficiently grading students HTML, CSS, and JavaScript files that they submit for evaluation with the assistance of AI. This will be done using prompts provided by the professor where in return, insightful and accurate grading feedback will be provided to both the student and the instructor allowing both the students and instructors to engage with our web-based application in a dynamic manner, allowing for students to understand problem areas within their submissions and work on them and allow for instructors to spend less time grading, and more time helping students and developing the course to be the best it can poissibly be.

## System Architecture Design

### System Architecture Diagram
![Screenshot 2024-06-05 123506](https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/123427375/a2d6dbbf-eae3-4273-a6ef-ad3fe66dbea1)

### System Architecture pattern
#### Microservice architecture 
We aim to put every backend system component in its own containers to remove dependencies. This will also help us isolate, test, and deploy individual parts of our system without needing to run the system as a whole. In our case, the database, the frontend, the AI model, the reverse proxy, and each group of the backend service will be dockerized separately.


### System Components
- Reverse Proxy/Frontend: This acts as an intermediary between the user and the system; it forwards the client’s request to the web server and will decide which user portal will be displayed. The frontend will consist of three different user portals: the instructor portal, the student portal, and the administrator portal. The frontend requests will be sent to the backend, where they are handled; then, after the requests are processed, data will be returned from the backend to the frontend, allowing users to view it.
  
- Backend: The backend receives frontend user requests and processes them by accessing the database or the chatGPT AI component through an API. It will consist of five main services, the assignment grading service, the course management service, the notification service, the status monitoring service and the file uploading service. Each service will be put in a separate container to remove dependencies. These services communicate with the front end, the database, the AI component and the file storage component. Once the request is received from the front-end components, the backend will handle the request by accessing either the AI component or the file storage component or reading/writing data from the database; finally, backend services will reflect the result and show it on the front end. 
- AI Model: The AI component talks directly with the backend. The backend sends prompts, rubrics, and student assignments to the AI component through the OpenAI API. The AI model then utilizes the prompts and uploaded files to create feedback and a mark, which the backend will receive.
  
- Database: The database will store important relational data such as classes, students, professors, admins, assignments, etc. It will not, however, save the file submissions sent in by the students. The data will be created, accessed, updated or deleted by the backend services.
  
- Amazon Simple Storage Service (S3): Because file submissions can be quite large, we will be using Amazon S3 to store all student file submissions. This will be connected to the backend file uploading service. It stores the actual files students and instructors upload. Then, the reference to such files will be stored in the database.


## Use Case Models

Our AI-powered web-development course platform has a multitude of use cases for the 4 defined user groups (students, instructors, teaching assistants (TAs), and system administrators). The use cases are how the product will be used by each type of user from the user groups. The use case diagram and its justification below it will explain this deeply, and similarly, the UML diagram will detail the attributes (functionalities) of each class showing how these classes for different types of users and functionalities within the system will operate in relation to each other, leading to our product working. The usage scenarios will describe in further detail what the use case diagram depicts, and the journey lines will detail the user's satisfiability with our software using an X-axis representing the actions that user will take with the system as well as the system's own actions and time, wherreas the Y-axis will represent user satisfiability, with anything above the X-axis meaning that the user is satisfied, and anything below it would mean that the user is not satisfied with the result of the current action.

## Use Case Diagram & Use Case Descriptions

<img width="1409" alt="Use Case Diagram" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/3865884b-cf59-4ca9-8a5c-d256faa9cdbd">

(If the image is too small, either right click the image and open in new tab to zoom in, or click the following link: https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/tree/design-plan/docs/design/System%20Design and click on the Use Case diagram)

**Use case 1:** 

Primary actor:

Description:

Precondition:

Postcondition:

Assumptions:

Main scenario (3-9 steps):

1.

2.

3.

4.

Extensions:

1a. describe extension to step 1 as a condition from main scenario if any that will need different handling
    
    1a1. action to handle the extension condition

## UML Class Diagram

<img width="1352" alt="UML Diagram" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/29265f12-ea67-47a1-91e4-33cd6e5ec444">

(If the image is too small, either right click the image and open in new tab to zoom in, or click the following link: https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/tree/design-plan/docs/design/System%20Design and click on the UML Class diagram)

The above UML (Unified Modeling Language) class diagram has 12 classes in total, with several relations

## Journey Lines

<img width="1134" alt="Journey Line 1_ Instructor assignment supervision" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/63f29a9b-2eb4-443a-9385-e53db0566b5e">

<img width="1238" alt="Journey Line 2_ Instructor grading and feedback" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/681fbc12-afd5-426a-aa20-9d66705d720a">

<img width="1391" alt="Journey Line 3_ Student submissions and feedback" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/ef3f265c-f6ca-4ef5-aae5-0327a97a7d2e">

<img width="1458" alt="Journey Line 4_ System Administrator course supervision   permissions" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/cd19fefe-143d-44b8-8a80-64de403126f8">

(If the images are too small, either right click the image and open in new tab to zoom in, or click the following link: https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/tree/design-plan/docs/design/System%20Design and click on the Journey Lines 1 - 4)

Brief description of each journey line within 1-2 sentences.

## Database Design

## ER Diagram

The following ER (Entity Relationship) diagram details our how the data within our database is modelled via the creation of tables to support differnet entities interacting with eachother to make the system function efficiently and effectively:

<img width="1382" alt="ER Diagram" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/d5088ad5-0fba-4ec9-bb06-f39cd16af591">

(If the image is too small, either right click the image and open in new tab to zoom in, or click the following link: https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/tree/design-plan/docs/design/System%20Design and click on the ER diagram)

## Database Design Justification

Our database is modeled in
Why is our data modelled the way it is? purpose of each table and attribute

## Data Flow Diagram (Level 0/Level 1)

DFD Level 0

<img width="939" alt="Screenshot 2024-06-05 at 4 43 36 PM" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/97553042/3e36477a-e838-4c57-aa85-451df74630af">




DFD Level 1 

<img width="967" alt="Screenshot 2024-06-05 at 4 41 37 PM" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/97553042/16cc7cbb-3c16-4f81-a42c-3f835c45162f">

####High-Level Context Diagram

This diagram illustrates the primary external entities and how they interact with the system:<br>

-Instructor: Oversees courses, assignments, and the grading process.<br>
-Student: Completes and submits assignments, and retrieves grades and feedback.<br>
-Admin: Administers the overall system configurations and manages user permissions.<br>





## User Interface (UI) Design

UI mock-ups (minimal, but need to know interaction flow of the application, diagram to explain the navigation flow for the MVP prototype (and any alternate flows)).  Think about usability, accessibility, desktop and mobile uses.

### Student Interface
When a student enters the url to the AIvaluate website they will be met with the login/sign up page. Students can login if they already have an existing account or sign up if it is their first time visiting the site.
![Signup](/docs/ui-design/1.png)
![Login](/docs/ui-design/2.png)
If a student forgets their password they can submit their email and they will be emailed a link to change there password if a user exists with that email.
![Forgot Password](/docs/ui-design/3.png)
![Change password from forgot pass request](/docs/ui-design/4.png)
Upon login students will be shown their dashboard/homepage. Here they can select a course, or via the drop down menu, visit account page, join a course, get help, or log out.
![Student dashboard](/docs/ui-design/5.png)
![Join Course](/docs/ui-design/6.png)
![student drop down menu](/docs/ui-design/7.png)
![Evaluator drop down menu](/docs/ui-design/8.png)
![Account](/docs/ui-design/9.png)
Students can visit the help page for instructions of how to use the website.
![Get help](/docs/ui-design/11.png)
After clicking on a course the student can view their grades for the course in the grades tab.
![Grade: student view](/docs/ui-design/12.png)
When clicking on the assignments tab students can view all complete assignments. Each assignment can be clicked on to view more information such as assignment descriptions or grade/AI and professor feedback.
![Assignments: student view](/docs/ui-design/13.png)
![Single assignment feedback: student view](/docs/ui-design/14.png)
![Single assignment submission: student view](/docs/ui-design/15.png)
Student can click on the people tab to see a list of all other students enrolled in the class.
![People: student view](/docs/ui-design/16.png)
Student can click on the Submissions tab and see all of their submissions for this course.
![Submissions: student view](/docs/ui-design/17.png)

### Evaluator Interface.
The login page for T.A. and professor look different then the login page for the students because they cannot create an account themselves. Instead the Admin must create an account for them. Note: The admin page login will also look the same as this.
![Evaluator/admin login](/docs/ui-design/login.png)
The professor dashboard looks very similar to a student dashboard but gives them the ability to create a course.
![Create Course](/docs/ui-design/10.png)
Professors can visit the help page for instructions of how to use the website.
![Get help](/docs/ui-design/11.png)
Upon clicking on the assignments the evaluator can see specific assignments. They can click on these to view all of the students submissions. Or to view or edit assignment criteria. From here they can also browse assignments of create a new assignment.
![All submissions: prof view](/docs/ui-design/20.png)
![All specific submissions: prof view](/docs/ui-design/19.png)
The professor can create an assignment by creating a new rubric or reusing a past one.
![Create assignment: prof view](/docs/ui-design/24.png)
Professor or T.A. can click to view a students submission of an assignment and can view the AI feedback. The evaluator must confirm the students score before it is considered marked. The Evaluator may also edit the due date for this specific student. Finally the evaluator can write their own comments on the assignment submission and mark the evaluation as complete.
![Submitted assignment: prof view](/docs/ui-design/18.png)
Professors can see whether or not an assignment is published or not and edit everything on an assignment such as due date, name, and description/rubric. they can also publish or unpublish an assignment.
![Assignment Unpublished: prof view](/docs/ui-design/21.png)
![Assignment published: student view](/docs/ui-design/22.png)
Once all assignments submissions are marked for a specific assignment, the professor can publish the grades to the students or hide the grades from the students.
![Assignment submissions and publish grades: prof view](/docs/ui-design/23.png)
Professor can view the averages of student grades from assignments so they know how their students are doing in the course.
![Student grades: prof view](/docs/ui-design/25.png)
Professor can review all past rubrics from this any course as they are all saved.
![Selected rubricc: prof view](/docs/ui-design/26.png)
![All past rubrics: prof view](/docs/ui-design/27.png)

### Admin Interface
The admin can view or search the list of students that have an account at AIvaluate. These users can be selected to allow the admin to view more information
![Student manager, all students view: Admin view](/docs/ui-design/28.png)
A selected student profile contains their course information and the Admin can drop them from a course. The admin can also delete a user.
![Student manager, single students view: Admin view](/docs/ui-design/29.png)
The admin can view or search the list of T.A.'s and Instructors that have an account at AIvaluate. These users can be selected to allow the admin to view more information. Admin can user sign a evaluator up for an account.
![Evaluator manager: all evaluators: Admin view](/docs/ui-design/30.png)
A selected evaluator profile contains their course access information and the Admin can remove the professor from a course. The admin can also delete an evaluator or select whether or not they are a teaching assistant.
![Evaluator signup: Admin view](/docs/ui-design/32.png)
![Evaluator manager: Single evaluator: Admin view](/docs/ui-design/31.png)
