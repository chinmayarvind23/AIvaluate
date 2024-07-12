# Colton Palfrey - Project Contribution Time Log
-----------------------------------------------------------------------------------
## Cycle 1 and 2: Wednesday May 29th - Tuesday June 4th

### Timesheet
Clockify report
![alt text](./clockify-images/Clockify_colton_report_C3.png)

### Current Tasks
  * #1: Set up reverse proxy with server: I am setting up http proxy middle ware to route between prof pages, student pages, and admin pages
  * #2: Make forgot password email redirect page so that when a users receives an email to reset their password they can be redirected to this page.
  * #3: Set up backend for login/logout: I am setting up the SQL queries to work with our database to allow our login in to work properly with passport.js and to allow our signup page to actually add users to the database.

### Progress Update
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <td>Do UI design
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <td>Make design plan video
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <td>Set up AWS
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
  <tr>
        <td>Containerize frontend
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
This week I spent alot of time working on learning docker and trying to figure out a hosting service to use. I got our frontend containerized but ran into some issues when it came to setting up node on my computer. I ended up figure out what was the issue (which was I had an old version of node installed) and fixing it.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
- Make frontend general styling sheet
- Start making frontend for login/logout page
- Host pages on server and test them with docker-compose

# daily work break down for this cycle
## Wednesday May 29th
### 2 hours
- Researched how to use AWS for hosting
- Finished up the design document

## Thursday May 30th
### 2 hours
- Research File storage system (Amazon S3)
- Created Relationship Entity Diagram to plan Database
- Started Prototype Design

## Friday May 31st
### 2 hours
- Worked on prototype design
- worked on Relationship Entity Diagram

## Sunday June 2nd
### 6.5 hours
- Set up file structure
- Worked on setting up AWS
- Learned how to dockerize our project for development stage

## Monday June 3rd
### 3 hours
- Finished UI design
- Did code review and tested React app implementation from VEST

-----------------------------------------------------------------------------------
## Cycle 3: Wednesday June 5th - Tuesday June 11th

### Timesheet
Clockify report
![alt text](./clockify-images/Clockify_colton_report_C4.png)

### Current Tasks
  * #1: Set up reverse proxy with server: I am setting up http proxy middle ware to route between prof pages, student pages, and admin pages
  * #2: Make forgot password email redirect page so that when a users receives an email to reset their password they can be redirected to this page.
  * #3: Set up backend for login/logout: I am setting up the SQL queries to work with our database to allow our login in to work properly with passport.js and to allow our signup page to actually add users to the database.

### Progress Update (since June 4th 2024) 
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <td>Make Signin page
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <td>Make signup page
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <td>Make prof and student dashboard
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
  <tr>
        <td>Make account page
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
  <tr>
        <td>Make forgot password page
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
  <tr>
        <td>Make forgot password email redirect page
        </td>
        <!-- Status -->
        <td>In progress
        </td>
    </tr>
  <tr>
        <td>Make join course page
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
  <tr>
        <td>Dockerize/containerize llama3 using olama
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
  <tr>
        <td>Set up reverse proxy with server
        </td>
        <!-- Status -->
        <td>In progress
        </td>
    </tr>
  <tr>
        <td>Set up backend for login/logout
        </td>
        <!-- Status -->
        <td>In progress
        </td>
    </tr>
  <tr>
        <td>Finalize general styling sheet
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
Everything has gone really well for me this week and I feel asthough I have been making some steady progress. This week I focused mostly on frontend and designed the login, logout, forgot password, dashboard, account and join class pages, as well and build mutiple reusable frontend modules such as an incourse menu and our websites nav bar. I also put a lot of time and thought into setting up a General styling sheet that is shared among all pages that lets us change the colours of the entire site just by changing three variables.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
- SQL/backend implementation for login/Sign and well as joining and creating courses.
- Server side validation
- Writign lots of tests using jest for backend implementation
- Setting up express.js for managing server and routing state memory

