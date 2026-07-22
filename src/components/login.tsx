import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Zap,
  TrendingUp,
  Phone,
  X
} from 'lucide-react';
import type { User } from '../types/todo';
import { login, register } from '../service/auth';
import SoftAurora from './SoftAurora';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

/* ==========================================================================
   LISTIFY 2.0 PREMIUM DESIGN SYSTEM & AUTHENTICATION STYLES
   ========================================================================== */
const AUTH_STYLES = `
.auth-viewport {
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000 !important;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #F8FAFC;
  position: relative;
  overflow: hidden;
  padding: 16px 20px;
}

/* Ambient Glowing Aurora Background Orbs */
.auth-aurora-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  opacity: 0.15;
}

.aurora-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  opacity: 0.38;
  animation: floatAurora 22s ease-in-out infinite alternate;
}

.aurora-1 {
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, #8B5CF6 0%, #4F46E5 100%);
  top: -15%;
  left: -10%;
}

.aurora-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #06B6D4 0%, #2563EB 100%);
  bottom: -20%;
  right: -10%;
  animation-delay: -8s;
}

.aurora-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #F43F5E 0%, #7C3AED 100%);
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -15s;
}

@keyframes floatAurora {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 40px) scale(1.12); }
  100% { transform: translate(-40px, 60px) scale(0.92); }
}

/* Geometric Grid Overlay Pattern */
.auth-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
  pointer-events: none;
  z-index: 1;
}

/* Split Screen Layout Container */
.auth-container {
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
  align-items: center;
  position: relative;
  z-index: 10;
  max-height: calc(100vh - 32px);
}

@media (max-width: 960px) {
  .auth-container {
    grid-template-columns: 1fr;
    max-width: 460px;
    gap: 24px;
  }
}

/* Left Hero Showcase Section */
.auth-hero {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 960px) {
  .auth-hero {
    display: none;
  }
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: 30px;
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #A78BFA;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  width: fit-content;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
}

.hero-title {
  font-family: 'Outfit', sans-serif;
  font-size: 36px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -1px;
  color: #FFFFFF;
}

.hero-title-gradient {
  background: linear-gradient(135deg, #A78BFA 0%, #38BDF8 50%, #34D399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 14px;
  line-height: 1.5;
  color: #94A3B8;
  max-width: 460px;
}

.hero-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

.hero-feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 14px;
  border-radius: 12px;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}

.hero-feature-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(139, 92, 246, 0.3);
  transform: translateX(6px);
}

.hero-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  flex-shrink: 0;
}

.hero-feature-text {
  display: flex;
  flex-direction: column;
}

.hero-feature-title {
  font-size: 13px;
  font-weight: 700;
  color: #F8FAFC;
}

.hero-feature-desc {
  font-size: 11px;
  color: #64748B;
}

/* Hero Live Preview Widget */
.hero-widget-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}

.widget-user-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-stack {
  display: flex;
  align-items: center;
}

.avatar-stack-item {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #0F172A;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  margin-left: -6px;
}

.avatar-stack-item:first-child {
  margin-left: 0;
}

.widget-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #F59E0B;
  font-size: 11px;
  font-weight: 700;
}

/* Glassmorphism Auth Card */
.auth-card-wrapper {
  background: rgba(10, 15, 26, 0.85);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 24px 32px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.15);
  position: relative;
  transition: all 0.35s ease;
}

.auth-card-wrapper:hover {
  border-color: rgba(139, 92, 246, 0.35);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(139, 92, 246, 0.25);
}

.auth-brand-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  margin-bottom: 16px;
}

.auth-logo-badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.auth-brand-title {
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #FFFFFF;
}

.auth-brand-subtitle {
  font-size: 12px;
  color: #94A3B8;
}

/* Custom Animated Tab Switcher */
.auth-segmented-control {
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 16px;
  position: relative;
}

.segmented-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: #94A3B8;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.segmented-btn.active {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  color: #FFFFFF;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
}

.segmented-btn:hover:not(.active) {
  color: #F8FAFC;
  background: rgba(255, 255, 255, 0.04);
}

/* Form Controls */
.auth-form-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-field-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-box-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #64748B;
  pointer-events: none;
  transition: color 0.25s ease;
}

.styled-input {
  width: 100%;
  padding: 10px 14px 10px 42px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: #F8FAFC;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.styled-input:focus {
  border-color: #8B5CF6;
  background: rgba(15, 23, 42, 0.95);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
}

.input-box-wrapper:focus-within .input-icon {
  color: #A78BFA;
}

.pwd-toggle-btn {
  position: absolute;
  right: 16px;
  background: transparent;
  border: none;
  color: #64748B;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.pwd-toggle-btn:hover {
  color: #F8FAFC;
}

.form-options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.custom-checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #94A3B8;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox {
  accent-color: #8B5CF6;
  width: 17px;
  height: 17px;
  border-radius: 5px;
  cursor: pointer;
}

.link-highlight {
  color: #38BDF8;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.link-highlight:hover {
  color: #7DD3FC;
  text-decoration: underline;
}

/* Submit & Social Buttons */
.submit-btn-primary {
  width: 100%;
  padding: 11px;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  border: none;
  border-radius: 14px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 10px 28px rgba(99, 102, 241, 0.4);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(139, 92, 246, 0.5);
  filter: brightness(1.08);
}

.submit-btn-primary:active {
  transform: translateY(0);
}

.quick-demo-btn {
  width: 100%;
  padding: 12px;
  background: rgba(6, 182, 212, 0.06);
  border: 1px dashed rgba(6, 182, 212, 0.3);
  border-radius: 16px;
  color: #38BDF8;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;
}

.quick-demo-btn:hover {
  background: rgba(6, 182, 212, 0.14);
  border-color: #06B6D4;
  color: #22D3EE;
  transform: translateY(-1px);
}

.divider-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
}

.divider-line::before,
.divider-line::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.social-btns-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.social-btn {
  padding: 11px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  color: #CBD5E1;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.18);
  color: #FFFFFF;
}

.error-alert-box {
  background: rgba(244, 63, 94, 0.12);
  border: 1px solid rgba(244, 63, 94, 0.35);
  color: #FB7185;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: shakeAlert 0.3s ease;
}

@keyframes shakeAlert {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.auth-toast-container {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
  width: auto;
  max-width: calc(100vw - 32px);
}

.auth-toast-item {
  pointer-events: auto;
  min-width: 280px;
  max-width: 380px;
  padding: 14px 18px;
  border-radius: 16px;
  background: rgba(16, 185, 129, 0.18);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(52, 211, 153, 0.5);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: #ECFDF5;
}

.auth-toast-item.error {
  background: rgba(244, 63, 94, 0.18);
  border: 1px solid rgba(244, 63, 94, 0.5);
  box-shadow: 0 10px 25px rgba(244, 63, 94, 0.25);
  color: #FFE4E6;
}

.auth-toast-item.info {
  background: rgba(6, 182, 212, 0.18);
  border: 1px solid rgba(6, 182, 212, 0.5);
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.25);
  color: #E0F2FE;
}

@media (max-width: 600px) {
  .auth-toast-container {
    bottom: 16px;
    right: 16px;
    left: 16px;
  }
  .auth-toast-item {
    min-width: unset;
    width: 100%;
    max-width: 100%;
  }
}
`;

