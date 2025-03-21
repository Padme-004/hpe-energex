'use client'; // Mark this as a Client Component for animations

import React from 'react';
import './services.css'; // Import CSS for styling

const Services: React.FC = () => {
  return (
    <div className="servicesPage">
      {/* Heading */}
      <h1 className="heading">Services</h1>

      {/* Cards Container */}
      <div className="cardsContainer">
        {/* Card 1 */}
        <div className="card">
          <h2 className="cardTitle">AI Guidance</h2>
          <p className="cardDescription">
            Rely on seasoned algorithms for tailored energy advice and strategic palnning aligned with your unique goals
          </p>
        </div>

        {/* Card 2 */}
        <div className="card">
          <h2 className="cardTitle">Risk Management</h2>
          <p className="cardDescription">
            we expertly handle and proactively mitigate risks, ensuring the safety of your data and overall stability
          </p>
        </div>

        {/* Card 3 */}
        <div className="card">
          <h2 className="cardTitle">Customized Solutions</h2>
          <p className="cardDescription">
            Receive and benefit from energy solutions that are tailored to your unique financial aspirationa and challenges
          </p>
        </div>

        {/* Card 4*/}
        
        <div className="card">
          <h2 className="cardTitle">Personalized Analysis</h2>
          <p className="cardDescription">
            Let AI analyze your production and consumption patterns to let you know where you can be better
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;