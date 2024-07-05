// import React, { useState } from 'react';
// import { FaSearch } from 'react-icons/fa';
// import '../GeneralStyling.css';
// import '../Grades.css';
// import '../HelpPage.css';
// import '../SearchBar.css';
// import AIvaluateNavBar from '../components/AIvaluateNavBar';
// import SideMenuBar from '../components/SideMenuBar';

// const EvaluatorGrades = () => {

//     const grades = [
//         {
//           name: 'IP and Licensing',
//           due: 'May 19 by 11:59p.m.',
//           avgGrade: 9.12,
//           totalGrade: 10
//         },
//         {
//           name: 'Individual 1',
//           due: 'May 20 by 11:59p.m.',
//           avgGrade: 7.77,
//           totalGrade: 10
//         },
//         {
//           name: 'Individual 2',
//           due: 'May 29 by 11:59p.m.',
//           avgGrade: 9.13,
//           totalGrade: 10
//         },
//         {
//           name: 'Lab 1',
//           due: 'June 13 by 11:59p.m.',
//           avgGrade: 6.65,
//           totalGrade: 10
//         },
//         {
//           name: 'Lab 2',
//           due: 'June 22 by 11:59p.m.',
//           avgGrade: 21.03,
//           totalGrade: 25
//         }
//       ];


//     const [searchQuery, setSearchQuery] = useState('');

//     const handleSearch = (event) => {
//     setSearchQuery(event.target.value);
//     };

//     const filteredGrades = grades.filter((grade) =>
//     grade.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
      
//     const studentName = 'Colton';
//     let sumOfAvgGrades = grades.reduce((sum, grade) => sum + grade.avgGrade, 0);
//     let sumOfTotalGrades = grades.reduce((sum, grade) => sum + grade.totalGrade, 0);

//     let average = ((sumOfAvgGrades / sumOfTotalGrades) * 100).toFixed(1);
//     return (
//         <div>
//             <AIvaluateNavBar navBarText='Student Grades' tab="home" />
//             <SideMenuBar tab="grades"/>
//             <div className="grades-section">
//             <div className="title"><h1>Class Grade Summary</h1></div>
//                 <div className="top-bar">
//                     <div className="search-div">
//                         <div className="search-container">
//                             <div className="search-box">
//                                 <FaSearch className="search-icon" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search..."
//                                     value={searchQuery}
//                                     onChange={handleSearch}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                     <div className="fill-empty"> </div>
//                     <div className="class-avg"><h2>Class Average: {average}%</h2></div>
//                 </div>
//                 <table className="grades-table secondary-colorbg">
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Date</th>
//                             <th>Avg. Grade</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                     {filteredGrades.map((grade, index) => (
//                         <tr key={index}>
//                         <td>
//                             <div className="file-icon"></div>
//                             {grade.name}
//                         </td>
//                         <td>{grade.due}</td>
//                         <td>{grade.avgGrade}/{grade.totalGrade}</td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default EvaluatorGrades;


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import '../GeneralStyling.css';
import '../Grades.css';
import '../HelpPage.css';
import '../SearchBar.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const EvaluatorGrades = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const navBarText = `${courseCode} - ${courseName}`;

    const { courseId } = useParams();
    const [grades, setGrades] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await axios.get(`http://localhost:5173/eval-api/evaluator-grades/${courseId}`, { withCredentials: true });
                setGrades(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching evaluator grades:', error);
                setLoading(false);
            }
        };

        fetchGrades();
    }, [courseId]);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredGrades = grades.filter((grade) =>
        grade.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let sumOfAvgGrades = grades.reduce((sum, grade) => sum + grade.avgGrade, 0);
    let sumOfTotalGrades = grades.reduce((sum, grade) => sum + grade.totalGrade, 0);

    let average = ((sumOfAvgGrades / sumOfTotalGrades) * 100).toFixed(1);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <AIvaluateNavBarEval navBarText={navBarText} />
            <SideMenuBarEval tab="grades"/>
            <div className="grades-section">
                <div className="title"><h1>Class Grade Summary</h1></div>
                <div className="top-bar">
                    <div className="search-div">
                        <div className="search-container">
                            <div className="search-box">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="fill-empty"> </div>
                    <div className="class-avg"><h2>Class Average: {average}%</h2></div>
                </div>
                <table className="grades-table secondary-colorbg">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Avg. Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGrades.map((grade, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="file-icon"></div>
                                    {grade.name}
                                </td>
                                <td>{new Date(grade.due).toLocaleDateString()}</td>
                                <td>{((grade.avgGrade / grade.totalGrade)*100).toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EvaluatorGrades;