export interface AuthToast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const AuthPage: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [toasts, setToasts] = useState<AuthToast[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: AuthToast = { id: Date.now().toString() + Math.random().toString(), title, message, type };
    setToasts((prev) => [...prev.slice(-3), newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="auth-viewport">
      <style>{AUTH_STYLES}</style>

      {/* Soft Aurora WebGL Ambient Glow background */}
      <SoftAurora
        speed={0.6}
        scale={1.5}
        brightness={1}
        color1="#f7f7f7"
        color2="#e100ff"
        noiseFrequency={2.5}
        noiseAmplitude={4}
        bandHeight={0.5}
        bandSpread={1}
        octaveDecay={0.01}
        layerOffset={0}
        colorSpeed={1}
        enableMouseInteraction
        mouseInfluence={0.25}
      />

      {/* Subtle Grid Background Overlay */}
      <div className="auth-grid-overlay" />

      {/* Light Green Landing Page Toast Notifications */}
      <div className="auth-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`auth-toast-item ${toast.type}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: toast.type === 'error' ? 'rgba(244, 63, 94, 0.25)' : toast.type === 'info' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(52, 211, 153, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {toast.type === 'error' ? <AlertCircle size={16} color="#FB7185" /> : <CheckCircle2 size={16} color="#34D399" />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{toast.title}</span>
                <span style={{ fontSize: '11px', opacity: 0.9 }}>{toast.message}</span>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'transparent', border: 'none', color: 'currentColor', opacity: 0.7, cursor: 'pointer', padding: '2px' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="auth-container">
        {/* Left Hero Section */}
        <div className="auth-hero">
          <div className="hero-pill">
            <Sparkles size={14} />
            <span>ListiFy 2.0 Workspace Hub</span>
          </div>

          <h1 className="hero-title">
            Master Your Tasks with <span className="hero-title-gradient">Intelligent Focus</span>
          </h1>

          <p className="hero-subtitle">
            Experience next-generation task management with automated analytics, focus timers, and effortless team collaboration.
          </p>

          <div className="hero-features">
            <div className="hero-feature-item">
              <div className="hero-icon-box" style={{ background: 'var(--grad-primary, linear-gradient(135deg, #6366F1, #8B5CF6))' }}>
                <Zap size={20} />
              </div>
              <div className="hero-feature-text">
                <span className="hero-feature-title">Real-Time Productivity Insights</span>
                <span className="hero-feature-desc">Track completion velocity & focus trends automatically.</span>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="hero-icon-box" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)' }}>
                <TrendingUp size={20} />
              </div>
              <div className="hero-feature-text">
                <span className="hero-feature-title">Smart Priority Matrix</span>
                <span className="hero-feature-desc">Organize urgent tasks and eliminate bottlenecks effortlessly.</span>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="hero-icon-box" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                <ShieldCheck size={20} />
              </div>
              <div className="hero-feature-text">
                <span className="hero-feature-title">Enterprise Security</span>
                <span className="hero-feature-desc">Encrypted local workspace session storage and protection.</span>
              </div>
            </div>
          </div>

          {/* Hero Widget Preview */}
          <div className="hero-widget-card">
            <div className="widget-user-group">
              <div className="avatar-stack">
                <div className="avatar-stack-item">BR</div>
                <div className="avatar-stack-item" style={{ background: 'linear-gradient(135deg, #06B6D4, #3B82F6)' }}>AM</div>
                <div className="avatar-stack-item" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>SK</div>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#CBD5E1' }}>
                Joined by <strong style={{ color: '#FFFFFF' }}>12,000+</strong> creators
              </div>
            </div>
          </div>
        </div>

        {/* Right Glass Auth Card */}
        <div className="auth-card-wrapper">
          {/* Header */}
          <div className="auth-brand-header">
            <div className="auth-logo-badge">
              <Sparkles size={28} />
            </div>
            <h2 className="auth-brand-title">ListiFy 2.0</h2>
            <p className="auth-brand-subtitle">
              {mode === 'login'
                ? 'Welcome back! Sign in to access your workspace.'
                : 'Create your account to start managing tasks like a pro.'}
            </p>
          </div>

          {/* Segmented Control / Tab Switcher */}
          <div className="auth-segmented-control">
            <button
              className={`segmented-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              <ShieldCheck size={16} />
              <span>Sign In</span>
            </button>
            <button
              className={`segmented-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => setMode('register')}
            >
              <UserIcon size={16} />
              <span>Register</span>
            </button>
          </div>

          {/* Render Active View */}
          {mode === 'login' ? (
            <LoginSection
              onLoginSuccess={onLoginSuccess}
              onSwitchToRegister={() => setMode('register')}
              addToast={addToast}
            />
          ) : (
            <RegisterSection
              onLoginSuccess={onLoginSuccess}
              onSwitchToLogin={() => setMode('login')}
              addToast={addToast}
            />
          )}
        </div>
      </div>
    </div>
  );
};


