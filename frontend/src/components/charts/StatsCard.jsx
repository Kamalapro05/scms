export default function StatsCard({ title, value, icon, color = "blue" }) {
  const colorMap = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
    indigo: "bg-indigo-500",
  };
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
      <div className={`${colorMap[color] || "bg-blue-500"} p-4 rounded-lg text-white text-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
