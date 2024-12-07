import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import PropTypes from "prop-types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

function EmailPieChart({ emails }) {
  const getEmailsByCategory = () => {
    const categories = {};
    emails.forEach(email => {
      const category = email.category || "Uncategorized";
      categories[category] = (categories[category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  if (emails.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={getEmailsByCategory()}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {getEmailsByCategory().map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

EmailPieChart.propTypes = {
  emails: PropTypes.array.isRequired,
};

export default EmailPieChart;
