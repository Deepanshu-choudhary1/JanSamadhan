import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip,
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  BarChart, Bar, Legend
} from "recharts";
import { Card, CardContent } from "../../components/ui/card";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Analytics() {
  const [summary, setSummary] = useState({});
  const [categories, setCategories] = useState([]);
  const [resolutionTimes, setResolutionTimes] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [summaryRes, catRes, resTimeRes, trendRes] = await Promise.all([
          axios.get("/api/analytics/summary", { headers }),
          axios.get("/api/analytics/issues-by-category", { headers }),
          axios.get("/api/analytics/resolution-times", { headers }),
          axios.get("/api/analytics/trend", { headers }),
        ]);

        setSummary(summaryRes.data || {});
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setResolutionTimes(Array.isArray(resTimeRes.data) ? resTimeRes.data : []);
        setTrends(Array.isArray(trendRes.data) ? trendRes.data : []);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg font-medium text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Summary Cards */}
      <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        {["total", "reported", "inProgress", "resolved"].map((key) => (
          <Card key={key} className="text-center">
            <CardContent>
              <h2 className="text-lg font-semibold capitalize">{key}</h2>
              <p className="text-3xl font-bold text-blue-600">
                {summary[key] ?? 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pie Chart - Issues by Category */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Issues by Category</h2>
          {categories.length > 0 ? (
            <PieChart width={400} height={300}>
              <Pie
                data={categories}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categories.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip />
            </PieChart>
          ) : (
            <p className="text-gray-500">No category data available</p>
          )}
        </CardContent>
      </Card>

      {/* Line Chart - Avg Resolution Times */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">
            Avg Resolution Time (Days)
          </h2>
          {resolutionTimes.length > 0 ? (
            <LineChart width={500} height={300} data={resolutionTimes}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <ReTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgResolutionDays"
                stroke="#8884d8"
              />
            </LineChart>
          ) : (
            <p className="text-gray-500">No resolution time data available</p>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart - Issues Trend */}
      <Card className="col-span-2">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Issues Trend</h2>
          {trends.length > 0 ? (
            <BarChart width={900} height={300} data={trends}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <ReTooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          ) : (
            <p className="text-gray-500">No trend data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
