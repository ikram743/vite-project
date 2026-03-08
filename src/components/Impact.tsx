import React from 'react';
import './Impact.css';

interface Stat {
  value: string;
  label: string;
  description: string;
}

const Impact: React.FC = () => {
  const stats: Stat[] = [
    {
      value: "900M",
      label: "Bread wasted/year",
      description: "In Algeria every year"
    },
    {
      value: "5M",
      label: "Bread/day",
      description: "Wasted daily"
    },
    {
      value: "10-15%",
      label: "Of production",
      description: "Ends up in the trash"
    }
  ];

  return (
    <section className="impact" id="impact">
      <div className="container">
        <h2 className="section-title">Food waste in Algeria</h2>
        <p className="section-subtitle">A silent crisis that requires immediate action</p>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-description">{stat.description}</div>
            </div>
          ))}
        </div>

        <div className="quote">
          <i className="fas fa-quote-left"></i>
          <p>Every saved bread can feed a family in need</p>
        </div>
      </div>
    </section>
  );
};

export default Impact;