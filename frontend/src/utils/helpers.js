export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN");
}

export function formatPercentage(value) {
  return `${Number(value).toFixed(1)}%`;
}

export function getGradeColor(grade) {
  const colors = {
    "A+": "text-green-600", "A": "text-green-500",
    "B+": "text-blue-600", "B": "text-blue-500",
    "C": "text-yellow-600", "D": "text-orange-500", "F": "text-red-600",
  };
  return colors[grade] || "text-gray-600";
}
