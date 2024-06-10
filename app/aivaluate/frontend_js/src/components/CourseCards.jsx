import Card from '../components/card';
import '../styles.css';

const CourseCards = ({navBarText}) => {

    return(
        <div className="dashboard">
            <Card courseCode="COSC 499" courseName="Software Engineering Capstone" />
            <Card courseCode="COSC 360" courseName="Intro to Web Development" />
            <Card courseCode="COSC 304" courseName="Web Development II" />
            <Card courseCode="COSC 395" courseName="Intro to Frontend Development" />
        </div>
    );
};

export default CourseCards;