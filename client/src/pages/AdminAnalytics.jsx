import { useState, useEffect } from "react";
import { analyticsAPI } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  Calendar,
  Award,
  Target,
} from "lucide-react";
import "./AdminAnalytics.css";

function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: null,
    topMissingSkills: [],
    trends: [],
    topJobTitles: [],
  });
  const [days, setDays] = useState(30);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const { data: response } = await analyticsAPI.getFullAnalytics({
          days,
        });
        setData({
          stats: response.data.stats,
          topMissingSkills: response.data.topMissingSkills || [],
          trends: response.data.trends || [],
          topJobTitles: response.data.topJobTitles || [],
        });
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [days]);

  const COLORS = [
    "#6366f1",
    "#a855f7",
    "#ec4899",
    "#06b6d4",
    "#10b981",
    "#f97316",
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="page flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Monitor platform usage and trends</p>
          </div>
          <div className="period-selector">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="form-input"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid grid-4">
          <div className="glass-card stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-value">{data.stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-value">{data.stats?.totalResumes || 0}</div>
            <div className="stat-label">Resumes Uploaded</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-value">{data.stats?.totalAnalyses || 0}</div>
            <div className="stat-label">Total Analyses</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-value">
              {data.stats?.averageMatchScore || 0}%
            </div>
            <div className="stat-label">Avg Match Score</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-grid grid-2">
          {/* Analysis Trends */}
          <div className="glass-card chart-card">
            <h3>
              <TrendingUp size={20} />
              Analysis Trends
            </h3>
            <div className="chart-container">
              {data.trends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.trends}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: "#6366f1", strokeWidth: 2 }}
                      name="Analyses"
                    />
                    <Line
                      type="monotone"
                      dataKey="avgScore"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2 }}
                      name="Avg Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No data available</div>
              )}
            </div>
          </div>

          {/* Top Missing Skills */}
          <div className="glass-card chart-card">
            <h3>
              <Award size={20} />
              Top Missing Skills
            </h3>
            <div className="chart-container">
              {data.topMissingSkills.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.topMissingSkills} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      type="number"
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                    />
                    <YAxis
                      type="category"
                      dataKey="skill"
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                      width={100}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      fill="#6366f1"
                      radius={[0, 4, 4, 0]}
                      name="Count"
                    >
                      {data.topMissingSkills.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Top Job Titles */}
        <div className="glass-card chart-card">
          <h3>
            <Calendar size={20} />
            Most Analyzed Job Titles
          </h3>
          <div className="chart-container">
            {data.topJobTitles.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.topJobTitles}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="title"
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    name="Analyses"
                  />
                  <Bar
                    dataKey="avgScore"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Avg Score"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data">No data available</div>
            )}
          </div>
        </div>

        {/* Skills Table */}
        {data.topMissingSkills.length > 0 && (
          <div className="glass-card skills-table-card">
            <h3>Skill Gap Analysis</h3>
            <div className="skills-table">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Skill</th>
                    <th>Missing Count</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topMissingSkills.map((skill, index) => (
                    <tr key={index}>
                      <td>#{index + 1}</td>
                      <td>{skill.skill}</td>
                      <td>{skill.count}</td>
                      <td>
                        <span
                          className={`priority-badge ${
                            index < 3 ? "high" : index < 6 ? "medium" : "low"
                          }`}
                        >
                          {index < 3 ? "High" : index < 6 ? "Medium" : "Low"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAnalytics;
