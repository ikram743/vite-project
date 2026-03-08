import React from 'react';
import './HowItWorks.css';

interface Step {
  number: number;
  title: string;
  description: string;
}

const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: "Declare your surplus",
      description: "Businesses declare their food surplus in just a few clicks via our platform."
    },
    {
      number: 2,
      title: "Automatic geolocation",
      description: "The system automatically locates the surplus and finds nearby associations."
    },
    {
      number: 3,
      title: "Real-time notification",
      description: "Associations receive instant notifications with all the details."
    },
    {
      number: 4,
      title: "Collection and tracking",
      description: "The redistribution is organized and tracked until its completion."
    }
  ];

  return (
    <section className="how-it-works" id="how">
      <div className="container">
        <h2 className="section-title">How does it work?</h2>
        <p className="section-subtitle">
          A simple and effective 4-step process to fight food waste
        </p>

        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;