# daily work break down for this cycle
## Wednesday June 5th
### 5.5 hours
- Added to the deisgn plan document.
- Set up and containerized frontend with Docker

## Thursday June 6th
### 3 hours
- Working on Login/logout page front end design

## Friday June 7th
### 6 hours
- Worked on Login/logout page front end design
- Worked on trying to help solve merge conflicts to merge branch with dockerized backend and merge branch with dockerized passport for authentication
- Work on ollama AI implementation and dockerization

## Saturday June 8th
## 6.75 hours
- Worked on learning and understand the flow and interaction of react and how it worked with javascrip with our system.
- Fixed the issue with our signup page and improved the look of the front end.
- Build our dashboard front end and fixed issue with drop down menu.
- Added page interactions and logout implementation.
- Finished dockerization of ollama in docker-compose.yml with llama3 implementation.
- Attempted to write tests using jest for ollama.
- Added tailwind css implementation.
- Worked building a generalized css template called "styles.css" for the front end.
- Lokking into using github CI/CD for testing when doing a PR and did some research on DRONECI.

## Sunday June 9th
## 3 hours
- Created Git issues for the team.
- Planned the teams sprint plan fo the week.
- Started working on the front end of the students assignments page.
- Seperated the front end into more modular components.

## Tuesday June 10th
## 8 hours
- Finalized the general styling sheet
- Make forgot password sign in
- Fixed nav bar component problem
- Created side menu component for our frontend
- Made account page
- Made join course page
- Team meeting and helped team with frontend setup

- -----------------------------------------------------------------------------------
## Cycle 5: Wednesday June 12th - Friday June 14th

### Current Tasks
  * #1: Make login and signup page work with backend
  * #2: Worked on mini presentation.

### Progress Update (since June 14th 2024) 
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <td> Login feature
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Signup page
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Mini presentation
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
 
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
This cycle I had a very diffult time implementing the login and logout page. Chinmay, Jerry and I ended up workign togherther on this to try and figure out why things wourld woirk and spent about 7 hours each on this issue. Reflecting on it now I am very happy I reached out to my team members for help casue the 3 of us working toghether on this issue is what make the outcome a success.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
- Change reverse proxy to nginx
- Fix Dashboard page and dashboad cards
- Set up session memory for student login
- Set up session memory for prof/T.A. + admin login
- Implement clearing session memory for logout.
-----------------------------------------------------------------------------------
## Cycle 6: Friday June 14th - Tuesday June 19th

### Timesheet
Clockify report
![alt text](./clockify-images/colton-clockify_C6.png)

### Current Tasks
  * #1: Change reverse proxy to nginx
  * #2: Fix Dashboard page and dashboad cards
  * #3: Set up session memory for student login
  * #4: Implement clearing session memory for logout.

### Progress Update (since June 14th 2024) 

<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <td>Reverse proxy
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
    <tr>
        <td>Fix Dashboard
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <td>Set up session memory for student login
        </td>
        <!-- Status -->
        <td>Done
        </td>
    </tr>
    <tr>
        <td>Set up Clear session memory for logout
        </td>
        <!-- Status -->
        <td>Done
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
This cycle I went oh improving the look and layout of our dashboard for both Prof and Student view. I also changed our reverse proxy to nginx and set up session mememory. I had some dificulty setting up the proxy as I was running into alot of dokcer problems but after researching and wathcing some youtube videos I found out what was wrong. I also had ALOT of problems trying to make the logout work because it would not clear the session.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
Next cycle I am going to have a  more focus on frontend design. Because I have alot more expirence in frontend compared to my team members I can make front end designs much faster and help up put more focus on backend. Our team plan is to finish frontend next cycle.

-----------------------------------------------------------------------------------
## Cycle 7: Wednesday June 19th - Friday June 21st

### Timesheet
Clockify report
![alt text](./clockify-images/colton-clockify_C7.png)

### Current Tasks
  * #1: Student grades frontend
  * #2: Prof/T.A. grade frontend
  * #3: Evaluator manager (admin portal) frontend
  * #4: Student manager (admin portal) frontend

