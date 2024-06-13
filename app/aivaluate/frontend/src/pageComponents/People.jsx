import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../People.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';

const People = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log(`menu open - ${!menuOpen}`); // Logging state change
  };

  return (
    <div>
      <AIvaluateNavBar navBarText='COSC 499 - Software Engineering Capstone' />
      <SideMenuBar tab='people' />
      <div className="people-container">
        <main className="people-content">
          <header className="content-header">
          </header>
          <section className="people-list">
            <div className="person">Colton Palfrey</div>
            <div className="person">Jerry Fan</div>
            <div className="person">Omar Hemed</div>
            <div className="person">Chinmay Arvind</div>
            <div className="person">Aayush Chauhary</div>
            <div className="person">Mike Doodle</div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default People;
