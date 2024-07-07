import React from 'react';
import { FaFile, FaSearch } from 'react-icons/fa';
import '../AssignmentOverview.css';
// import '../CourseHome.css';
import '../GeneralStyling.css';
import '../SearchBar.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';

const TestForComponents = () => {

  return (
    <div>
      <AIvaluateNavBar navBarText="test" />
      <SideMenuBar tab="assignments" />
      <div className="main-margin">
          <div className="top-bar">
            <h1>Assignments</h1>
            <div className="search-container">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                //   value={searchTerm}
                //   onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          <div className="scrollable-div">
          <main className="assignment-table-content">
            <section className="table-section">
                <table className="assignment-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Due Date</th>
                      <th>Obtainable Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr>
                        <td>
                          <button className="icon-button" onClick="">
                            <FaFile className="file-icon" />
                          </button>
                        </td>
                        <td>
                          <button className="link-button" onClick="">
                            Assignment name
                          </button>
                        </td>
                        <td>7777</td>
                        <td>67</td>
                      </tr>
                      <tr>
                        <td>
                          <button className="icon-button" onClick="">
                            <FaFile className="file-icon" />
                          </button>
                        </td>
                        <td>
                          <button className="link-button" onClick="">
                            Assignment name
                          </button>
                        </td>
                        <td>7777</td>
                        <td>67</td>
                      </tr>
                      <tr>
                        <td>
                          <button className="icon-button" onClick="">
                            <FaFile className="file-icon" />
                          </button>
                        </td>
                        <td>
                          <button className="link-button" onClick="">
                            Assignment name
                          </button>
                        </td>
                        <td>7777</td>
                        <td>67</td>
                      </tr>
                      <tr>
                        <td>
                          <button className="icon-button" onClick="">
                            <FaFile className="file-icon" />
                          </button>
                        </td>
                        <td>
                          <button className="link-button" onClick="">
                            Assignment name
                          </button>
                        </td>
                        <td>7777</td>
                        <td>67</td>
                      </tr>
                      <tr>
                        <td>
                          <button className="icon-button" onClick="">
                            <FaFile className="file-icon" />
                          </button>
                        </td>
                        <td>
                          <button className="link-button" onClick="">
                            Assignment name
                          </button>
                        </td>
                        <td>7777</td>
                        <td>67</td>
                      </tr>
                      <tr>
                        <td>
                          <button className="icon-button" onClick="">
                            <FaFile className="file-icon" />
                          </button>
                        </td>
                        <td>
                          <button className="link-button" onClick="">
                            Assignment name
                          </button>
                        </td>
                        <td>7777</td>
                        <td>67</td>
                      </tr>
                      <tr>
                        <td>
                          <button className="icon-button" onClick="">
                            <FaFile className="file-icon" />
                          </button>
                        </td>
                        <td>
                          <button className="link-button" onClick="">
                            Assignment name
                          </button>
                        </td>
                        <td>7777</td>
                        <td>67</td>
                      </tr>
                      <tr>
                        <td>
                          <button className="icon-button" onClick="">
                            <FaFile className="file-icon" />
                          </button>
                        </td>
                        <td>
                          <button className="link-button" onClick="">
                            Assignment name
                          </button>
                        </td>
                        <td>7777</td>
                        <td>67</td>
                      </tr>
                      <tr>
                        <td>
                          <button className="icon-button" onClick="">
                            <FaFile className="file-icon" />
                          </button>
                        </td>
                        <td>
                          <button className="link-button" onClick="">
                            Assignment name
                          </button>
                        </td>
                        <td>7777</td>
                        <td>67</td>
                      </tr>
                      <tr>
                        <td>
                          <button className="icon-button" onClick="">
                            <FaFile className="file-icon" />
                          </button>
                        </td>
                        <td>
                          <button className="link-button" onClick="">
                            Assignment name
                          </button>
                        </td>
                        <td>7777</td>
                        <td>67</td>
                      </tr>
                      <tr>
                        <td>
                          <button className="icon-button" onClick="">
                            <FaFile className="file-icon" />
                          </button>
                        </td>
                        <td>
                          <button className="link-button" onClick="">
                            Assignment name
                          </button>
                        </td>
                        <td>7777</td>
                        <td>67</td>
                      </tr>
                      <tr>
                        <td>
                          <button className="icon-button" onClick="">
                            <FaFile className="file-icon" />
                          </button>
                        </td>
                        <td>
                          <button className="link-button" onClick="">
                            Assignment name
                          </button>
                        </td>
                        <td>7777</td>
                        <td>67</td>
                      </tr>
                  </tbody>
                </table>
            </section>
          </main>
        </div>
        </div>
        
    </div>
  );
};

export default TestForComponents;