### Progress Update (since June 19th 2024) 
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
 <tr>
        <td>Student Grades frontend
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td>Prof/T.A. grade frontend page 
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td>Evaluator manager (admin portal) frontend
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td>Student manager (admin portal) frontend
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
In this cycle the frontend design actually went really well for me. I had a little bit of trouble implementing the search feature for a few of my pages but once it was working it was perfect!

### Next Cycle Goals (What are you going to accomplish during the next cycle)
I the next Cycle I am going to be implementing all of the backend for the frontend I just implemented this cycle which entails:
- Backend for student and evaluator admin portals
- Backend for student and profs grade view
- Make a fix in our Nginx reverse proxy so that everything run off of one back end system for now.

-----------------------------------------------------------------------------------
## Cycle 8: Friday June 21st - Wednesday June 25th

### Timesheet
Clockify report
![alt text](./clockify-images/colton-clockify_C8.png)

### Current Tasks
  * #1: Set up session memory for prof/T.A. + admin
  * #2: Containerized admin backend and routed reverse proxy for backend calls
  * #3: Containerized evaluator backend and routed reverse proxy for backend calls
  * #4: Stored important user information about user types in the session when a user logs in so we know what to display to them
  * #5: Set up frontend and backend for admin signin and account creation (with access key)
  * #6: Set up frontend and backend for evaluator signin
  * #6: Set up session storages and locked pages for both the evulator and Admin.
  * #7: Set up admin and evaluator session logout 
  * #8: Set up admin and evaluator side menu bar and proper page navigation
  * #9: Set up the proper display and storage of site images in the reverse proxy frontend container.

### Progress Update (since June 21st 2024) 
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <td> Set up session memory for prof/T.A. + admin
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Containerized admin backend and routed reverse proxy for backend calls
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Stored important user information about user types in the session when a user logs in so we know what to display to them
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Set up frontend and backend for admin signin and account creation (with access key)
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Set up frontend and backend for evaluator signin
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Set up session storages and locked pages for both the evulator and Admin.
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Set up admin and evaluator session logout 
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> set up admin and evaluator side menu bar and proper page navigation
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Set up the proper display and storage of site images in the reverse proxy frontend container.
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
Although I did have some difficulties with session storage I am very happy with how this cycle went for me and I am really glad I was able to get our 3 backend systems containerized and set up wiht our proxy as now this isn't something we have to deal with in the future which would've taken way more time. I think the one thing that could have gone better was my team and I didn't have any meetings and only communicated through text on discord or through PR reviews and I beilive this will cause a lot of PR issues for us to go through on wednesday.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
- Student Grades backend
- Prof/T.A. grade backend
- Evaluator manager (admin portal) backend
- Student manager (admin portal) backend

-----------------------------------------------------------------------------------
## Cycle 9: Friday June 26th - Wednesday June 28th

### Timesheet
Clockify report
![alt text](./clockify-images/colton-clockify_C9.png)

### Current Tasks
  * #1: Edit Rubric page Frontend 
  * #2: Assignment Submission page frontend
  * #3: Merge all PR's and fixes conflicts

### Progress Update (since June 26th 2024) 
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <td> Edit Rubric page Frontend 
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Assignment Submission page frontend
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Merge all PR's and fixes conflicts
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
In this cycle our biggest problem was merging all of the PR's. We let all of our team PR's sit for way too long and this caused way too many issues. Going forward we have decided to not let any PR's sit for more then 24 hours. My other problem was not being able to get started on the backend tasks that I wanted to do because I had to pick up on tasks from 2 cycles ago that were not finished by who they were assigned to.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
- Backend for student manager from Admin with tests.
- Backend for admin to select a student and drop them from a course, delete that student from the database, or just see all of their account information with tests.
- Backend for a student to view of all their grades in a course as well as their total grade with tests.
- Backend for teachers to see all of their grade averages with tests.
- Backend to connect all tabs under a single course.

