import React from "react";

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
      description: "In Algeria every year",
    },
    {
      value: "5M",
      label: "Bread/day",
      description: "Wasted daily",
    },
    {
      value: "10-15%",
      label: "Of production",
      description: "Ends up in the trash",
    },
  ];

  return (
    <section id="impact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* عنوان القسم */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-slate-800 mb-3">
          Food waste in Algeria
        </h2>
        <p className="text-center text-slate-500 max-w-2xl mx-auto mb-12 text-lg">
          A silent crisis that requires immediate action
        </p>

        {/* شبكة الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-12 bg-slate-50 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-lg"
            >
              <div className="text-6xl md:text-7xl font-extrabold text-secondary-500 mb-3">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-slate-800 mb-2">
                {stat.label}
              </div>
              <div className="text-slate-500">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* الاقتباس */}
        <div className="relative max-w-4xl mx-auto bg-primary-100 rounded-3xl p-12 md:p-16 text-center shadow-md">
          <i className="fas fa-quote-left absolute top-8 left-8 text-5xl text-primary-500 opacity-25"></i>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-800 italic leading-relaxed">
            Every saved Food can feed a family in need
          </p>
        </div>
      </div>
    </section>
  );
};

export default Impact;