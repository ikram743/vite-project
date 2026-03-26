// pages/admin/Impact.tsx
import React, { useState } from "react";
import "./Impact.css";

interface ImpactData {
  totalMealsSaved: number;
  totalFoodSaved: number;
  activeDonors: number;
  activeBeneficiaries: number;
  co2Reduced: number;
  familiesHelped: number;
}

const Impact: React.FC = () => {
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">(
    "month",
  );
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("03");

  const impactData: ImpactData = {
    totalMealsSaved: 52300,
    totalFoodSaved: 12500,
    activeDonors: 48,
    activeBeneficiaries: 32,
    co2Reduced: 18750,
    familiesHelped: 2340,
  };

  const monthlyData = [
    { month: "Jan", meals: 3200, donors: 12, beneficiaries: 8 },
    { month: "Fév", meals: 4100, donors: 18, beneficiaries: 12 },
    { month: "Mar", meals: 5200, donors: 25, beneficiaries: 18 },
    { month: "Avr", meals: 6100, donors: 32, beneficiaries: 24 },
    { month: "Mai", meals: 7800, donors: 38, beneficiaries: 28 },
    { month: "Juin", meals: 8500, donors: 42, beneficiaries: 30 },
    { month: "Juil", meals: 9200, donors: 45, beneficiaries: 31 },
    { month: "Aoû", meals: 9800, donors: 46, beneficiaries: 32 },
    { month: "Sep", meals: 10200, donors: 47, beneficiaries: 32 },
    { month: "Oct", meals: 10800, donors: 48, beneficiaries: 32 },
    { month: "Nov", meals: 11500, donors: 48, beneficiaries: 32 },
    { month: "Déc", meals: 12300, donors: 48, beneficiaries: 32 },
  ];

  const weeklyData = [
    { week: "Sem 1", meals: 2100, donors: 45, claims: 28 },
    { week: "Sem 2", meals: 2450, donors: 46, claims: 30 },
    { week: "Sem 3", meals: 2800, donors: 47, claims: 31 },
    { week: "Sem 4", meals: 2950, donors: 48, claims: 32 },
  ];

  const topDonors = [
    { name: "Artisan Bakery", amount: 450, meals: 1800 },
    { name: "Restaurant Le Jardin", amount: 280, meals: 1120 },
    { name: "Supermarket El Djazair", amount: 320, meals: 1280 },
    { name: "Boulangerie Moderne", amount: 190, meals: 760 },
    { name: "Café Central", amount: 150, meals: 600 },
  ];

  const topBeneficiaries = [
    { name: "Food Bank Algiers", amount: 1250, meals: 5000 },
    { name: "Solidarité Oran", amount: 780, meals: 3120 },
    { name: "Aide et Partage", amount: 540, meals: 2160 },
    { name: "Croissant Rouge", amount: 420, meals: 1680 },
    { name: "Association El Baraka", amount: 380, meals: 1520 },
  ];

  const getMaxMeals = () => {
    if (dateRange === "week") {
      return Math.max(...weeklyData.map((d) => d.meals));
    }
    return Math.max(...monthlyData.map((d) => d.meals));
  };

  const maxMeals = getMaxMeals();

  return (
    <div className="impact-page">
      {/* Header */}
      <div className="impact-header">
        <h2>Impact & Statistiques</h2>
        <div className="date-range-selector">
          <button
            className={`range-btn ${dateRange === "week" ? "active" : ""}`}
            onClick={() => setDateRange("week")}
          >
            Cette semaine
          </button>
          <button
            className={`range-btn ${dateRange === "month" ? "active" : ""}`}
            onClick={() => setDateRange("month")}
          >
            Ce mois
          </button>
          <button
            className={`range-btn ${dateRange === "year" ? "active" : ""}`}
            onClick={() => setDateRange("year")}
          >
            Cette année
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-utensils"></i>
          </div>
          <div className="metric-info">
            <h3>Repas Sauvés</h3>
            <p className="metric-value">
              {impactData.totalMealsSaved.toLocaleString()}
            </p>
            <span className="metric-trend positive">
              <i className="fas fa-arrow-up"></i> +23% vs mois dernier
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-weight-hanging"></i>
          </div>
          <div className="metric-info">
            <h3>Nourriture Sauvée</h3>
            <p className="metric-value">
              {impactData.totalFoodSaved.toLocaleString()} kg
            </p>
            <span className="metric-trend positive">
              <i className="fas fa-arrow-up"></i> +18% vs mois dernier
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-store"></i>
          </div>
          <div className="metric-info">
            <h3>Donateurs Actifs</h3>
            <p className="metric-value">{impactData.activeDonors}</p>
            <span className="metric-trend positive">
              <i className="fas fa-arrow-up"></i> +12 cette année
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-hand-holding-heart"></i>
          </div>
          <div className="metric-info">
            <h3>Bénéficiaires Actifs</h3>
            <p className="metric-value">{impactData.activeBeneficiaries}</p>
            <span className="metric-trend positive">
              <i className="fas fa-arrow-up"></i> +8 cette année
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-cloud"></i>
          </div>
          <div className="metric-info">
            <h3>CO₂ Évité</h3>
            <p className="metric-value">
              {impactData.co2Reduced.toLocaleString()} kg
            </p>
            <span className="metric-trend positive">
              <i className="fas fa-leaf"></i> Équivalent à 400 arbres
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="metric-info">
            <h3>Familles Aidées</h3>
            <p className="metric-value">
              {impactData.familiesHelped.toLocaleString()}
            </p>
            <span className="metric-trend positive">
              <i className="fas fa-heart"></i> Impact social positif
            </span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <div className="chart-header">
          <h3>Évolution des dons</h3>
          <div className="chart-controls">
            <select className="chart-select">
              <option value="meals">Repas sauvés</option>
              <option value="donors">Donateurs</option>
              <option value="beneficiaries">Bénéficiaires</option>
            </select>
          </div>
        </div>
        <div className="chart-container">
          <div className="bar-chart">
            {(dateRange === "week" ? weeklyData : monthlyData).map(
              (item, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-label">
                    {"month" in item ? item.month : item.week}
                  </div>
                  <div className="bar-wrapper">
                    <div
                      className="bar-fill"
                      style={{
                        height: `${(item.meals / maxMeals) * 100}%`,
                        backgroundColor: "#3b7a5e",
                      }}
                    >
                      <span className="bar-value">{item.meals}</span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Donor vs Beneficiary Comparison */}
      <div className="comparison-section">
        <div className="comparison-card">
          <h3>Top Donateurs</h3>
          <table className="ranking-table">
            <thead>
              <tr>
                <th>Donateur</th>
                <th>Quantité (kg)</th>
                <th>Repas équivalents</th>
              </tr>
            </thead>
            <tbody>
              {topDonors.map((donor, index) => (
                <tr key={index}>
                  <td>
                    <span className="rank-badge">{index + 1}</span>
                    {donor.name}
                  </td>
                  <td>{donor.amount} kg</td>
                  <td>{donor.meals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="comparison-card">
          <h3>Top Bénéficiaires</h3>
          <table className="ranking-table">
            <thead>
              <tr>
                <th>Association</th>
                <th>Reçu (kg)</th>
                <th>Repas distribués</th>
              </tr>
            </thead>
            <tbody>
              {topBeneficiaries.map((beneficiary, index) => (
                <tr key={index}>
                  <td>
                    <span className="rank-badge">{index + 1}</span>
                    {beneficiary.name}
                  </td>
                  <td>{beneficiary.amount} kg</td>
                  <td>{beneficiary.meals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Impact by Wilaya */}
      <div className="wilaya-impact">
        <h3>Impact par Wilaya</h3>
        <div className="wilaya-grid">
          <div className="wilaya-card">
            <span className="wilaya-name">Alger</span>
            <div className="wilaya-stats">
              <div className="stat">
                <i className="fas fa-utensils"></i>
                <span>8,450 repas</span>
              </div>
              <div className="stat">
                <i className="fas fa-store"></i>
                <span>24 donateurs</span>
              </div>
            </div>
          </div>
          <div className="wilaya-card">
            <span className="wilaya-name">Oran</span>
            <div className="wilaya-stats">
              <div className="stat">
                <i className="fas fa-utensils"></i>
                <span>5,230 repas</span>
              </div>
              <div className="stat">
                <i className="fas fa-store"></i>
                <span>12 donateurs</span>
              </div>
            </div>
          </div>
          <div className="wilaya-card">
            <span className="wilaya-name">Annaba</span>
            <div className="wilaya-stats">
              <div className="stat">
                <i className="fas fa-utensils"></i>
                <span>2,980 repas</span>
              </div>
              <div className="stat">
                <i className="fas fa-store"></i>
                <span>6 donateurs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="export-section">
        <button className="btn-primary">
          <i className="fas fa-download"></i>
          Exporter le rapport complet
        </button>
      </div>
    </div>
  );
};

export default Impact;
