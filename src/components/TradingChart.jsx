import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../styles/chart.css";

const data = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 5200 },
  { name: "Wed", value: 4800 },
  { name: "Thu", value: 6100 },
  { name: "Fri", value: 7200 },
  { name: "Sat", value: 6900 },
];

function TradingChart() {
  return (
    <div className="chart-card">
      <h3>Market Performance</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TradingChart;