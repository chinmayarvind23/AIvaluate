# System Design Plan - Team 8 (AI-powered web-development course platform - AIValuate)

## Introduction

The goal of our project is to produce dependable, robust, and user-friendly software capable of effectively and efficiently grading students HTML, CSS, and JavaScript files that they submit for evaluation with the assistance of AI. This will be done using prompts provided by the professor where in return, insightful and accurate grading feedback will be provided to both the student and the instructor allowing both the students and instructors to engage with our web-based application in a dynamic manner, allowing for students to understand problem areas within their submissions and work on them and allow for instructors to spend less time grading, and more time helping students and developing the course to be the best it can poissibly be.

## System Architecture Design

Recall the system architecture slides and tell us which architecture pattern you are using and why (it may also be something not in the slides or be a combination). Provide more details about the components you have written, and where these components fit in the overall architecture so we can visualize how you have decomposed your system. Basically, this should all be captured in ONE diagram with the components on them and a few sentences explaining (i) why you chose this architecture and (ii) why the components are where you put them. If you want to just focus on a certain aspect of your system and not show the entire architecture for your system in the diagram, that should be fine as well.

## Use Case Models

Our AI-powered web-development course platform has a multitude of use cases for the 4 defined user groups (students, instructors, teaching assistants (TAs), and system administrators). The use cases are how the product will be used by each type of user from the user groups. The use case diagram and its justification below it will explain this deeply, and similarly, the UML diagram will detail the attributes (functionalities) of each class showing how these classes for different types of users and functionalities within the system will operate in relation to each other, leading to our product working. The usage scenarios will describe in further detail what the use case diagram depicts, and the journey lines will detail the user's satisfiability with our software using an X-axis representing the actions that user will take with the system as well as the system's own actions and time, wherreas the Y-axis will represent user satisfiability, with anything above the X-axis meaning that the user is satisfied, and anything below it would mean that the user is not satisfied with the result of the current action.

## Use Case Diagram & Use Case Descriptions

<img width="1409" alt="Use Case Diagram" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/3865884b-cf59-4ca9-8a5c-d256faa9cdbd">

Use case 1: 
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

The above UML (Unified Modeling Language) class diagram has 12 classes in total, with several relations

## Journey Lines

<img width="1134" alt="Journey Line 1_ Instructor assignment supervision" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/63f29a9b-2eb4-443a-9385-e53db0566b5e">

<img width="1238" alt="Journey Line 2_ Instructor grading and feedback" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/681fbc12-afd5-426a-aa20-9d66705d720a">

<img width="1391" alt="Journey Line 3_ Student submissions and feedback" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/ef3f265c-f6ca-4ef5-aae5-0327a97a7d2e">

<img width="1458" alt="Journey Line 4_ System Administrator course supervision   permissions" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/cd19fefe-143d-44b8-8a80-64de403126f8">

Brief description of each journey line within 1-2 sentences.

## Database Design

## ER Diagram

The following ER (Entity Relationship) diagram details our how the data within our database is modelled via the creation of tables to support differnet entities interacting with eachother to make the system function efficiently and effectively:

<img width="1382" alt="ER Diagram" src="https://github.com/UBCO-COSC499-Summer-2024/team-8-capstone-team-8/assets/144177741/d5088ad5-0fba-4ec9-bb06-f39cd16af591">

## Database Design Justification

Our database is modeled in
Why is our data modelled the way it is? purpose of each table and attribute

## Data Flow Diagram (Level 0/Level 1)

L0 (high-level context diagram) and L1 (in-depth, explain how and why the data moves the way it does within the system) diagrams to represent system data flow (key processes, data stores, data movement) with same level of abstraction as L0

## User Interface (UI) Design

UI mock-ups (minimal, but need to know interaction flow of the application, diagram to explain the navigation flow for the MVP prototype (and any alternate flows)).  Think about usability, accessibility, desktop and mobile uses.

### Student Interface
![Signup](/docs/ui-design/1.png)
![Login](/docs/ui-design/2.png)
![Forgot Password](/docs/ui-design/3.png)
![Change password from forgot pass request](/docs/ui-design/4.png)
![Student dashboard](/docs/ui-design/5.png)
![Join Course](/docs/ui-design/6.png)
![student drop down menu](/docs/ui-design/7.png)
![Evaluator drop down menu](/docs/ui-design/8.png)
![Account](/docs/ui-design/9.png)
![Create Course](/docs/ui-design/10.png)
![Get help](/docs/ui-design/11.png)
![Grade: student view](/docs/ui-design/12.png)
![Assignments: student view](/docs/ui-design/13.png)
![Single assignment feedback: student view](/docs/ui-design/14.png)
![Single assignment submittion: student view](/docs/ui-design/15.png)
![People: student view](/docs/ui-design/16.png)
![Submissions: student view](/docs/ui-design/17.png)
![Submitted assignment: prof view](/docs/ui-design/18.png)
![All specific subissions: prof view](/docs/ui-design/19.png)
![All submissions: prof view](/docs/ui-design/20.png)
![Assignment Unpublished: prof view](/docs/ui-design/21.png)
![Assignment published: studetn view](/docs/ui-design/22.png)
![Assignment submissions and publish grades: prof view](/docs/ui-design/23.png)
![Create assignment: prof view](/docs/ui-design/24.png)
![Student grades: prof view](/docs/ui-design/25.png)
![Selected rubricc: prof view](/docs/ui-design/26.png)
![All past rubrics: prof view](/docs/ui-design/27.png)
![Student manager, all students view: Admin view](/docs/ui-design/28.png)
![Student manager, single students view: Admin view](/docs/ui-design/29.png)
![Evaluator manager: all evaluators: Admin view](/docs/ui-design/30.png)
![Evaluator manager: Single evaluator: Admin view](/docs/ui-design/31.png)
