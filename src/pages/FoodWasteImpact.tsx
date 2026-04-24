import React from "react";
import { Link } from "react-router-dom";

const FoodWasteImpact: React.FC = () => {
  // Statistics from research
  const algeriaStats = [
    {
      value: "900M",
      label: "Baguettes per year",
      description:
        "What Algeria wastes annually, costing an estimated $320 million",
    },
    {
      value: "100M",
      label: "Baguettes during Ramadan",
      description: "Waste spikes dramatically during the holy month",
    },
    {
      value: "12-15M",
      label: "Tons of waste/year",
      description: "Household, inert and other categories of waste",
    },
    {
      value: "+5%",
      label: "Increase during Ramadan",
      description: "Consumption and waste increase significantly",
    },
  ];

  const globalStats = [
    {
      value: "$540B",
      label: "Global cost in 2026",
      description: "The financial cost of food waste worldwide",
    },
    {
      value: "17%",
      label: "Of total production",
      description: "Percentage of food wasted each year",
    },
    {
      value: "1.03B",
      label: "Tons per year",
      description: "Total volume of food wasted globally",
    },
    {
      value: "61%",
      label: "In households",
      description: "Most waste happens at home",
    },
  ];

  const categoryStats = [
    { category: "Meat", value: "$94B", percentage: "19%" },
    { category: "Fresh produce", value: "$88B", percentage: "16%" },
    { category: "Prepared meals", value: "$80B", percentage: "15%" },
    { category: "Dairy", value: "$79B", percentage: "14%" },
    { category: "Bakery", value: "$67B", percentage: "12%" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white py-16 md:py-20 text-center relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5">
          <Link
            to="/"
            className="inline-block text-white/80 hover:text-white transition-colors mb-6 text-sm"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back to home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Food Waste Impact
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-base md:text-lg">
            A silent crisis that requires immediate action
          </p>
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 max-w-md mx-auto">
            <i className="fas fa-quote-left text-emerald-300 text-xl mb-1 block"></i>
            <p className="text-lg md:text-xl font-semibold">
              Every saved Food can feed a family in need
            </p>
          </div>
        </div>
      </section>

      {/* Algeria Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-3">
            🇩🇿 In Algeria: An alarming crisis
          </h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10 text-sm md:text-base">
            The Ministry of Commerce and Export Promotion has launched a
            national awareness campaign entitled: "Let's unite to fight waste
            and promote responsible consumption."
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {algeriaStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                  {stat.value}
                </div>
                <div className="font-semibold text-gray-800 mb-1 text-sm">
                  {stat.label}
                </div>
                <div className="text-gray-400 text-xs">{stat.description}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border-l-4 border-emerald-500 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Why this waste?
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              The main causes identified are overconsumption during Ramadan,
              lack of awareness, and inefficient inventory management in
              businesses. The Minister of Environment, Kaouther Krikou,
              emphasized the importance of rationalizing consumption and
              reducing food waste.
            </p>
          </div>
        </div>
      </section>

      {/* Global Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-3">
            🌍 Worldwide: A planetary problem
          </h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10 text-sm md:text-base">
            According to a United Nations report,{" "}
            <strong className="text-emerald-600">
              17% of global food production
            </strong>{" "}
            is wasted each year. The global financial cost is expected to reach{" "}
            <strong className="text-emerald-600">$540 billion by 2026</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {globalStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-2">
                  {stat.value}
                </div>
                <div className="font-semibold text-gray-800 mb-1 text-sm">
                  {stat.label}
                </div>
                <div className="text-gray-400 text-xs">{stat.description}</div>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
            Losses by food category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {categoryStats.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100"
              >
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                  {item.category}
                </h4>
                <div className="text-xl font-bold text-emerald-600 mb-1">
                  {item.value}
                </div>
                <div className="text-gray-400 text-xs">
                  {item.percentage} of total
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border-l-4 border-emerald-500 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Main causes
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <i className="fas fa-times-circle text-emerald-500 mt-0.5"></i>{" "}
                <strong>51%</strong> of businesses cite poor inventory
                management and overstocking
              </li>
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <i className="fas fa-times-circle text-emerald-500 mt-0.5"></i>{" "}
                <strong>56%</strong> admit to having no visibility on losses
                during transport
              </li>
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <i className="fas fa-times-circle text-emerald-500 mt-0.5"></i>{" "}
                <strong>61%</strong> of businesses lack visibility on their
                waste
              </li>
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <i className="fas fa-times-circle text-emerald-500 mt-0.5"></i>{" "}
                <strong>61%</strong> of global waste occurs in households
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-3">
            💡 Solutions and initiatives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8">
            <div className="bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <i className="fas fa-hand-holding-heart text-emerald-500 text-4xl mb-3"></i>
              <h3 className="font-bold text-gray-800 mb-2">
                Solidarity and donations
              </h3>
              <p className="text-gray-500 text-sm">
                Minister Tayeb Zitouni emphasized the importance of solidarity
                with people in need to fight waste.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <i className="fas fa-recycle text-emerald-500 text-4xl mb-3"></i>
              <h3 className="font-bold text-gray-800 mb-2">
                Recycling and recovery
              </h3>
              <p className="text-gray-500 text-sm">
                More than <strong>5,000 operators</strong> work in recycling in
                Algeria, including over 1,900 specialized in household waste.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <i className="fas fa-utensils text-emerald-500 text-4xl mb-3"></i>
              <h3 className="font-bold text-gray-800 mb-2">
                Consumption rationalization
              </h3>
              <p className="text-gray-500 text-sm">
                National campaign "Ramadan: Moderation and sustainability for
                future generations" to promote responsible consumption.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <i className="fas fa-hand-holding-heart text-emerald-500 text-4xl mb-3"></i>
              <h3 className="font-bold text-gray-800 mb-2">FoodShare</h3>
              <p className="text-gray-500 text-sm">
                Our platform connects businesses with associations to
                redistribute surplus in real-time.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl py-10 px-6 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Ready to make a difference?
            </h3>
            <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">
              Join our community and participate in the fight against food waste
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register?type=business"
                className="bg-transparent border-2 border-white text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-white hover:text-emerald-600 transition-all"
              >
                I am a business
              </Link>
              <Link
                to="/register?type=association"
                className="bg-white text-emerald-600 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all"
              >
                I am an association
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with sources */}
      <footer className="py-8 text-center bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-5">
          <p className="text-gray-400 text-xs mb-3">
            <i className="fas fa-book text-emerald-500 mr-1"></i> Sources:
            Algerian Ministry of Commerce, United Nations, Avery Dennison,
            Ecofin Agency
          </p>
          <Link
            to="/"
            className="text-emerald-600 text-sm font-medium hover:text-emerald-700 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default FoodWasteImpact;
