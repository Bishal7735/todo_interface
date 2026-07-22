import React, { useState } from 'react';
import type { User, FilterState, ViewMode, SortBy } from '../types/todo';
import {
  User as UserIcon,
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
  Moon,
  Sun,
  LayoutGrid,
  List,
  ArrowUpDown,
  Bell,
  Trash2,
  LogOut,
  CheckCircle2,
  Sparkles,
  Sliders
} from 'lucide-react';

interface SettingsProps {
  user?: User | null;
  onUpdateUser?: (updatedUser: User) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  filter: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onLogout?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  user,
  onUpdateUser,
  darkMode,
  onToggleTheme,
  filter,
  onUpdateFilter,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'account'>('profile');

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'Product Designer');
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '');
  const [avatarInitials, setAvatarInitials] = useState(user?.avatarInitials || '');

  // Notifications toggle state
  const [notifications, setNotifications] = useState(true);

  // Status Feedback
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setSaveMessage('Error: Name and Email cannot be empty.');
      return;
    }

    const computedInitials =
      avatarInitials.trim() ||
      name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() ||
      'US';

    const updatedUser: User = {
      id: user?.id || Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      mobileNumber: mobileNumber.trim(),
      avatarInitials: computedInitials,
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setSaveMessage('Profile information saved successfully!');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear local cache? Your tasks will be refreshed from the server.')) {
      localStorage.removeItem('listify_tasks');
      window.location.reload();
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={24} color="var(--accent-purple)" />
            <span>Workspace & Profile Settings</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage your personal profile details, account preferences, and dashboard display options.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-input)',
            padding: '4px',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
            gap: '4px',
            flexWrap: 'wrap',
            maxWidth: '100%',
          }}
        >
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '10px',
              background: activeTab === 'profile' ? 'var(--grad-primary)' : 'transparent',
              color: activeTab === 'profile' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <UserIcon size={15} />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '10px',
              background: activeTab === 'preferences' ? 'var(--grad-primary)' : 'transparent',
              color: activeTab === 'preferences' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <Sliders size={15} />
            <span>Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '10px',
              background: activeTab === 'account' ? 'var(--grad-primary)' : 'transparent',
              color: activeTab === 'account' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <ShieldCheck size={15} />
            <span>Account</span>
          </button>
        </div>
      </div>

      {/* Save Alert Message */}
      {saveMessage && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '14px',
            background: saveMessage.startsWith('Error') ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            border: `1px solid ${saveMessage.startsWith('Error') ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            color: saveMessage.startsWith('Error') ? '#FB7185' : '#34D399',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* TAB 1: PROFILE EDITING FORM */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '720px' }}>
          {/* Avatar Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', background: 'var(--bg-input)', borderRadius: '18px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--grad-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 800,
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
              }}
            >
              {avatarInitials || (name ? name.substring(0, 2).toUpperCase() : 'US')}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{name || 'User Name'}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{email}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="styled-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bishal Roy"
                  style={{ width: '100%', padding: '8px 12px 8px 38px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }}
                />
                <UserIcon size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="styled-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  style={{ width: '100%', padding: '8px 12px 8px 38px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Mobile Number</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>(Read-only)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  className="styled-input"
                  value={mobileNumber || user?.mobileNumber || ''}
                  readOnly
                  disabled
                  placeholder="Not provided"
                  style={{ width: '100%', padding: '8px 12px 8px 38px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)', outline: 'none', fontSize: '13px', cursor: 'not-allowed', opacity: 0.75 }}
                />
                <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Avatar Initials</label>
            <input
              type="text"
              maxLength={3}
              value={avatarInitials}
              onChange={(e) => setAvatarInitials(e.target.value.toUpperCase())}
              placeholder="e.g. BR"
              style={{ width: '140px', padding: '12px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontWeight: 700, letterSpacing: '1px' }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '9px 20px',
              borderRadius: '12px',
              background: 'var(--grad-primary)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: 'fit-content',
              marginTop: '10px',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
              transition: 'transform 0.2s ease',
            }}
          >
            <Sparkles size={18} />
            <span>Update Profile Data</span>
          </button>
        </form>
      )}

      {/* TAB 2: WORKSPACE PREFERENCES */}
      {activeTab === 'preferences' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px' }}>
          {/* Theme Option */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px', background: 'var(--bg-input)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Interface Theme</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Switch between dark mode and light mode visual themes.</div>
            </div>

            <button
              onClick={onToggleTheme}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: darkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: darkMode ? '#A78BFA' : '#F59E0B',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {darkMode ? <Moon size={16} /> : <Sun size={16} />}
              <span>{darkMode ? 'Dark Theme' : 'Light Theme'}</span>
            </button>
          </div>

          {/* View Mode Option */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px', background: 'var(--bg-input)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Default Task View</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Choose your default layout for task cards.</div>
            </div>

            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.2)', padding: '4px', borderRadius: '12px' }}>
              <button
                onClick={() => onUpdateFilter({ viewMode: 'grid' })}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filter.viewMode === 'grid' ? 'var(--grad-primary)' : 'transparent',
                  color: filter.viewMode === 'grid' ? '#FFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                <LayoutGrid size={15} />
                <span>Grid</span>
              </button>

              <button
                onClick={() => onUpdateFilter({ viewMode: 'list' })}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filter.viewMode === 'list' ? 'var(--grad-primary)' : 'transparent',
                  color: filter.viewMode === 'list' ? '#FFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                <List size={15} />
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Sorting Option */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px', background: 'var(--bg-input)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Default Task Sorting</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Automatically order tasks by priority, date, or title.</div>
            </div>

            <select
              value={filter.sortBy}
              onChange={(e) => onUpdateFilter({ sortBy: e.target.value as SortBy })}
              style={{
                padding: '10px 14px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="priority">Priority First</option>
              <option value="dueDate">Due Date</option>
              <option value="createdAt">Creation Date</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* Notifications Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px', background: 'var(--bg-input)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Desktop Notifications</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Receive reminders for upcoming and overdue tasks.</div>
            </div>

            <button
              onClick={() => setNotifications(!notifications)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: notifications ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                color: notifications ? '#34D399' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Bell size={16} />
              <span>{notifications ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: ACCOUNT & DANGER ZONE */}
      {activeTab === 'account' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px' }}>
          <div style={{ padding: '20px', background: 'rgba(244, 63, 94, 0.06)', borderRadius: '18px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FB7185', marginBottom: '8px' }}>Cache & Data Reset</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Clear cached workspace data from your local browser storage and refresh from server.
            </p>
            <button
              onClick={handleClearCache}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                background: 'rgba(244, 63, 94, 0.12)',
                color: '#FB7185',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Trash2 size={16} />
              <span>Clear Local Task Cache</span>
            </button>
          </div>

          <div style={{ padding: '20px', background: 'var(--bg-input)', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Log Out</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Safely log out of your ListiFy workspace session on this device.
            </p>
            {onLogout && (
              <button
                onClick={onLogout}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(244, 63, 94, 0.35)',
                }}
              >
                <LogOut size={16} />
                <span>Log Out of Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
