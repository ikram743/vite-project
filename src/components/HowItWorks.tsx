
import React from "react";

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
      description:
        "Businesses declare their food surplus in just a few clicks via our platform.",
    },
    {
      number: 2,
      title: "Automatic geolocation",
      description:
        "The system automatically locates the surplus and finds nearby associations.",
    },
    {
      number: 3,
      title: "Real-time notification",
      description:
        "Associations receive instant notifications with all the details.",
    },
    {
      number: 4,
      title: "Collection and tracking",
      description:
        "The redistribution is organized and tracked until its completion.",
    },
  ];

  return (
    <section id="how" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* عنوان القسم */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-slate-800 mb-4">
          How does it work?
        </h2>
        <p className="text-center text-slate-500 max-w-2xl mx-auto mb-12 text-lg">
          A simple and effective 4-step process to fight food waste
        </p>

        {/* شبكة الخطوات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
            >
              <div className="w-14 h-14 bg-primary-100 text-primary-600 text-2xl font-bold rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors mx-auto">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed text-center">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;