# Jerry Fan - Project Contribution Time Log

# Timesheet (June 12 - June 14) - 14 hours

## Friday June 14th
### 2.5 hours
- Adjust the Account page frontend page styles (0.5 hours)
- Backend Account info edit feature implementation (1.5 hours)
- Backend Account info edit and frontend integration (0.5 hours)
- 
## Thursday June 13th
### 9 hours
- Team meeting and planning (2 hours)
- Finished implementing the course creation backend logic (2 hours)
- Backend integration of the course creation feature (2 hours)
- Backend and Front integration of the login/user registration feature (3 hours)

## Wednesday June 12th
### 2.5 hour
- Built course creation function frontend page (localhost:5173/createcourse)
  - The course object only has course code/course name and max number of students as attributes
- Worked on creating course creation function backend logic

# Current Tasks
- #1 Design Frontend Assignment Overview Page(student view)
- #2 Design Frontend Individual Assignment Feedback Page
- #3 Connects User Authentication Backend with Frontend UI
- #4 Write Testing Cases for User Authentication
- #5 Implement Account Edit Backend and Connect to the Front Pages
- #6 Implement Course Creation Backend and Connect to the Front Pages

# Progress Update (since June 12)
| Task/Iusse# | Status |
| ----------- | --- |
| Task #1  | Pending  |
| Task #2 | Pending  |
| Task #3 | Completed  |
| Task #4 | In Progress  |
| Task #5 | Completed  |
| Task #6 | In Progress  |

# Cycle Goal Review
I focused on implementing the features to get through Friday's presentation. The user authentication task#3 now works properly. Two other features were also implemented, the course creation and the account info edit (task #5 and #6). 

# Next Cycle 
- #1 Refine Course Creation Feature
  - add an expiration date attribute
  - add the dashboard filter based on the course date
  - add the instructor detection when creating a course
- #2 Implement course info edit feature
- #3 Refine Login Feature
  - add user role (prof/admin/student) detection    
- #4 Write Testing Cases for newly added features
- #5 Implement Course Creation Backend Logic 

# Timesheet (June 7 - June 11) - 10.5 hours
## Tuesday June 11th
### 2.5 hours
- Team meeting and planning (0.5 hour)
- Design frontend help page (2 hours)

## Monday June 10th
### 1 hour
- Code review, backend container setup branch

## Sunday June 9th
### 0.5 hour
- Code review, merged the Frontend login pages to the development branch

## Saturday June 8th
### 2 hours
- Self study and exploration of React (2 hours)
  - Wacthed online React tutorial
  - Reviewed the basic react concepts of components, state, hook, props etc
  
## Friday June 7th
### 4.5 hours
- Finish up backend authentication logic (1 hour)
- Resolving Merging Conflicts (2.5 hours)
  - Backend Authentication and Database/Backend Docker Container Branch
- Finish recording project design presentation (1 hour)
  - Recorded the overview and system architecture section
  - Put the video together for the team

# Current Tasks
- #1 User Authentication Backend
- #2 Design Frontend Help Page
- #3 Design Frontend Assignment Overview Page(student view)
- #4 Design Frontend Individual Assignment Feedback Page
- #5 Connects User Authentication Backend with Frontend UI
- #6 Write Testing Cases for user Authentication

# Progress Update (since June 7)
| Task/Iusse# | Status |
| ----------- | --- |
| Task #1 / Issue #20  | Completed  |
| Task #2 / Issue #50 | Completed  |
| Task #3 / Issue #55 | In Progress  |
| Task #4 / Issue #56 | In Progress  |
| Task #5 / Issue #77 | In Progress  |
| Task #6 / Issue #24 | In Progress  |

# Cycle Goal Review
I completed Task 1 and 2 as planned. 3-6 will be completed before then Friday Mini Presentation. Most of the time during this cycle was trying to figure out docker containerization setup and merging conflicts with the team, that why the docker initiliazation has conflicts with either database or backend.

# Next Cycle 
- #1 Design Frontend Assignment Overview Page(student view)
- #2 Design Frontend Individual Assignment Feedback Page
- #3 Connects User Authentication Backend with Frontend UI
- #4 Write Testing Cases for user AuthenticationFinish 
- #5 Implement Course Creation Backend Logic 


# Cycle Summary (June 5 - June 7) - 19.5 hours
- Tasks completed this cycle:
  - Docker container setup for the PostgreSQL database (Task #28 on Kanban board)
  - User Authentication Feature Implementation (Task #20 on Kanban board)
    - Registration/Login/Logout/Data Authentication features implemented on the backend
    - Connected with the development database
    - Mockup frontend pages for demonstration purposes
    - Automated database seed in docker-compose
  - Study and exploration of the Digital Ocean, Docker, and Passport.js
  - Code review, Team meetings and communication
  - System Design Doc (Task #6, #8 on Kanban board)
    - System Architecture Adjustments 
    - ER Diagram Adjustments
    - UML Diagram Adjustments
    - ER Diagram Justifications and Write-Up
  
- Tasks for the next cycle:
  - Connect the authentication backend to the actual frontend and database
  - Finish the video presentation for project design
  - Fine-tuning the authentication feature with consideration of different user roles
  - Explore the email invitation system

## Friday June 7th
### 5 hours
- User authentication feature implementation (5 hours)
  - User authentication feature backend implementation
  - User authentication frontend mock-up pages
  - User authentication demo database ddl, and automated database seed put in docker-compose file
  
## Thursday June 6th
### 6.5 hours
- PostgreSQL Docker container set up (1.5 hours)
- Team meeting and self-study on how to connect a docker container to a managed database on Digital Ocean (3 hours)
- User authentication feature backend implementation (2 hours)

## Wednesday June 5th
### 8 hours
- Finalize the project design system architecture section (30 minutes)
- Watch and review other group's presentations (30 minutes)
- Team meeting and project planning (1 hour)
- Project design - ER diagram justification and write-up, ER diagram adjustment, added new entities and relationships to the existing diagram;  (5 hours)
- Project design - UML diagram adjustment, added new class and relations to the existing diagram (1 hour)

# Cycle Summary (May 31 - June 4) - 13 hours
- Tasks completed this cycle:
  - Study and exploration of docker, VITE, and microservice system architecture
  - Code review
  - Discussion and team meeting to assist with other components required in the project plan doc
  - Task #6 on Kanban board: project plan system design documents and diagram
  - Task #8 on Kanban board: project plan database design

- Tasks for the next cycle:
  - Start on programming, specific task to be discussed with the team
  - Project plan video recording

## Monday June 3rd
### 3 hours
- Continuous self-study of docker-compose files and VITE, a React app initializer
- Code review and provide feedback on the initialized project

## Sunday June 2nd
### 2 hours
- Exploration and self-study of docker: how to write docker-compose.yml file, Dockerfile commands

## Saturday June 1st
### 3 hours
- Exploration and self-study of the microservice system architecture: how services should be separated, which components should be dockerized, etc.
- Revision of the system architecture diagram; architecture was changed from monolithic to microservice

## Friday May 31th
### 5 hours
- System Architecture Documents Draft
- Team meeting - Discussion of system design decisions, data flow diagrams, database design decisions, UI components etc.

## Thursday May 30th
### 2 hours
- System Architecture Graph
- Team Meeting - Database Design

## Wednesday May 29th
### 2 hours
- Team Meeting - Discussion of the Next Steps
- Update System - Tech Stack Update




  











  
