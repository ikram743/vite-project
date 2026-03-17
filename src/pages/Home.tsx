import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  // دالة للتمرير إلى القسم المطلوب
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-page">
      {/* Navbar - مع روابط مميزة */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <i className="fas fa-leaf"></i>
            <span>FoodShare</span>
          </Link>

          <div className="nav-links">
            <button
              className="nav-link-btn special"
              onClick={() => scrollToSection("how")}
            >
              <span>How it works</span>
              <i className="fas fa-arrow-right"></i>
            </button>
            <button
              className="nav-link-btn special"
              onClick={() => scrollToSection("whom")}
            >
              <span>For whom</span>
              <i className="fas fa-arrow-right"></i>
            </button>
            <button
              className="nav-link-btn special"
              onClick={() => scrollToSection("impact")}
            >
              <span>Impact</span>
              <i className="fas fa-arrow-right"></i>
            </button>
            <Link to="/food-waste-impact" className="nav-link impact-link">
              <span>Food Waste Impact</span>
              <i className="fas fa-external-link-alt"></i>
            </Link>
          </div>

          <div className="nav-buttons">
            <Link to="/auth?mode=signin" className="btn-outline">
              Sign in
            </Link>
            <Link to="/auth?mode=signup" className="btn-primary">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - مع صورة خلفية */}
      <section
        className="hero"
        style={{
          backgroundImage: "url(/images/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* طبقة داكنة فوق الصورة */}
        <div className="hero-overlay"></div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="hero-wrapper" style={{ gridTemplateColumns: "1fr" }}>
            <div
              className="hero-content"
              style={{
                textAlign: "center",
                margin: "0 auto",
                maxWidth: "800px",
              }}
            >
              <h1>
                Technological solution <br />
                with social impact
              </h1>
              <h2>Together against food waste</h2>
              <p>
                Redistribute your food surplus in real-time and connect
                businesses with associations to give food a second life
              </p>
              <div
                className="hero-buttons"
                style={{ justifyContent: "center" }}
              >
                <Link to="/register" className="btn-primary">
                  Join FoodShare
                </Link>
                <Link to="/food-waste-impact" className="btn-outline hero-btn">
                  Discover the platform
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how" className="how-it-works">
        <div className="container">
          <h2 className="section-title">How does it work?</h2>
          <p className="section-subtitle">
            A simple and effective 4-step process to fight food waste
          </p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Declare your surplus</h3>
              <p>
                Businesses declare their food surplus in just a few clicks via
                our platform.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Automatic geolocation</h3>
              <p>
                The system automatically locates the surplus and finds nearby
                associations.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Real-time notification</h3>
              <p>
                Associations receive instant notifications with all the details.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Collection and tracking</h3>
              <p>
                The redistribution is organized and tracked until its
                completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For whom section */}
      <section id="whom" className="for-whom">
        <div className="container">
          <h2 className="section-title">For whom?</h2>
          <p className="section-subtitle">
            Our platform connects generous businesses with committed
            associations
          </p>

          <div className="cards-grid">
            {/* بطاقة المتبرعين */}
            <div className="card businesses">
              <div className="card-icon">
                <i className="fas fa-store"></i>
              </div>
              <h3>For businesses</h3>
              <p className="card-subtitle">
                Bakeries, restaurants, supermarkets
              </p>
              <ul className="card-features">
                <li>
                  <i className="fas fa-check-circle"></i> Reduce your waste
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Tax deduction for
                  donations
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Positive social impact
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Tracking dashboard
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Automatic
                  notifications
                </li>
              </ul>
              <Link to="/auth?mode=signup&type=donor" className="btn-outline">
                I am a business
              </Link>
            </div>

            {/* بطاقة المستفيدين */}
            <div className="card associations">
              <div className="card-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>For associations</h3>
              <p className="card-subtitle">Food banks, aid centers</p>
              <ul className="card-features">
                <li>
                  <i className="fas fa-check-circle"></i> Free access to food
                  surplus
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Geolocation of
                  businesses
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Real-time booking
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Collection planning
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Impact statistics
                </li>
              </ul>
              <Link
                to="/auth?mode=signup&type=beneficiary"
                className="btn-primary"
              >
                I am an association
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact section */}
      <section id="impact" className="impact">
        <div className="container">
          <h2 className="section-title">Food waste in Algeria</h2>
          <p className="section-subtitle">
            A silent crisis that requires immediate action
          </p>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">900M</div>
              <div className="stat-label">Bread wasted/year</div>
              <div className="stat-description">In Algeria every year</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">5M</div>
              <div className="stat-label">Bread/day</div>
              <div className="stat-description">Wasted daily</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">10-15%</div>
              <div className="stat-label">Of production</div>
              <div className="stat-description">Ends up in the trash</div>
            </div>
          </div>

          <div className="quote">
            <i className="fas fa-quote-left"></i>
            <p>Every saved Food can feed a family in need</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to make a difference?</h2>
          <p>
            Join our community and participate in the fight against food waste
            today
          </p>
          <div className="cta-buttons">
            <Link to="/auth?mode=signup&type=donor" className="btn-outline">
              Create a business account
            </Link>
            <Link
              to="/auth?mode=signup&type=beneficiary"
              className="btn-primary"
            >
              Create an association account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <div className="footer-logo">
                <i className="fas fa-leaf"></i>
                <span>FoodShare</span>
              </div>
              <p>
                Together against food waste. A platform to redistribute surplus
                and create positive social impact.
              </p>
            </div>

            <div className="footer-links">
              <h4>Quick links</h4>
              <ul>
                <li>
                  <button
                    className="footer-link-btn"
                    onClick={() => scrollToSection("how")}
                  >
                    How it works
                  </button>
                </li>
                <li>
                  <button
                    className="footer-link-btn"
                    onClick={() => scrollToSection("whom")}
                  >
                    For whom
                  </button>
                </li>
                <li>
                  <button
                    className="footer-link-btn"
                    onClick={() => scrollToSection("impact")}
                  >
                    Impact
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-contact">
              <h4>Contact</h4>
              <ul>
                <li>
                  <i className="fas fa-envelope"></i> contact@foodshare.dz
                </li>
                <li>
                  <i className="fas fa-phone"></i> +213 12 34 56 789
                </li>
                <li>
                  <i className="fas fa-map-marker-alt"></i> Algérie
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 FoodShare. All rights reserved. Developed by us</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
