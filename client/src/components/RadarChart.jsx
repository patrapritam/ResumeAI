import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import "./RadarChart.css";

function RadarChart({
  resumeSkills = [],
  requiredSkills = [],
  title = "Skill Comparison",
}) {
  // Create data for radar chart
  const allSkills = [...new Set([...requiredSkills])].slice(0, 8);

  const data = allSkills.map((skill) => {
    const hasSkill = resumeSkills.some(
      (s) => s.toLowerCase() === skill.toLowerCase(),
    );
    return {
      skill: skill.length > 12 ? skill.slice(0, 12) + "..." : skill,
      fullSkill: skill,
      you: hasSkill ? 100 : 0,
      required: 100,
    };
  });

  if (data.length === 0) {
    return (
      <div className="radar-chart-empty">
        <p>No skills to compare</p>
      </div>
    );
  }

  return (
    <div className="radar-chart-container">
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart
          data={data}
          margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
        >
          <PolarGrid stroke="var(--border-color)" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
          />
          <Radar
            name="Required"
            dataKey="required"
            stroke="var(--accent-purple)"
            fill="var(--accent-purple)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="Your Skills"
            dataKey="you"
            stroke="var(--accent-green)"
            fill="var(--accent-green)"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Legend wrapperStyle={{ color: "var(--text-primary)" }} />
          <Tooltip
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              color: "var(--text-primary)",
            }}
            formatter={(value, name) => [value === 100 ? "Yes" : "No", name]}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RadarChart;