/* ==========================================================================
   1. LOGIN COMPONENT
   ========================================================================== */
interface LoginSectionProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToRegister: () => void;
  addToast?: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export const LoginSection: React.FC<LoginSectionProps> = ({
  onLoginSuccess,
  onSwitchToRegister,
  addToast,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      const msg = 'Please enter both email and password.';
      setError(msg);
      addToast?.('⚠️ Missing Information', msg, 'error');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await login(email.trim(), password);
      const nameFromApi = res.user?.name || email.split('@')[0];
      const initials = nameFromApi
        .split(' ')
        .map((p) => p[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'US';

      const loggedUser: User = {
        id: Date.now().toString(),
        name: nameFromApi,
        email: email.trim(),
        role: res.user?.role || 'Product Designer',
        avatarInitials: initials,
      };

      addToast?.('🎉 Login Successful!', `Welcome back, ${nameFromApi}! Redirecting...`, 'success');
      setTimeout(() => {
        onLoginSuccess(loggedUser);
      }, 500);
    } catch (err: any) {
      console.warn('API Login failed:', err);
      const errMsg = err.message || 'Login failed. Incorrect email or password.';
      setError(errMsg);
      addToast?.('⚠️ Login Failed', errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form-body" onSubmit={handleSubmit} autoComplete="off">
      {error && (
        <div className="error-alert-box">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="input-field-group">
        <label className="field-label">Email Address</label>
        <div className="input-box-wrapper">
          <input
            type="email"
            className="styled-input"
            placeholder="name@example.com"
            autoComplete="off"
            name="email_no_autofill"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
          />
          <Mail size={18} className="input-icon" />
        </div>
      </div>

      <div className="input-field-group">
        <div className="field-label">
          <span>Password</span>
          <a
            href="#forgot"
            className="link-highlight"
            style={{ fontSize: '12px' }}
            onClick={(e) => {
              e.preventDefault();
              addToast?.('📧 Password Reset Sent', 'A password reset link has been sent to your email address.', 'info');
            }}
          >
            Forgot password?
          </a>
        </div>
        <div className="input-box-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            className="styled-input"
            placeholder="••••••••••••"
            autoComplete="new-password"
            name="password_no_autofill"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
          />
          <Lock size={18} className="input-icon" />
          <button
            type="button"
            className="pwd-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="form-options-row">
        <label className="custom-checkbox-container">
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Remember me on this device</span>
        </label>
      </div>

      <button type="submit" className="submit-btn-primary" disabled={loading}>
        <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
        <ArrowRight size={18} />
      </button>

      <div style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
        Don't have an account?{' '}
        <button
          type="button"
          className="link-highlight"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          onClick={onSwitchToRegister}
        >
          Register for free
        </button>
      </div>
    </form>
  );
};


/* ==========================================================================
   2. REGISTRATION COMPONENT
   ========================================================================== */
interface RegisterSectionProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
  addToast?: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export const RegisterSection: React.FC<RegisterSectionProps> = ({
  onLoginSuccess,
  onSwitchToLogin,
  addToast,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      const msg = 'Please fill in all required fields.';
      setError(msg);
      addToast?.('⚠️ Missing Required Fields', msg, 'error');
      return;
    }
    if (!acceptTerms) {
      const msg = 'You must accept the terms of service.';
      setError(msg);
      addToast?.('⚠️ Terms of Service', msg, 'error');
      return;
    }
    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setError(msg);
      addToast?.('⚠️ Weak Password', msg, 'error');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await register(fullName.trim(), email.trim(), password, mobileNumber.trim());
      const nameFromApi = res.user?.name || fullName.trim();
      const initials = nameFromApi
        .split(' ')
        .map((part) => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'US';

      const newUser: User = {
        id: Date.now().toString(),
        name: nameFromApi,
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
        role: res.user?.role || 'Product Designer',
        avatarInitials: initials,
      };

      addToast?.('✨ Account Created!', `Welcome to ListiFy 2.0, ${nameFromApi}!`, 'success');
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 500);
    } catch (err: any) {
      console.warn('API Registration failed:', err);
      const errMsg = err.message || 'Registration failed. Please try again.';
      setError(errMsg);
      addToast?.('⚠️ Registration Failed', errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form-body" onSubmit={handleSubmit} autoComplete="off">
      {error && (
        <div className="error-alert-box">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="input-field-group">
        <label className="field-label">Full Name</label>
        <div className="input-box-wrapper">
          <input
            type="text"
            className="styled-input"
            placeholder="e.g. Alex Morgan"
            autoComplete="off"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setError(null);
            }}
          />
          <UserIcon size={18} className="input-icon" />
        </div>
      </div>

      <div className="input-field-group">
        <label className="field-label">Email Address</label>
        <div className="input-box-wrapper">
          <input
            type="email"
            className="styled-input"
            placeholder="alex@company.com"
            autoComplete="off"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
          />
          <Mail size={18} className="input-icon" />
        </div>
      </div>

      <div className="input-field-group">
        <label className="field-label">Mobile Number</label>
        <div className="input-box-wrapper">
          <input
            type="tel"
            className="styled-input"
            placeholder="e.g. +91 98765 43210"
            autoComplete="off"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <Phone size={18} className="input-icon" />
        </div>
      </div>

      <div className="input-field-group">
        <label className="field-label">Password</label>
        <div className="input-box-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            className="styled-input"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
          />
          <Lock size={18} className="input-icon" />
          <button
            type="button"
            className="pwd-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="form-options-row">
        <label className="custom-checkbox-container">
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          <span style={{ fontSize: '12px' }}>
            I agree to the <a href="#terms" className="link-highlight">Terms of Service</a> & <a href="#privacy" className="link-highlight">Privacy Policy</a>
          </span>
        </label>
      </div>

      <button type="submit" className="submit-btn-primary" disabled={loading}>
        <span>{loading ? 'Creating Account...' : 'Create My Free Account'}</span>
        <CheckCircle2 size={18} />
      </button>

      <div style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
        Already have an account?{' '}
        <button
          type="button"
          className="link-highlight"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          onClick={onSwitchToLogin}
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export const Login = AuthPage;
export default AuthPage;
