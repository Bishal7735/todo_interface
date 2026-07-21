import React, { useState } from 'react';
import type { Task, Category, Priority } from '../types/todo';
import { useTabFocusTime } from '../services/focusTracker';
import {
  ChartsContainer,
  BarPlot,
  ChartsXAxis,
  ChartsYAxis,
  ChartsGrid,
} from '@mui/x-charts';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Briefcase,
  Palette,
  Code,
  User as UserIcon,
  HeartPulse,
  DollarSign,
  Activity,
  Layers,
  CheckSquare,
  Sparkles
} from 'lucide-react';

interface AnalyticsProps {
  tasks: Task[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ tasks }) => {
  const [activeMetric, setActiveMetric] = useState<'all' | 'tasks' | 'completed'>('all');

  // 1. Calculations for Weekly Productivity Chart
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const totalTasksData = [0, 0, 0, 0, 0, 0, 0];
  const completedTasksData = [0, 0, 0, 0, 0, 0, 0];

  tasks.forEach((t) => {
    const taskDateStr = t.updatedAt || t.createdAt || t.dueDate;
    if (!taskDateStr) return;
    const dateObj = new Date(taskDateStr);
    const dayOfWeek = (dateObj.getDay() + 6) % 7; // Map 0 (Sun) -> 6, 1 (Mon) -> 0

    totalTasksData[dayOfWeek] += 1;
    if (t.status === 'completed') {
      completedTasksData[dayOfWeek] += 1;
    }
  });

  const totalCompleted = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const maxTaskVal = Math.max(...completedTasksData);
  const peakDayIndex = completedTasksData.indexOf(maxTaskVal);
  const peakDay = maxTaskVal > 0 ? labels[peakDayIndex] : 'N/A';

  // 2. Score Calculation: 1 completed task = 1 point (No division system)
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  const productivityScore = totalCompleted;

  // 3. Priority Breakdown
  const priorities: { name: Priority; label: string; color: string; count: number }[] = [
    { name: 'urgent', label: '🔴 Urgent', color: '#F43F5E', count: tasks.filter((t) => t.priority === 'urgent').length },
    { name: 'high', label: '🟠 High', color: '#F59E0B', count: tasks.filter((t) => t.priority === 'high').length },
    { name: 'medium', label: '🟣 Medium', color: '#8B5CF6', count: tasks.filter((t) => t.priority === 'medium').length },
    { name: 'low', label: '🔵 Low', color: '#3B82F6', count: tasks.filter((t) => t.priority === 'low').length },
  ];

  // 4. Subtasks Checklist Ratio
  let totalSubtasks = 0;
  let completedSubtasks = 0;
  tasks.forEach((t) => {
    totalSubtasks += t.subtasks.length;
    completedSubtasks += t.subtasks.filter((st) => st.completed).length;
  });
  const subtaskRatio = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 100;

  // 5. Overdue Tasks Count
  const overdueCount = tasks.filter((t) => {
    if (t.status === 'completed' || !t.dueDate) return false;
    return new Date(t.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
  }).length;

  // 6. Category Breakdown Config
  const categories: { name: Category; icon: any; color: string; gradient: string }[] = [
    { name: 'Work', icon: Briefcase, color: '#6366F1', gradient: 'var(--grad-primary)' },
    { name: 'Design', icon: Palette, color: '#8B5CF6', gradient: 'linear-gradient(135deg, #A855F7, #EC4899)' },
    { name: 'Development', icon: Code, color: '#06B6D4', gradient: 'var(--grad-cyan)' },
    { name: 'Personal', icon: UserIcon, color: '#10B981', gradient: 'var(--grad-emerald)' },
    { name: 'Health', icon: HeartPulse, color: '#F43F5E', gradient: 'var(--grad-rose)' },
    { name: 'Finance', icon: DollarSign, color: '#F59E0B', gradient: 'var(--grad-amber)' },
  ];

  const series = [];
  if (activeMetric === 'all' || activeMetric === 'tasks') {
    series.push({
      type: 'bar' as const,
      data: totalTasksData,
      label: 'Total Tasks',
      color: '#8B5CF6',
    });
  }
  if (activeMetric === 'all' || activeMetric === 'completed') {
    series.push({
      type: 'bar' as const,
      data: completedTasksData,
      label: 'Completed Tasks',
      color: '#34D399', // Light green
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Analytics Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={26} color="var(--accent-purple)" />
            <span>Productivity & Task Analytics</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Real-time insights into your task completion velocity, category breakdown, and priority metrics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          <Sparkles size={16} color="var(--accent-cyan)" />
          <span>Live Workspace Intelligence</span>
        </div>
      </div>

      {/* Advanced Analysis Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {/* Productivity Score */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Productivity Score</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <Zap size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>{productivityScore}</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-purple)' }}>PTS</span>
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 600 }}>
            1 completed task = 1 point
          </div>
        </div>

        {/* Total Tasks Done */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Completed Tasks</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #34D399, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>{totalCompleted}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Peak Completion Day: <strong style={{ color: '#34D399' }}>{peakDay}</strong>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Completion Velocity</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--grad-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>{completionRate}%</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {totalCompleted} of {totalTasks} items completed
          </div>
        </div>

        {/* Subtask & Health Audit */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Bottleneck Audit</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--grad-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: overdueCount > 0 ? '#FB7185' : 'var(--text-primary)' }}>{overdueCount}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>overdue</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Subtasks done: <strong style={{ color: '#34D399' }}>{subtaskRatio}%</strong> ({completedSubtasks}/{totalSubtasks})
          </div>
        </div>
      </div>

      {/* Main Grid: Weekly Task & Completion Graph & Category Breakdown */}
      <div className="widgets-grid">
        {/* Weekly Productivity Bar Chart */}
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            borderRadius: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={18} color="#8B5CF6" />
                <span>Weekly Task & Completion Graph</span>
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Comparison of total tasks and completed tasks by day of week
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 0, 0, 0.25)', padding: '3px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'tasks', label: 'Total' },
                { id: 'completed', label: 'Completed' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMetric(item.id as any)}
                  style={{
                    border: 'none',
                    background: activeMetric === item.id ? 'var(--grad-primary)' : 'transparent',
                    color: activeMetric === item.id ? '#FFFFFF' : 'var(--text-secondary)',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="chart-wrapper">
            <ChartsContainer
              series={series}
              xAxis={[
                {
                  data: labels,
                  scaleType: 'band',
                  id: 'x-axis',
                  tickLabelStyle: { fontSize: 12, fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fill: '#9CA3AF' },
                },
              ]}
              yAxis={[
                {
                  id: 'y-axis',
                  min: 0,
                  tickLabelStyle: { fontSize: 11, fontFamily: 'Plus Jakarta Sans', fill: '#6B7280' },
                },
              ]}
              sx={{
                '& .MuiBarElement-root': { rx: 6, ry: 6, transition: 'opacity 0.15s ease', '&:hover': { opacity: 0.85 } },
                '& .MuiChartsGrid-line': { stroke: 'rgba(255, 255, 255, 0.05)' },
                '& .MuiChartsTooltip-root': { background: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '6px 10px' },
                '& .MuiChartsTooltip-cell': { color: '#E5E7EB', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600 },
                '& .MuiChartsTooltip-labelCell': { color: '#FFFFFF', fontWeight: 700 },
              }}
            >
              <ChartsGrid horizontal />
              <BarPlot borderRadius={6} />
              <ChartsXAxis axisId="x-axis" disableLine disableTicks />
              <ChartsYAxis axisId="y-axis" disableLine disableTicks />
            </ChartsContainer>
          </div>
        </div>

        {/* Category Breakdown Progress Widget */}
        <div className="glass-panel category-progress-widget">
          <div className="widget-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={18} color="var(--accent-cyan)" />
              <span>Category Breakdown</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tasks.length} total</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {categories.map((cat) => {
              const catTasks = tasks.filter((t) => t.category === cat.name);
              const completed = catTasks.filter((t) => t.status === 'completed').length;
              const total = catTasks.length;
              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
              const Icon = cat.icon;

              if (total === 0) return null;

              return (
                <div key={cat.name} className="category-item">
                  <div className="category-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: cat.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff'
                        }}
                      >
                        <Icon size={13} />
                      </div>
                      <span style={{ color: 'var(--text-primary)' }}>{cat.name}</span>
                    </div>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {completed}/{total} ({percentage}%)
                    </span>
                  </div>

                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        background: cat.gradient
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Priority Distribution Matrix */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--accent-indigo)" />
          <span>Priority Distribution Matrix</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {priorities.map((p) => {
            const pPct = totalTasks > 0 ? Math.round((p.count / totalTasks) * 100) : 0;
            return (
              <div key={p.name} style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <span>{p.label}</span>
                  <span style={{ color: p.color }}>{p.count} tasks</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${pPct}%`, background: p.color }} />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{pPct}% of total workload</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
