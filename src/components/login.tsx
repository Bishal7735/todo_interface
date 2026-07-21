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
  Flame,
  Phone
} from 'lucide-react';
import type { User } from '../types/todo';
import { api } from '../services/api';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

/* ==========================================================================
   LISTIFY 2.0 PREMIUM DESIGN SYSTEM & AUTHENTICATION STYLES
   ========================================================================== */
const AUTH_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');

.auth-viewport {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #070913;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #F8FAFC;
  position: relative;
  overflow-x: hidden;
  padding: 32px 20px;
}

/* Ambient Glowing Aurora Background Orbs */
.auth-aurora-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
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
  max-width: 1160px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  position: relative;
  z-index: 10;
}

@media (max-width: 960px) {
  .auth-container {
    grid-template-columns: 1fr;
    max-width: 480px;
    gap: 32px;
  }
}

/* Left Hero Showcase Section */
.auth-hero {
  display: flex;
  flex-direction: column;
  gap: 28px;
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
  padding: 6px 14px;
  border-radius: 30px;
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #A78BFA;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  width: fit-content;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
}

.hero-title {
  font-family: 'Outfit', sans-serif;
  font-size: 46px;
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
  font-size: 16px;
  line-height: 1.6;
  color: #94A3B8;
  max-width: 480px;
}

.hero-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}

.hero-feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 14px 18px;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}

.hero-feature-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(139, 92, 246, 0.3);
  transform: translateX(6px);
}

.hero-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 12px;
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
  font-size: 14px;
  font-weight: 700;
  color: #F8FAFC;
}

.hero-feature-desc {
  font-size: 12px;
  color: #64748B;
}

/* Hero Live Preview Widget */
.hero-widget-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #0F172A;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  margin-left: -8px;
}

.avatar-stack-item:first-child {
  margin-left: 0;
}

.widget-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #F59E0B;
  font-size: 12px;
  font-weight: 700;
}

/* Glassmorphism Auth Card */
.auth-card-wrapper {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 44px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.65), 0 0 40px rgba(139, 92, 246, 0.2);
  position: relative;
  transition: all 0.35s ease;
}

.auth-card-wrapper:hover {
  border-color: rgba(139, 92, 246, 0.35);
  box-shadow: 0 40px 96px rgba(0, 0, 0, 0.75), 0 0 50px rgba(139, 92, 246, 0.3);
}

.auth-brand-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  margin-bottom: 32px;
}

.auth-logo-badge {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  box-shadow: 0 10px 28px rgba(99, 102, 241, 0.45);
}

.auth-brand-title {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #FFFFFF;
}

.auth-brand-subtitle {
  font-size: 13px;
  color: #94A3B8;
}

/* Custom Animated Tab Switcher */
.auth-segmented-control {
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  padding: 6px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 32px;
  position: relative;
}

.segmented-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  color: #94A3B8;
  font-size: 14px;
  font-weight: 600;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.segmented-btn.active {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  color: #FFFFFF;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.segmented-btn:hover:not(.active) {
  color: #F8FAFC;
  background: rgba(255, 255, 255, 0.04);
}

/* Form Controls */
.auth-form-body {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.input-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  padding: 14px 16px 14px 48px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: #F8FAFC;
  font-size: 14px;
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
  padding: 15px;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  border: none;
  border-radius: 16px;
  color: #FFFFFF;
  font-size: 15px;
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

.auth-card-footer {
  margin-top: 28px;
  text-align: center;
  font-size: 12px;
  color: #64748B;
}
`;

export const AuthPage: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="auth-viewport">
      <style>{AUTH_STYLES}</style>

      {/* Aurora Ambient Glow background */}
      <div className="auth-aurora-bg">
        <div className="aurora-orb aurora-1" />
        <div className="aurora-orb aurora-2" />
        <div className="aurora-orb aurora-3" />
      </div>

      {/* Subtle Grid Background Overlay */}
      <div className="auth-grid-overlay" />

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
            />
          ) : (
            <RegisterSection
              onLoginSuccess={onLoginSuccess}
              onSwitchToLogin={() => setMode('login')}
            />
          )}

          <div className="auth-card-footer">
            Protected by ListiFy 2.0 Security • Encrypted Session
          </div>
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
}

export const LoginSection: React.FC<LoginSectionProps> = ({
  onLoginSuccess,
  onSwitchToRegister,
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
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.login(email.trim(), password);
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

      onLoginSuccess(loggedUser);
    } catch (err: any) {
      console.warn('API Login failed:', err);
      setError(err.message || 'Login failed. Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form-body" onSubmit={handleSubmit}>
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
              alert('A password reset link has been sent to your email address!');
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
}

export const RegisterSection: React.FC<RegisterSectionProps> = ({
  onLoginSuccess,
  onSwitchToLogin,
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
      setError('Please fill in all required fields.');
      return;
    }
    if (!acceptTerms) {
      setError('You must accept the terms of service.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.register(fullName.trim(), email.trim(), password, mobileNumber.trim());
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

      onLoginSuccess(newUser);
    } catch (err: any) {
      console.warn('API Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
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