-----------------------------------------------------------------------------------
## Cycle 10: Friday June 28th - Wednesday July 3rd

### Timesheet
Clockify report
![alt text](./clockify-images/colton-clockify_C10.png)

### Current Tasks
  * #1: Backend for student manager from Admin with tests.
  * #2: Backend for admin to select a student and drop them from a course, delete that student from the database, or just see all of their account information with tests.
  * #3: Backend for a student to view of all their grades in a course as well as their total grade with tests.
  * #4: Backend for teachers to see all of their grade averages with tests.
  * #5: Backend to connect all tabs under a single course.

### Progress Update (since June 28th 2024) 
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <td>Backend for student manager from Admin with tests.
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td>Backend for admin to select a student and drop them from a course, delete that student from the database, or just see all of their account information with tests.
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td>Backend for a student to view of all their grades in a course as well as their total grade with tests.
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
  <tr>
        <td>Backend for teachers to see all of their grade averages with tests.
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td>Backend to connect all tabs under a single course.
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
This cycle went really well for me. The backend was much better then I expected and we had lots of team communication which I believe helped a lot with all of us staying on the same track. One thing I found myself struggling with was writing tests, it took me awhile to figure everything out as all my tests were failing at first.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
- File submission storage and management
- Add testing to ALL backend features that don't have it already.

-----------------------------------------------------------------------------------

## Cycle 11: Wednesday July 3rd - Friday July 5th

### Current Tasks
  * #1: MVP presentation
  * #2: Backend testing

### Timesheet
Clockify report
![alt text](./clockify-images/colton-clockify_C11.png)

### Progress Update (since June 14th 2024) 
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <td> Backend testing admin
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Backend testing evaluator
        </td>
        <!-- Status -->
        <td> In progress
        </td>
    </tr>
    <tr>
        <td> Backend testing student
        </td>
        <!-- Status -->
        <td> In progress
        </td>
    </tr>
 
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
This cycle I didn't have very much ime to get thigns done which caused some issues. I continue to have ltos of issues with testing and will spend this weekend wathcing for videos on jest to figure out what I am doing wrong.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
- File storage and managerment
- Fix back buttons and make them unified
-----------------------------------------------------------------------------------


## Cycle 12: Friday July 5th - Wednesday July 10th

### Current Tasks
  * #1: Redo ALL frontend pages to look more like canvas (as requested by our client)
  * #2: File Submission
  * #3: Finish testing for student backend

### Timesheet
Clockify report
![alt text](./clockify-images/colton-clockify_C12.png)

### Progress Update (since June 14th 2024) 
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <td> Redo ALL frontend pages
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> File Submission
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> Finish testing for student backend
        </td>
        <!-- Status -->
        <td> In progress
        </td>
    </tr>
 
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
This cycle my main focus was redoing all of our frontend to look more like canvas. I did this becasue our client requested this as he felt as though our UI was too crowded. I used added more Icons as request by the client. What I found REALLY challenging was trying to manage working through my other memebers old frontend code which was all over the place and nothing matched.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
- Implement AI with dummy frontend page with base promtp + tests
- Finish up all testing for the backend
-----------------------------------------------------------------------------------

## Cycle 13: Wednesday July 10th - Friday July 12th

### Current Tasks
  * #1: Testing
  * #2: Frontend AI Setting page

### Timesheet
Clockify report
![alt text](./clockify-images/colton-clockify_C11.png)

### Progress Update (since June 14th 2024) 
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <td> Frontend AI Setting page
        </td>
        <!-- Status -->
        <td> Complete
        </td>
    </tr>
    <tr>
        <td> testing
        </td>
        <!-- Status -->
        <td> In progress
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
This cycle I didn't have very much ime to get thigns done which caused some issues. I continue to have ltos of issues with testing and will spend this weekend wathcing for videos on jest to figure out what I am doing wrong.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
- File storage and managerment
- Fix back buttons and make them unified
-----------------------------------------------------------------------------------