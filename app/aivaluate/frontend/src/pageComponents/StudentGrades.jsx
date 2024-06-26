import React from 'react';
import '../GeneralStyling.css';
import '../Grades.css';
import '../HelpPage.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';

const StudentGrades = () => {

    const grades = [
        { name: 'IP and Licensing', due: 'May 19 by 11:59p.m.', submitted: true, score: 10, total: 10 },
        { name: 'Individual 1', due: 'May 19 by 11:59p.m.', submitted: true, score: 9, total: 10 },
        { name: 'Individual 2', due: 'May 20 by 11:59p.m.', submitted: false, score: 0, total: 10 },
        { name: 'Lab 1', due: 'May 20 by 11:59p.m.', submitted: true, score: 7.5, total: 10 },
        { name: 'Lab 2', due: 'May 31 by 11:59p.m.', submitted: true, score: 25, total: 25 },
    ];
    const studentName = 'Colton';
    const totalGrade = 69.2;
    return (
        <div>
            <AIvaluateNavBar navBarText='Student Grades' tab="home" />
            <SideMenuBar tab="grades"/>
            <div className="grades-section ">
                <h1 className="secondary-color-text">Grades for {studentName}</h1>
                <table className="grades-table secondary-colorbg">
                    <thead>
                        <tr>
                            <th className="fourth-colorbg">Name</th>
                            <th className="fourth-colorbg">Due</th>
                            <th className="fourth-colorbg">Submitted</th>
                            <th className="fourth-colorbg">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map((grade, index) => (
                            <tr key={index}>
                                <td>{grade.name}</td>
                                <td>{grade.due}</td>
                                <td>{grade.submitted ? <span className="checkmark">✔️</span> : <span className="cross">❌</span>}</td>
                                <td>{grade.score.toFixed(1)}/{grade.total}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="3" className="total fourth-colorbg">Total</td>
                            <td className="total fourth-colorbg">{(grades.reduce((acc, grade) => acc + grade.score, 0) / grades.reduce((acc, grade) => acc + grade.total, 0)*100).toFixed(1)}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentGrades;