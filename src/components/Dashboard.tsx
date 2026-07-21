import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User } from '../types/todo';
import { api } from '../services/api';
import { Settings as SettingsComponent } from './Settings';
import { Analytics as AnalyticsComponent } from './Analytics';
import { Tasks as TasksComponent } from './Tasks';
import { useTabFocusTime } from '../services/focusTracker';
import {
  ChartsContainer,
  BarPlot,
  ChartsXAxis,
  ChartsYAxis,
  ChartsGrid,
} from '@mui/x-charts';
import {
  Search,
  Plus,
  Moon,
  Sun,
  Bell,
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  FolderKanban,
  Settings,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  TrendingUp,
  Calendar,
  PieChart,
  Briefcase,
  User as UserIcon,
  Palette,
  Code,
  HeartPulse,
  DollarSign,
  LayoutGrid,
  List,
  ArrowUpDown,
  Check,
  Pin,
  Edit2,
  Trash2,
  Tag,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

// ==========================================
// EMBEDDED COMPONENT STYLES
// ==========================================
const DASHBOARD_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  --bg-primary: #0B0F19;
  --bg-secondary: #111827;
  --bg-card: rgba(31, 41, 55, 0.65);
  --bg-card-hover: rgba(45, 55, 72, 0.75);
  --bg-input: rgba(17, 24, 39, 0.8);
  --border-color: rgba(255, 255, 255, 0.08);
  --border-glow: rgba(99, 102, 241, 0.3);
  
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
  --text-muted: #6B7280;

  --accent-purple: #8B5CF6;
  --accent-indigo: #6366F1;
  --accent-blue: #3B82F6;
  --accent-cyan: #06B6D4;
  --accent-emerald: #10B981;
  --accent-rose: #F43F5E;
  --accent-amber: #F59E0B;

  --grad-primary: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  --grad-cyan: linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%);
  --grad-emerald: linear-gradient(135deg, #10B981 0%, #059669 100%);
  --grad-rose: linear-gradient(135deg, #F43F5E 0%, #E11D48 100%);
  --grad-amber: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);

  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.25);
  --radius-lg: 18px;
  --radius-md: 12px;
  --radius-sm: 8px;

  --transition-fast: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.light-theme {
  --bg-primary: #F8FAFC;
  --bg-secondary: #FFFFFF;
  --bg-card: rgba(255, 255, 255, 0.85);
  --bg-card-hover: rgba(241, 245, 249, 0.95);
  --bg-input: #F1F5F9;
  --border-color: rgba(0, 0, 0, 0.08);
  --border-glow: rgba(99, 102, 241, 0.2);

  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;

  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.08);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.15);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-primary);
  position: relative;
  transition: var(--transition-normal);
  background-image:
    radial-gradient(ellipse 80% 60% at 10% 10%, rgba(99,102,241,0.10) 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 90% 80%, rgba(139,92,246,0.09) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 50% 100%, rgba(6,182,212,0.07) 0%, transparent 55%);
}

.light-theme.dashboard-container {
  background-image:
    radial-gradient(ellipse 80% 60% at 10% 10%, rgba(99,102,241,0.06) 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 90% 80%, rgba(139,92,246,0.05) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 50% 100%, rgba(6,182,212,0.04) 0%, transparent 55%);
}

.glass-panel {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.glass-panel:hover {
  border-color: var(--border-glow);
  box-shadow: var(--shadow-md);
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
}

.dashboard-content {
  padding: 24px 32px 40px 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 28px;
  overflow-y: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
}

.widgets-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  min-height: 260px;
  height: clamp(220px, 28vw, 320px);
}

.chart-stat-chips {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.chart-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.chart-chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.chart-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.chart-title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tasks-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-banner {
  padding: 28px 32px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(6, 182, 212, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: var(--radius-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.welcome-banner::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
  pointer-events: none;
}

.welcome-title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
}

.light-theme .welcome-title {
  background: linear-gradient(90deg, #0F172A 0%, #4338CA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  max-width: 500px;
}

.welcome-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.2);
  padding: 12px 20px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.light-theme .welcome-stats {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(0, 0, 0, 0.05);
}

.progress-circle-wrapper {
  position: relative;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.stat-trend {
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.stat-trend.positive { color: var(--accent-emerald); }
.stat-trend.warning { color: var(--accent-amber); }
.stat-trend.urgent { color: var(--accent-rose); }

.sidebar {
  width: 260px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  overflow: hidden;
  position: relative;
}

.sidebar.collapsed {
  width: 72px;
  padding: 24px 10px;
}

.sidebar-collapse-btn {
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  transition: var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.sidebar-collapse-btn:hover {
  background: var(--accent-indigo);
  color: #fff;
  border-color: var(--accent-indigo);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 4px 24px 4px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 24px;
  overflow: hidden;
  white-space: nowrap;
}

.sidebar.collapsed .sidebar-logo {
  justify-content: center;
  padding: 0 0 24px 0;
}

.sidebar.collapsed .logo-text,
.sidebar.collapsed .logo-subtitle,
.sidebar.collapsed .nav-label,
.sidebar.collapsed .nav-badge,
.sidebar.collapsed .sidebar-user-info,
.sidebar.collapsed .sidebar-streak-text,
.sidebar.collapsed .sidebar-logout-text {
  display: none;
}

.sidebar.collapsed .nav-item-btn {
  justify-content: center;
  padding: 12px;
}

.sidebar.collapsed .nav-item-content {
  justify-content: center;
}

.sidebar.collapsed .sidebar-user-card {
  justify-content: center;
  padding: 10px;
}

.sidebar.collapsed .sidebar-logout-btn {
  justify-content: center;
  padding: 10px;
}

.sidebar.collapsed .sidebar-streak-card {
  justify-content: center;
  padding: 10px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--grad-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: var(--shadow-glow);
}

.logo-text {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, #8B5CF6, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
}

.nav-item-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
}

.nav-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-item-btn:hover {
  background-color: var(--bg-card-hover);
  color: var(--text-primary);
}

.nav-item-btn.active {
  background: var(--grad-primary);
  color: #FFFFFF;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}

.nav-badge {
  background: rgba(255, 255, 255, 0.15);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.nav-item-btn.active .nav-badge {
  background: rgba(255, 255, 255, 0.25);
}

.header {
  padding: 16px 32px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.header-search {
  position: relative;
  width: 360px;
}

.header-search input {
  width: 100%;
  padding: 7px 14px 7px 38px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
  transition: var(--transition-fast);
}

.header-search input:focus {
  border-color: var(--accent-indigo);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-primary {
  background: var(--grad-primary);
  color: white;
  border: none;
  padding: 7px 16px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: var(--transition-fast);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
}

.btn-icon-toggle {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-icon-toggle:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
  border-color: var(--border-glow);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 12px;
  border-left: 1px solid var(--border-color);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--grad-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #fff;
  border: 2px solid var(--accent-indigo);
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: var(--text-muted);
}

/* Sidebar user card */
.sidebar-user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: var(--radius-md);
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.15);
  cursor: pointer;
  transition: var(--transition-fast);
  overflow: hidden;
  margin-bottom: 8px;
}

.sidebar-user-card:hover {
  background: rgba(99, 102, 241, 0.14);
  border-color: rgba(99, 102, 241, 0.3);
}

.sidebar-user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.sidebar-user-name {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-user-role {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Sidebar streak card */
.sidebar-streak-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(244, 63, 94, 0.1));
  border: 1px solid rgba(245, 158, 11, 0.25);
  margin-bottom: 8px;
  overflow: hidden;
}

.sidebar-streak-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Sidebar logout button */
.sidebar-logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(244, 63, 94, 0.2);
  background: rgba(244, 63, 94, 0.06);
  color: var(--accent-rose);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
  overflow: hidden;
  white-space: nowrap;
}

.sidebar-logout-btn:hover {
  background: rgba(244, 63, 94, 0.14);
  border-color: rgba(244, 63, 94, 0.4);
}

/* Background gradient orbs */
.bg-orbs {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
  animation: orbFloat 12s ease-in-out infinite alternate;
}

.bg-orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #6366F1, transparent 70%);
  top: -10%;
  left: -5%;
  animation-delay: 0s;
}

.bg-orb-2 {
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, #8B5CF6, transparent 70%);
  top: 30%;
  right: -8%;
  animation-delay: -4s;
}

.bg-orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #06B6D4, transparent 70%);
  bottom: -8%;
  left: 30%;
  animation-delay: -8s;
}

.bg-orb-4 {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, #10B981, transparent 70%);
  bottom: 20%;
  right: 25%;
  animation-delay: -2s;
}

.light-theme .bg-orb {
  opacity: 0.10;
}

@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -20px) scale(1.08); }
  100% { transform: translate(-20px, 30px) scale(0.94); }
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
}

.filter-pills {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.pill-btn {
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
  white-space: nowrap;
}

.pill-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-glow);
}

.pill-btn.active {
  background: var(--accent-indigo);
  color: white;
  border-color: var(--accent-indigo);
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.select-input {
  padding: 6px 12px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 600;
  outline: none;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 3px;
}

.view-btn {
  padding: 6px 10px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.view-btn.active {
  background: var(--accent-indigo);
  color: white;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.tasks-list-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  position: relative;
  overflow: hidden;
  border-left: 4px solid transparent;
}

.task-card.priority-urgent { border-left-color: var(--accent-rose); }
.task-card.priority-high { border-left-color: var(--accent-amber); }
.task-card.priority-medium { border-left-color: var(--accent-indigo); }
.task-card.priority-low { border-left-color: var(--accent-cyan); }

.task-card.completed {
  opacity: 0.7;
}

.task-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.task-checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.custom-checkbox {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
  flex-shrink: 0;
  margin-top: 2px;
}

.custom-checkbox.checked {
  background: var(--accent-emerald);
  border-color: var(--accent-emerald);
  color: white;
}

.task-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  transition: var(--transition-fast);
}

.task-card.completed .task-title {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-desc {
  font-size: 13px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.task-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-urgent { background: rgba(244, 63, 94, 0.15); color: #F43F5E; }
.badge-high { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }
.badge-medium { background: rgba(99, 102, 241, 0.15); color: #818CF8; }
.badge-low { background: rgba(6, 182, 212, 0.15); color: #22D3EE; }

.task-subtasks-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-bar-bg {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.light-theme .progress-bar-bg {
  background: rgba(0, 0, 0, 0.08);
}

.progress-bar-fill {
  height: 100%;
  background: var(--grad-primary);
  border-radius: 10px;
  transition: width 0.4s ease;
}

.task-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-secondary);
}

.due-date-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.due-date-tag.overdue {
  color: var(--accent-rose);
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.action-btn:hover {
  color: var(--text-primary);
  background: var(--bg-card-hover);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 580px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: slideUp 0.25s cubic-bezier(0, 0, 0.2, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 20px;
  font-weight: 800;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 8px 12px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
  transition: var(--transition-fast);
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: var(--accent-indigo);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.btn-secondary {
  background: var(--bg-input);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 7px 16px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-secondary:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.category-progress-widget {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.widget-title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.category-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
}

.empty-state {
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
  color: var(--text-muted);
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: var(--bg-input);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-indigo);
}

@media (max-width: 1200px) {
  .widgets-grid {
    grid-template-columns: 3fr 2fr;
  }
}

@media (max-width: 1024px) {
  .widgets-grid {
    grid-template-columns: 1fr;
  }
  .chart-wrapper {
    min-height: 240px;
    height: clamp(200px, 35vw, 280px);
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding: 16px;
  }
  .dashboard-content {
    padding: 16px;
  }
  .header-search {
    width: 200px;
  }
  .welcome-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .chart-stat-chips {
    gap: 8px;
  }
  .chart-wrapper {
    min-height: 200px;
    height: clamp(180px, 45vw, 240px);
  }
}
`;


// ==========================================
// 1. TYPES & INTERFACES
// ==========================================
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Category = 'Work' | 'Personal' | 'Design' | 'Development' | 'Health' | 'Finance';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  status: TaskStatus;
  dueDate: string;
  estimatedMinutes?: number;
  subtasks: Subtask[];
  pinned?: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'grid' | 'list';
export type SortBy = 'dueDate' | 'priority' | 'title' | 'createdAt';

export interface FilterState {
  search: string;
  category: Category | 'All';
  priority: Priority | 'All';
  status: TaskStatus | 'All';
  viewMode: ViewMode;
  sortBy: SortBy;
}

export interface DashboardStats {
  total: number;
  completed: number;
  inProgress: number;
  urgent: number;
  completionPercentage: number;
}

export type NavSection = 'dashboard' | 'tasks' | 'analytics' | 'categories' | 'settings';

// ==========================================
// 2. SIDEBAR COMPONENT
// ==========================================
interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  totalCount: number;
  completedCount: number;
  user?: User | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  totalCount,
  completedCount,
  user,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const pendingCount = totalCount - completedCount;
  const userName = user?.name || 'Bishal Roy';
  const userRole = user?.role || 'Product Designer';
  const userInitials = user?.avatarInitials || userName.substring(0, 2).toUpperCase();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>


      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon" style={{ flexShrink: 0 }}>
          <Sparkles size={22} />
        </div>
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="logo-text">ListiFy 2.0</span>
            <span className="logo-subtitle" style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Pro Workspace</span>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <ul className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <li key={item.id}>
              <button
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectSection(item.id as NavSection)}
                title={collapsed ? item.label : undefined}
              >
                <div className="nav-item-content">
                  <Icon size={19} />
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </div>
                {!collapsed && item.badge !== null && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Bottom section */}
      <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* User Profile Card */}
        <div className="sidebar-user-card" title={collapsed ? `${userName} — ${userRole}` : undefined}>
          <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '13px' }}>{userInitials}</div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{userName}</span>
              <span className="sidebar-user-role">{userRole}</span>
            </div>
          )}
        </div>

        {/* User Profile Card */}

        {/* Collapse toggle button */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>

        {/* Logout Button */}
        <button
          className="sidebar-logout-btn"
          title={collapsed ? 'Log Out' : undefined}
          onClick={onLogout || (() => alert('Logged out!'))}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span className="sidebar-logout-text">Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

// ==========================================
// 3. HEADER COMPONENT
// ==========================================
interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenNewTaskModal: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onOpenNewTaskModal,
  darkMode,
  onToggleTheme,
}) => {
  return (
    <header className="header">
      <div className="header-search">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search tasks, tags, or categories..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="header-actions">
        <button className="btn-primary" onClick={onOpenNewTaskModal}>
          <Plus size={18} />
          <span>New Task</span>
        </button>

        <button
          className="btn-icon-toggle"
          onClick={onToggleTheme}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button className="btn-icon-toggle" style={{ position: 'relative' }} title="Notifications">
          <Bell size={19} />
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-rose)',
              boxShadow: '0 0 8px var(--accent-rose)'
            }}
          />
        </button>
      </div>
    </header>
  );
};

// ==========================================
// 4. STATS CARDS COMPONENT
// ==========================================
interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      label: 'All created tasks',
      trend: `${stats.total} total items`,
      trendClass: 'positive',
      icon: ListTodo,
      gradient: 'var(--grad-primary)',
      color: '#6366F1'
    },
    {
      title: 'Completed',
      value: stats.completed,
      label: `${stats.completionPercentage}% overall progress`,
      trend: `${stats.completed} done (${stats.completionPercentage}%)`,
      trendClass: 'positive',
      icon: CheckCircle2,
      gradient: 'var(--grad-emerald)',
      color: '#10B981'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      label: 'Currently active',
      trend: `${stats.inProgress} active sprint`,
      trendClass: 'warning',
      icon: Clock,
      gradient: 'var(--grad-cyan)',
      color: '#06B6D4'
    },
    {
      title: 'Urgent Priority',
      value: stats.urgent,
      label: 'Requires attention',
      trend: stats.urgent > 0 ? `${stats.urgent} high priority` : 'All clear',
      trendClass: stats.urgent > 0 ? 'urgent' : 'positive',
      icon: AlertTriangle,
      gradient: 'var(--grad-rose)',
      color: '#F43F5E'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="glass-panel stat-card">
            <div
              className="stat-icon-wrapper"
              style={{
                background: card.gradient,
                boxShadow: `0 4px 16px ${card.color}35`
              }}
            >
              <Icon size={24} color="#FFFFFF" />
            </div>

            <div className="stat-info">
              <span className="stat-label">{card.title}</span>
              <span className="stat-value">{card.value}</span>
              <div className={`stat-trend ${card.trendClass}`}>
                <TrendingUp size={13} />
                <span>{card.trend}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// 5. PRODUCTIVITY CHART COMPONENT
// ==========================================
interface ProductivityChartProps {
  tasks: Task[];
}export const ProductivityChart: React.FC<ProductivityChartProps> = ({ tasks }) => {
  const [activeMetric, setActiveMetric] = useState<'all' | 'tasks' | 'completed'>('all');
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const totalTasksData = [0, 0, 0, 0, 0, 0, 0];
  const completedTasksData = [0, 0, 0, 0, 0, 0, 0];

  tasks.forEach((t) => {
    const taskDateStr = t.updatedAt || t.createdAt || t.dueDate;
    if (!taskDateStr) return;
    const dateObj = new Date(taskDateStr);
    const dayOfWeek = (dateObj.getDay() + 6) % 7;

    totalTasksData[dayOfWeek] += 1;
    if (t.status === 'completed') {
      completedTasksData[dayOfWeek] += 1;
    }
  });

  const totalCompleted = tasks.filter((t) => t.status === 'completed').length;
  const maxTaskVal = Math.max(...completedTasksData);
  const peakDayIndex = completedTasksData.indexOf(maxTaskVal);
  const peakDay = maxTaskVal > 0 ? labels[peakDayIndex] : 'N/A';

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
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        position: 'relative',
      }}
    >
      {/* Simple Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <BarChart3 size={18} color="#8B5CF6" />
            <span>Weekly Productivity</span>
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Comparison of total tasks created vs completed tasks
          </p>
        </div>

        {/* Simple Metric Filter Toggles */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '3px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
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

      {/* Clean Quick Stats Summary Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8B5CF6' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Total Tasks: <strong style={{ color: 'var(--text-primary)' }}>{tasks.length}</strong>
          </span>
        </div>
        <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34D399' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Completed Tasks: <strong style={{ color: '#34D399' }}>{totalCompleted}</strong>
          </span>
        </div>
        <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Peak Day: <strong style={{ color: '#34D399' }}>{peakDay}</strong>
          </span>
        </div>
      </div>

      {/* Simple Bar Pools Chart */}
      <div className="chart-wrapper">
        <ChartsContainer
          series={series}
          xAxis={[
            {
              data: labels,
              scaleType: 'band',
              id: 'x-axis',
              tickLabelStyle: {
                fontSize: 12,
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 600,
                fill: '#9CA3AF',
              },
            },
          ]}
          yAxis={[
            {
              id: 'y-axis',
              min: 0,
              tickLabelStyle: {
                fontSize: 11,
                fontFamily: 'Plus Jakarta Sans',
                fill: '#6B7280',
              },
            },
          ]}
          sx={{
            '& .MuiBarElement-root': {
              rx: 6,
              ry: 6,
              transition: 'opacity 0.15s ease',
              '&:hover': {
                opacity: 0.85,
              },
            },
            '& .MuiChartsGrid-line': {
              stroke: 'rgba(255, 255, 255, 0.05)',
            },
            '& .MuiChartsTooltip-root': {
              background: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '6px 10px',
            },
            '& .MuiChartsTooltip-cell': {
              color: '#E5E7EB',
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 12,
              fontWeight: 600,
            },
            '& .MuiChartsTooltip-labelCell': {
              color: '#FFFFFF',
              fontWeight: 700,
            },
          }}
        >
          <ChartsGrid horizontal />
          <BarPlot borderRadius={6} />
          <ChartsXAxis axisId="x-axis" disableLine disableTicks />
          <ChartsYAxis axisId="y-axis" disableLine disableTicks />
        </ChartsContainer>
      </div>
    </div>
  );
};

// ==========================================
// 6. CATEGORY PROGRESS COMPONENT
// ==========================================
interface CategoryProgressProps {
  tasks: Task[];
}

export const CategoryProgress: React.FC<CategoryProgressProps> = ({ tasks }) => {
  const categories: { name: Category; icon: any; color: string; gradient: string }[] = [
    { name: 'Work', icon: Briefcase, color: '#6366F1', gradient: 'var(--grad-primary)' },
    { name: 'Design', icon: Palette, color: '#8B5CF6', gradient: 'linear-gradient(135deg, #A855F7, #EC4899)' },
    { name: 'Development', icon: Code, color: '#06B6D4', gradient: 'var(--grad-cyan)' },
    { name: 'Personal', icon: UserIcon, color: '#10B981', gradient: 'var(--grad-emerald)' },
    { name: 'Health', icon: HeartPulse, color: '#F43F5E', gradient: 'var(--grad-rose)' },
    { name: 'Finance', icon: DollarSign, color: '#F59E0B', gradient: 'var(--grad-amber)' },
  ];

  const getCategoryStats = (catName: Category) => {
    const catTasks = tasks.filter((t) => t.category === catName);
    const completed = catTasks.filter((t) => t.status === 'completed').length;
    const total = catTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  };

  return (
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
          const { total, completed, percentage } = getCategoryStats(cat.name);
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
  );
};

// ==========================================
// 7. TASK FILTER TOOLBAR COMPONENT
// ==========================================
interface TaskFilterProps {
  filter: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({ filter, onUpdateFilter }) => {
  const categories: (Category | 'All')[] = ['All', 'Work', 'Design', 'Development', 'Personal', 'Health', 'Finance'];
  const statuses: { label: string; value: TaskStatus | 'All' }[] = [
    { label: 'All Tasks', value: 'All' },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="glass-panel filter-bar">
      <div className="filter-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`pill-btn ${filter.category === cat ? 'active' : ''}`}
            onClick={() => onUpdateFilter({ category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="filter-controls">
        <select
          className="select-input"
          value={filter.status}
          onChange={(e) => onUpdateFilter({ status: e.target.value as TaskStatus | 'All' })}
        >
          {statuses.map((st) => (
            <option key={st.value} value={st.value}>
              {st.label}
            </option>
          ))}
        </select>

        <select
          className="select-input"
          value={filter.priority}
          onChange={(e) => onUpdateFilter({ priority: e.target.value as Priority | 'All' })}
        >
          <option value="All">All Priorities</option>
          <option value="urgent">🔴 Urgent</option>
          <option value="high">🟠 High</option>
          <option value="medium">🟣 Medium</option>
          <option value="low">🔵 Low</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowUpDown size={14} color="var(--text-muted)" />
          <select
            className="select-input"
            value={filter.sortBy}
            onChange={(e) => onUpdateFilter({ sortBy: e.target.value as SortBy })}
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="createdAt">Created Date</option>
          </select>
        </div>

        <div className="view-toggle">
          <button
            className={`view-btn ${filter.viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onUpdateFilter({ viewMode: 'grid' })}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={`view-btn ${filter.viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onUpdateFilter({ viewMode: 'list' })}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. TASK ITEM CARD COMPONENT
// ==========================================
interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onTogglePin,
  onEditTask,
  onDeleteTask,
  onToggleSubtask,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const isCompleted = task.status === 'completed';

  const completedSubtasksCount = task.subtasks.filter((st) => st.completed).length;
  const totalSubtasksCount = task.subtasks.length;
  const subtaskPercentage =
    totalSubtasksCount > 0 ? Math.round((completedSubtasksCount / totalSubtasksCount) * 100) : 0;

  const isOverdue =
    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0) && !isCompleted;

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'badge-urgent';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  return (
    <div className={`glass-panel task-card priority-${task.priority} ${isCompleted ? 'completed' : ''}`}>
      <div className="task-card-header">
        <div className="task-checkbox-wrapper">
          <div
            className={`custom-checkbox ${isCompleted ? 'checked' : ''}`}
            onClick={() => onToggleComplete(task.id)}
          >
            {isCompleted && <Check size={14} />}
          </div>

          <div className="task-title-group">
            <h4 className="task-title">{task.title}</h4>
            {task.description && <p className="task-desc">{task.description}</p>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`task-badge ${getPriorityBadgeClass(task.priority)}`}>
            {task.priority}
          </span>
          <button
            className="action-btn"
            style={{ color: task.pinned ? 'var(--accent-amber)' : 'var(--text-muted)' }}
            onClick={() => onTogglePin(task.id)}
            title={task.pinned ? "Unpin Task" : "Pin Task"}
          >
            <Pin size={16} fill={task.pinned ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {totalSubtasksCount > 0 && (
        <div className="task-subtasks-progress">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
            onClick={() => setShowSubtasks(!showSubtasks)}
          >
            <span>
              Subtasks ({completedSubtasksCount}/{totalSubtasksCount})
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{subtaskPercentage}%</span>
              {showSubtasks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>

          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${subtaskPercentage}%` }} />
          </div>

          {showSubtasks && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              {task.subtasks.map((st) => (
                <div
                  key={st.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: st.completed ? 'line-through' : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => onToggleSubtask(task.id, st.id)}
                >
                  <div className={`custom-checkbox ${st.completed ? 'checked' : ''}`} style={{ width: '16px', height: '16px' }}>
                    {st.completed && <Check size={10} />}
                  </div>
                  <span>{st.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {task.tags && task.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {task.tags.map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: '11px',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '2px 8px',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="task-card-footer">
        <div className={`due-date-tag ${isOverdue ? 'overdue' : ''}`}>
          <Calendar size={13} />
          <span>{isOverdue ? `Overdue (${task.dueDate})` : task.dueDate}</span>
        </div>

        <div className="task-actions">
          <button className="action-btn" onClick={() => onEditTask(task)} title="Edit Task">
            <Edit2 size={15} />
          </button>
          <button className="action-btn" onClick={() => onDeleteTask(task.id)} title="Delete Task">
            <Trash2 size={15} color="var(--accent-rose)" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. TASK LIST CONTAINER COMPONENT
// ==========================================
interface TaskListProps {
  tasks: Task[];
  viewMode: ViewMode;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onOpenNewTaskModal: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  viewMode,
  onToggleComplete,
  onTogglePin,
  onEditTask,
  onDeleteTask,
  onToggleSubtask,
  onOpenNewTaskModal,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="glass-panel empty-state">
        <div className="empty-icon">
          <CheckCircle size={32} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
            No tasks found
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            All caught up! Or try adjusting your search & filters.
          </p>
        </div>
        <button className="btn-primary" onClick={onOpenNewTaskModal} style={{ marginTop: '8px' }}>
          Create New Task
        </button>
      </div>
    );
  }

  const pinnedTasks = tasks.filter((t) => t.pinned);
  const unpinnedTasks = tasks.filter((t) => !t.pinned);
  const containerClassName = viewMode === 'grid' ? 'tasks-grid' : 'tasks-list-view';

  return (
    <div className="tasks-section">
      {pinnedTasks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: 'var(--accent-amber)' }}>
            <Pin size={15} />
            <span>PINNED TASKS ({pinnedTasks.length})</span>
          </div>

          <div className={containerClassName}>
            {pinnedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onTogglePin={onTogglePin}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onToggleSubtask={onToggleSubtask}
              />
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {pinnedTasks.length > 0 && unpinnedTasks.length > 0 && (
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '12px' }}>
            OTHER TASKS ({unpinnedTasks.length})
          </div>
        )}

        <div className={containerClassName}>
          {unpinnedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onTogglePin={onTogglePin}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onToggleSubtask={onToggleSubtask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. TASK MODAL COMPONENT
// ==========================================
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  taskToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('Work');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setDueDate(taskToEdit.dueDate);
      setEstimatedMinutes(taskToEdit.estimatedMinutes || 30);
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Work');
      setDueDate(new Date().toISOString().split('T')[0]);
      setEstimatedMinutes(30);
      setSubtasks([]);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: Date.now().toString(), title: newSubtaskTitle.trim(), completed: false },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: taskToEdit?.id,
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      status: taskToEdit?.status || 'todo',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      estimatedMinutes: Number(estimatedMinutes) || 30,
      subtasks,
      pinned: taskToEdit?.pinned || false,
      tags: taskToEdit?.tags || [],
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button className="btn-icon-toggle" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Add details, notes, or instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="low">🔵 Low</option>
                <option value="medium">🟣 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                <option value="Work">Work</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Est. Time (minutes)</label>
              <input
                type="number"
                className="form-input"
                min={5}
                max={480}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Subtasks Checklist</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add subtask step..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={handleAddSubtask}
                style={{ padding: '0 16px' }}
              >
                <Plus size={16} />
              </button>
            </div>

            {subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-input)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '13px',
                    }}
                  >
                    <span>{st.title}</span>
                    <button
                      type="button"
                      className="action-btn"
                      onClick={() => handleRemoveSubtask(st.id)}
                    >
                      <Trash2 size={14} color="var(--accent-rose)" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 11. MAIN DASHBOARD CONTAINER
// ==========================================
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design Modern Glassmorphism Dashboard UI',
    description: 'Create high-fidelity interactive wireframes for the new task management web app.',
    priority: 'urgent',
    category: 'Design',
    status: 'in_progress',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    estimatedMinutes: 120,
    pinned: true,
    tags: ['UI/UX', 'Figma', 'DarkTheme'],
    subtasks: [
      { id: '1-1', title: 'Define color tokens & HSL variables', completed: true },
      { id: '1-2', title: 'Create interactive prototype components', completed: false },
      { id: '1-3', title: 'Review responsive breakpoints', completed: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Integrate Material-UI & Chart.js Analytics',
    description: 'Connect productivity metrics widgets with live task completion data.',
    priority: 'high',
    category: 'Development',
    status: 'todo',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    estimatedMinutes: 90,
    pinned: true,
    tags: ['React', 'TypeScript', 'MUI'],
    subtasks: [
      { id: '2-1', title: 'Setup Chart.js canvas provider', completed: true },
      { id: '2-2', title: 'Format weekly trend dataset', completed: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Prepare Quarterly Product Roadmap Presentation',
    description: 'Gather Q3 metrics and compile key feature milestones for team alignment.',
    priority: 'medium',
    category: 'Work',
    status: 'completed',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 60,
    pinned: false,
    tags: ['Planning', 'Executive'],
    subtasks: [
      { id: '3-1', title: 'Collect user retention stats', completed: true },
      { id: '3-2', title: 'Draft presentation slides', completed: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Daily Fitness & Hydration Routine',
    description: '30 minutes cardio session and track daily intake.',
    priority: 'low',
    category: 'Health',
    status: 'completed',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 30,
    pinned: false,
    tags: ['Wellness', 'Habits'],
    subtasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Review Monthly Budget & Investments',
    description: 'Audit personal expenses and update portfolio balance sheet.',
    priority: 'medium',
    category: 'Finance',
    status: 'todo',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    estimatedMinutes: 45,
    pinned: false,
    tags: ['Budget', 'Personal'],
    subtasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface DashboardProps {
  user?: User | null;
  onLogout?: () => void;
  onUpdateUser?: (updatedUser: User) => void;
  initialSection?: NavSection;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpdateUser, initialSection }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('listify_tasks') || localStorage.getItem('taskpulse_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activeSection, setActiveSection] = useState<NavSection>(() => {
    if (initialSection) return initialSection;
    if (location.pathname.includes('/tasks')) return 'tasks';
    if (location.pathname.includes('/analytics')) return 'analytics';
    if (location.pathname.includes('/settings')) return 'settings';
    return 'dashboard';
  });

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  const handleSelectSection = (section: NavSection) => {
    setActiveSection(section);
    if (section === 'tasks') {
      navigate('/tasks');
    } else if (section === 'dashboard') {
      navigate('/dashboard');
    }
  };
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('listify_theme') || localStorage.getItem('taskpulse_theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [filter, setFilter] = useState<FilterState>({
    search: '',
    category: 'All',
    priority: 'All',
    status: 'All',
    viewMode: 'grid',
    sortBy: 'priority',
  });

  useEffect(() => {
    localStorage.setItem('listify_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const fetchBackendTasks = async () => {
      try {
        const remoteTasks = await api.getAllTasks();
        if (remoteTasks && Array.isArray(remoteTasks)) {
          setTasks(remoteTasks);
        }
      } catch (err) {
        console.warn('Could not fetch backend tasks, using local cache:', err);
      }
    };
    fetchBackendTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem('listify_theme', darkMode ? 'dark' : 'light');
    if (!darkMode) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [darkMode]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats: DashboardStats = {
    total: totalTasks,
    completed: completedTasks,
    inProgress: inProgressTasks,
    urgent: urgentTasks,
    completionPercentage,
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = new Date().toISOString();

    if (taskData.id) {
      setTasks(
        tasks.map((t) =>
          t.id === taskData.id
            ? { ...t, ...taskData, updatedAt: now }
            : t
        )
      );
      try {
        await api.updateTask(taskData.id, taskData);
      } catch (err) {
        console.warn('Failed to update task on backend:', err);
      }
    } else {
      try {
        const createdTask = await api.createTask(taskData);
        setTasks([createdTask, ...tasks]);
      } catch (err) {
        console.warn('Failed to create task on backend, creating locally:', err);
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: now,
          updatedAt: now,
        };
        setTasks([newTask, ...tasks]);
      }
    }
    setTaskToEdit(null);
  };

  const handleToggleComplete = async (id: string) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const newStatus = targetTask.status === 'completed' ? 'todo' : 'completed';
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    try {
      await api.updateTask(id, { status: newStatus });
    } catch (err) {
      console.warn('Failed to toggle status on backend:', err);
    }
  };

  const handleTogglePin = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t))
    );
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    try {
      await api.deleteTask(id);
    } catch (err) {
      console.warn('Failed to delete task on backend:', err);
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const handleOpenNewTaskModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditTaskModal = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleUpdateFilter = (updates: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...updates }));
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesTag = task.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesCat = task.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesTag && !matchesCat) return false;
      }

      if (filter.category !== 'All' && task.category !== filter.category) {
        return false;
      }

      if (filter.priority !== 'All' && task.priority !== filter.priority) {
        return false;
      }

      if (filter.status !== 'All' && task.status !== filter.status) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filter.sortBy === 'priority') {
        const pMap = { urgent: 4, high: 3, medium: 2, low: 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      if (filter.sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (filter.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (filter.sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  return (
    <div className={`dashboard-container ${!darkMode ? 'light-theme' : ''}`}>
      <style>{DASHBOARD_STYLES}</style>

      {/* Animated gradient orbs background */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="bg-orb bg-orb-4" />
      </div>

      <Sidebar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        totalCount={totalTasks}
        completedCount={completedTasks}
        user={user}
        onLogout={onLogout}
      />

      <main className="dashboard-main">
        <Header
          searchTerm={filter.search}
          onSearchChange={(value) => handleUpdateFilter({ search: value })}
          onOpenNewTaskModal={handleOpenNewTaskModal}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode(!darkMode)}
        />

        <div className="dashboard-content">
          {activeSection === 'settings' ? (
            <SettingsComponent
              user={user}
              onUpdateUser={onUpdateUser}
              darkMode={darkMode}
              onToggleTheme={() => setDarkMode(!darkMode)}
              filter={filter}
              onUpdateFilter={handleUpdateFilter}
              onLogout={onLogout}
            />
          ) : activeSection === 'analytics' ? (
            <AnalyticsComponent tasks={tasks} />
          ) : activeSection === 'tasks' ? (
            /* MY TASKS ONLY REFERS TO TASKS.TSX FILE */
            <TasksComponent
              tasks={tasks}
              filteredTasks={filteredTasks}
              totalTasks={totalTasks}
              filter={filter}
              onUpdateFilter={handleUpdateFilter}
              onToggleComplete={handleToggleComplete}
              onTogglePin={handleTogglePin}
              onEditTask={handleOpenEditTaskModal}
              onDeleteTask={handleDeleteTask}
              onToggleSubtask={handleToggleSubtask}
              onOpenNewTaskModal={handleOpenNewTaskModal}
            />
          ) : (
            /* EXECUTIVE DASHBOARD OVERVIEW PAGE */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Welcome Banner */}
              <div className="welcome-banner">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={22} color="var(--accent-purple)" />
                    <h1 className="welcome-title">Good Afternoon, {user?.name ? user.name.split(' ')[0] : 'Bishal'}!</h1>
                  </div>
                  <p className="welcome-subtitle">
                    You've completed <strong style={{ color: 'var(--accent-emerald)' }}>{completedTasks} of {totalTasks}</strong> tasks. You are on track to achieve your weekly goal!
                  </p>
                </div>

                <div className="welcome-stats">
                  <div className="progress-circle-wrapper">
                    <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '15px', color: 'var(--accent-purple)' }}>
                      {completedTasks} PTS
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Productivity Score
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      1 completed task = 1 point
                    </div>
                  </div>
                </div>
              </div>

              {/* Workspace Stats Overview Cards */}
              <StatsCards stats={stats} />

              {/* Dashboard Charts & Category Breakdown Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <ProductivityChart tasks={tasks} />
                <CategoryProgress tasks={tasks} />
              </div>

              {/* All Tasks Section Below on Dashboard (Like Before) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.4px', margin: 0 }}>
                    Active Tasks & Roadmap
                  </h2>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Showing {filteredTasks.length} of {totalTasks} tasks
                  </span>
                </div>

                <TaskFilter filter={filter} onUpdateFilter={handleUpdateFilter} />

                <TaskList
                  tasks={filteredTasks}
                  viewMode={filter.viewMode}
                  onToggleComplete={handleToggleComplete}
                  onTogglePin={handleTogglePin}
                  onEditTask={handleOpenEditTaskModal}
                  onDeleteTask={handleDeleteTask}
                  onToggleSubtask={handleToggleSubtask}
                  onOpenNewTaskModal={handleOpenNewTaskModal}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSaveTask={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default Dashboard;
