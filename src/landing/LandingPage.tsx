import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Zap,
  BarChart3,
  ShieldCheck,
  FolderKanban,
  Star,
  MessageSquare,
  Send,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { Container, Chip } from '@mui/material';

const LiquidEther = lazy(() => import('./LiquidEther'));

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  initials: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Bishal Roy',
    role: 'Product Designer',
    rating: 5,
    comment: 'ListiFy 2.0 completely transformed how I organize my design sprint tasks. The focus analytics and glassmorphism interface are stunning!',
    date: '2 hours ago',
    initials: 'BR'
  },
  {
    id: 'rev-2',
    name: 'Alex Morgan',
    role: 'Senior Developer',
    rating: 5,
    comment: 'The priority matrix and instant streak tracker keep me aligned every day. Easily the sleekest productivity app I have used.',
    date: 'Yesterday',
    initials: 'AM'
  },
  {
    id: 'rev-3',
    name: 'Sophia Chen',
    role: 'Engineering Lead',
    rating: 5,
    comment: 'Subtasks checklist, fast local storage, and dark aesthetic make this my daily driver for managing multi-phase engineering tasks.',
    date: '3 days ago',
    initials: 'SC'
  },
  {
    id: 'rev-4',
    name: 'David K.',
    role: 'Startup Founder',
    rating: 5,
    comment: 'Extremely responsive, beautifully designed, and zero bloat. ListiFy 2.0 is the gold standard for modern task management.',
    date: '4 days ago',
    initials: 'DK'
  }
];

/* ==========================================================================
   LANDING PAGE STYLES (LISTIFY 2.0 DESIGN SYSTEM & GLASSMORPHISM)
   ========================================================================== */
const LANDING_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');

.landing-viewport {
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  background: #050713;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #F8FAFC;
  position: relative;
  overflow-x: hidden !important;
}

/* Ambient Background - Pure Black */
.landing-aurora-bg {
  display: none;
}

.landing-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.35;
  will-change: transform;
  transform: translateZ(0);
  pointer-events: none;
  animation: floatLandingOrb 25s ease-in-out infinite alternate;
}

.landing-orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #8B5CF6 0%, #4F46E5 100%);
  top: -10%;
  left: -10%;
}

.landing-orb-2 {
  width: 650px;
  height: 650px;
  background: radial-gradient(circle, #06B6D4 0%, #2563EB 100%);
  bottom: 10%;
  right: -10%;
  animation-delay: -10s;
}

.landing-orb-3 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #F43F5E 0%, #7C3AED 100%);
  top: 45%;
  left: 40%;
  animation-delay: -18s;
}

@keyframes floatLandingOrb {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(60px, 50px) scale(1.1); }
  100% { transform: translate(-50px, 70px) scale(0.9); }
}

/* Grid Overlay Pattern */
.landing-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(circle at center, black 45%, transparent 85%);
  -webkit-mask-image: radial-gradient(circle at center, black 45%, transparent 85%);
  pointer-events: none;
  z-index: 1;
}

/* Floating Aesthetic Glassmorphic Navbar */
.landing-navbar-wrapper {
  position: sticky;
  top: 16px;
  z-index: 100;
  padding: 0 16px;
  will-change: transform;
  transform: translateZ(0);
}

.landing-navbar {
  max-width: 1140px;
  margin: 0 auto;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(10, 14, 26, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 10px 20px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 92, 246, 0.15);
  transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
  will-change: transform;
}

.nav-content-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo-group {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-decoration: none;
}

.brand-logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.45);
  transition: transform 0.25s ease;
}

.brand-logo-group:hover .brand-logo-icon {
  transform: rotate(6deg) scale(1.05);
}

.brand-logo-title {
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #FFFFFF;
  background: linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links-list {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 4px;
}

@media (max-width: 768px) {
  .nav-links-list {
    display: none;
  }
}

.nav-link-item {
  color: #94A3B8;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.nav-link-item:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.08);
}

.nav-cta-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-nav-ghost {
  padding: 9px 18px;
  border-radius: 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #F8FAFC;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-nav-ghost:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.25);
}

.btn-nav-primary {
  padding: 10px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  border: none;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.35);
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-nav-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(139, 92, 246, 0.45);
}

/* Hero Section */
.hero-section {
  padding: 80px 0 60px 0;
  position: relative;
  z-index: 10;
}

.hero-flex-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

@media (max-width: 960px) {
  .hero-flex-grid {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 30px;
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #A78BFA;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}

.hero-main-title {
  font-family: 'Outfit', sans-serif;
  font-size: 54px;
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -1.2px;
  color: #FFFFFF;
  margin-bottom: 20px;
}

@media (max-width: 600px) {
  .hero-main-title {
    font-size: 38px;
  }
}

.title-gradient-text {
  background: linear-gradient(135deg, #A78BFA 0%, #38BDF8 50%, #34D399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtext {
  font-size: 18px;
  line-height: 1.6;
  color: #94A3B8;
  margin-bottom: 36px;
  max-width: 520px;
}

@media (max-width: 960px) {
  .hero-subtext {
    margin-left: auto;
    margin-right: auto;
  }
}

.hero-action-buttons {
  display: flex;
  align-items: center;
  gap: 18px;
}

@media (max-width: 960px) {
  .hero-action-buttons {
    justify-content: center;
  }
}

.btn-hero-cta {
  padding: 16px 32px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  border: none;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.4);
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-hero-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(139, 92, 246, 0.5);
  filter: brightness(1.08);
}

.btn-hero-secondary {
  padding: 16px 28px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #F8FAFC;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-hero-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.25);
}

/* Live Workspace Card Preview */
.landing-preview-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.4) 100%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 28px;
  padding: 32px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4), 0 0 50px rgba(139, 92, 246, 0.25);
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.3s ease;
}

.landing-preview-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 40px 96px rgba(0, 0, 0, 0.5), 0 0 60px rgba(139, 92, 246, 0.35);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 16px;
}

.preview-stat-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.preview-stat-box {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Feature Grid Section */
.features-section {
  padding: 80px 0;
  position: relative;
  z-index: 10;
}

.section-header-center {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 56px auto;
}

.section-title {
  font-family: 'Outfit', sans-serif;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: #FFFFFF;
  margin-bottom: 14px;
}

.section-desc {
  font-size: 16px;
  color: #94A3B8;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.feature-glass-card {
  background: rgba(15, 23, 42, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px 24px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease;
}

.feature-glass-card:hover {
  background: rgba(15, 23, 42, 0.45);
  border-color: rgba(139, 92, 246, 0.4);
  transform: translateY(-6px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4), 0 0 30px rgba(139, 92, 246, 0.25);
}

.feature-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  margin-bottom: 4px;
}

/* User Reviews Section */
.reviews-section {
  padding: 90px 0;
  position: relative;
  z-index: 10;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 50px;
}

.review-card {
  background: rgba(15, 23, 42, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 28px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  transition: all 0.3s ease;
}

.review-card:hover {
  background: rgba(15, 23, 42, 0.45);
  border-color: rgba(139, 92, 246, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 24px rgba(139, 92, 246, 0.2);
}

.review-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.review-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.review-name {
  font-size: 15px;
  font-weight: 700;
  color: #F8FAFC;
}

.review-role {
  font-size: 12px;
  color: #64748B;
}

.stars-rating-flex {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #F59E0B;
}

.review-comment-text {
  font-size: 14px;
  color: #CBD5E1;
  line-height: 1.6;
  font-style: italic;
}

/* Leave a Review Glass Form */
.add-review-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.4) 100%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 28px;
  padding: 36px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 600px) {
  .form-input-row {
    grid-template-columns: 1fr;
  }
}

.review-input {
  width: auto;
  padding: 13px 16px;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: #F8FAFC;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;
}

.review-input:focus {
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.interactive-star-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.btn-submit-review {
  padding: 14px 28px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  border: none;
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  align-self: flex-end;
}

.btn-submit-review:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(139, 92, 246, 0.45);
}

/* Comprehensive Footer */
.landing-footer-main {
  background: rgba(5, 8, 18, 0.45);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 70px 0 30px 0;
  position: relative;
  z-index: 10;
  font-size: 14px;
  color: #94A3B8;
}

.footer-grid-4col {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;
  margin-bottom: 50px;
}

@media (max-width: 960px) {
  .footer-grid-4col {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }
}

@media (max-width: 600px) {
  .footer-grid-4col {
    grid-template-columns: 1fr;
  }
}

.footer-col-title {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #F8FAFC;
  margin-bottom: 18px;
}

.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-link-anchor {
  color: #94A3B8;
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 13px;
}

.footer-link-anchor:hover {
  color: #A78BFA;
}

.newsletter-form {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.newsletter-input {
  flex: 1;
  padding: 10px 14px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #F8FAFC;
  font-size: 13px;
  outline: none;
}

.newsletter-input:focus {
  border-color: #8B5CF6;
}

.footer-bottom-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #64748B;
}

@media (max-width: 600px) {
  .footer-bottom-bar {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
`;

const LandingStyles = React.memo(() => <style>{LANDING_STYLES}</style>);

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const progressBarRef = React.useRef<HTMLDivElement>(null);

  // Reviews state with localStorage persistence
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('listify_user_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_REVIEWS;
      }
    }
    return INITIAL_REVIEWS;
  });
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('');
  const [starRating, setStarRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Scroll Progress Percentage via RAF & DOM Ref (Zero React re-renders on scroll)
  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0 && progressBarRef.current) {
            const current = (window.scrollY / totalHeight) * 100;
            progressBarRef.current.style.width = `${current}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewText.trim()) return;

    const initials = reviewerName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'US';

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      name: reviewerName.trim(),
      role: reviewerRole.trim() || 'Productivity User',
      rating: starRating,
      comment: reviewText.trim(),
      date: 'Just now',
      initials: initials
    };

    const updatedReviews = [newRev, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('listify_user_reviews', JSON.stringify(updatedReviews));

    setReviewerName('');
    setReviewerRole('');
    setReviewText('');
    setStarRating(5);
    setHoverRating(0);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <div className="landing-viewport">
      <LandingStyles />

      {/* Top Animated Scroll Progress Bar */}
      <div
        ref={progressBarRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: '0%',
          background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4, #F43F5E)',
          zIndex: 1000,
          willChange: 'width',
          boxShadow: '0 0 12px rgba(139, 92, 246, 0.9)',
          pointerEvents: 'none'
        }}
      />

      {/* Aurora Glow Mesh Background & Threads */}
      <div className="landing-aurora-bg">
        <div className="landing-orb landing-orb-1" />
        <div className="landing-orb landing-orb-2" />
        <div className="landing-orb landing-orb-3" />
      </div>

      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.85 }}>
        <Suspense fallback={null}>
          <LiquidEther
            mouseForce={20}
            cursorSize={100}
            isViscous
            viscous={30}
            iterationsViscous={14}
            iterationsPoisson={14}
            resolution={0.4}
            isBounce
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </Suspense>
      </div>

      {/* Navigation Header Wrapper */}
      <div className="landing-navbar-wrapper">
        <header className="landing-navbar">
          <div className="nav-content-flex">
            <a href="#hero" className="brand-logo-group">
              <div className="brand-logo-icon">
                <Sparkles size={22} />
              </div>
              <span className="brand-logo-title">ListiFy 2.0</span>
            </a>

            <ul className="nav-links-list">
              <li><a href="#features" className="nav-link-item">Features</a></li>
              <li><a href="#reviews" className="nav-link-item">User Reviews</a></li>
              <li><a href="#footer" className="nav-link-item">Resources</a></li>
            </ul>

            <div className="nav-cta-group">
              <button
                className="btn-nav-ghost"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button
                className="btn-nav-primary"
                onClick={() => navigate('/login')}
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="hero-section" id="hero">
        <Container maxWidth="lg">
          <div className="hero-flex-grid">
            <div>
              <div className="hero-badge">
                <Sparkles size={14} />
                <span>ListiFy 2.0 Release • Smart Workspace</span>
              </div>

              <h1 className="hero-main-title">
                Master Your Tasks with <span className="title-gradient-text">Intelligent Speed & Focus</span>
              </h1>

              <p className="hero-subtext">
                The next-generation productivity hub designed for high-performing teams and creators. Kanbans, focus timers, and priority analytics in one sleek dashboard.
              </p>

              <div className="hero-action-buttons">
                <button
                  className="btn-hero-cta"
                  onClick={() => navigate('/login')}
                >
                  <span>Launch Workspace</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  className="btn-hero-secondary"
                  onClick={() => navigate('/login')}
                >
                  Quick Demo Access
                </button>
              </div>
            </div>

            {/* Live Interactive Mockup Card */}
            <div className="landing-preview-card">
              <div className="preview-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600, marginLeft: '8px' }}>
                    Workspace Live Preview
                  </span>
                </div>
                <Chip
                  label="PRO ACTIVE"
                  size="small"
                  sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#A78BFA', fontWeight: 700, fontSize: '11px' }}
                />
              </div>

              <div className="preview-stat-row">
                <div className="preview-stat-box">
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>COMPLETED</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>84%</span>
                </div>
                <div className="preview-stat-box">
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>FOCUS TIME</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#38BDF8' }}>38h</span>
                </div>
                <div className="preview-stat-box">
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>STREAK</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#F59E0B' }}>7 Days 🔥</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>Active Kanban Roadmap</span>
                  <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>3/4 Completed</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #6366F1, #8B5CF6)' }} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Grid Section */}
      <section className="features-section" id="features">
        <Container maxWidth="lg">
          <div className="section-header-center">
            <h2 className="section-title">Built for Peak Performance</h2>
            <p className="section-desc">
              Everything you need to plan projects, manage daily todo lists, track focus hours, and hit your weekly deadlines.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-glass-card">
              <div className="feature-icon-wrapper" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                <FolderKanban size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Smart Kanban Workspace</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                Switch effortlessly between Grid and List views with pinned task priorities and custom tags.
              </p>
            </div>

            <div className="feature-glass-card">
              <div className="feature-icon-wrapper" style={{ background: 'linear-gradient(135deg, #06B6D4, #3B82F6)' }}>
                <BarChart3 size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Productivity Analytics</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                Interactive bar plots comparing completed tasks against focus hours to uncover your peak productivity day.
              </p>
            </div>

            <div className="feature-glass-card">
              <div className="feature-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Urgent Task Matrix</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                Highlight high-priority items and receive real-time notifications to eliminate project bottlenecks.
              </p>
            </div>

            <div className="feature-glass-card">
              <div className="feature-icon-wrapper" style={{ background: 'linear-gradient(135deg, #F43F5E, #E11D48)' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Encrypted Local Storage</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                Your data stays secure on your machine with offline state persistence and instant authentication.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* User Reviews Section (Replaced Pricing) */}
      <section className="reviews-section" id="reviews">
        <Container maxWidth="lg">
          <div className="section-header-center">
            <h2 className="section-title">Loved by Creators & Teams</h2>
            <p className="section-desc">
              See what users are saying about ListiFy 2.0 or submit your own feedback below!
            </p>
            <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center' }}>
              <Chip
                label={`${reviews.length} Verified User Reviews • 4.9 Rating`}
                size="small"
                sx={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontWeight: 700, border: '1px solid rgba(245, 158, 11, 0.3)' }}
              />
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="reviews-grid">
            {reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div>
                  <div className="review-header-flex" style={{ marginBottom: '14px' }}>
                    <div className="review-user-info">
                      <div className="review-avatar">{rev.initials}</div>
                      <div>
                        <div className="review-name">{rev.name}</div>
                        <div className="review-role">{rev.role}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>{rev.date}</span>
                  </div>

                  <div className="stars-rating-flex" style={{ marginBottom: '12px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        fill={i < rev.rating ? '#F59E0B' : 'none'}
                        color={i < rev.rating ? '#F59E0B' : '#475569'}
                      />
                    ))}
                  </div>

                  <p className="review-comment-text">"{rev.comment}"</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
                  <CheckCircle2 size={14} />
                  <span>Verified User</span>
                </div>
              </div>
            ))}
          </div>

          {/* Leave a Review Form */}
          <div className="add-review-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={22} color="#8B5CF6" />
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
                Leave Your Review
              </h3>
            </div>

            {submitSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} />
                <span>Thank you! Your review has been published below.</span>
              </div>
            )}

            <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-input-row">
                <input
                  type="text"
                  className="review-input"
                  placeholder="Your Full Name *"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="review-input"
                  placeholder="Your Role / Title (e.g. Designer, Developer)"
                  value={reviewerRole}
                  onChange={(e) => setReviewerRole(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#CBD5E1' }}>Your Rating:</span>
                <div className="interactive-star-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
                    >
                      <Star
                        size={22}
                        fill={star <= (hoverRating || starRating) ? '#F59E0B' : 'none'}
                        color={star <= (hoverRating || starRating) ? '#F59E0B' : '#475569'}
                      />
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '13px', color: '#F59E0B', fontWeight: 700 }}>
                  ({starRating} / 5 Stars)
                </span>
              </div>

              <textarea
                className="review-input"
                rows={3}
                placeholder="Share your feedback or experience with ListiFy 2.0... *"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />

              <button type="submit" className="btn-submit-review">
                <span>Post My Review</span>
                <Send size={16} />
              </button>
            </form>
          </div>
        </Container>
      </section>

      {/* Comprehensive Footer */}
      <footer className="landing-footer-main" id="footer">
        <Container maxWidth="lg">
          <div className="footer-grid-4col">
            {/* Col 1: Brand Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="brand-logo-group">
                <div className="brand-logo-icon">
                  <Sparkles size={24} />
                </div>
                <span className="brand-logo-title">ListiFy 2.0</span>
              </div>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Next-generation productivity and task workspace engineered for speed, focus analytics, and effortless project management.
              </p>
              <div style={{ display: 'flex', gap: '12px', color: '#A78BFA' }}>
                <Chip icon={<Flame size={14} color="#F59E0B" />} label="7 Days Streak Active" size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h4 className="footer-col-title">Navigation</h4>
              <ul className="footer-links-list">
                <li><a href="#hero" className="footer-link-anchor">Home Hero</a></li>
                <li><a href="#features" className="footer-link-anchor">Kanban Features</a></li>
                <li><a href="#reviews" className="footer-link-anchor">User Reviews</a></li>
                <li><button style={{ background: 'none', border: 'none', padding: 0, color: '#94A3B8', cursor: 'pointer', fontSize: '13px' }} onClick={() => navigate('/login')}>Sign In / Register</button></li>
              </ul>
            </div>

            {/* Col 3: Resources & System */}
            <div>
              <h4 className="footer-col-title">Resources</h4>
              <ul className="footer-links-list">
                <li><a href="#docs" className="footer-link-anchor" onClick={(e) => { e.preventDefault(); alert('ListiFy 2.0 Documentation is online!'); }}>Documentation</a></li>
                <li><a href="#privacy" className="footer-link-anchor">Privacy Policy</a></li>
                <li><a href="#terms" className="footer-link-anchor">Terms of Service</a></li>
                <li><span style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={13} /> Systems Operational</span></li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div>
              <h4 className="footer-col-title">Stay Updated</h4>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 10px 0' }}>
                Subscribe for weekly productivity tips and feature releases.
              </p>

              {subscribed ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} />
                  <span>Subscribed successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="newsletter-form">
                  <input
                    type="email"
                    className="newsletter-input"
                    placeholder="name@company.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-nav-primary" style={{ padding: '8px 14px', borderRadius: '10px' }}>
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <div>© {new Date().getFullYear()} ListiFy 2.0 • All rights reserved.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} color="#10B981" /> Encrypted Workspace</span>
              <span>•</span>
              <a href="#privacy" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy</a>
              <a href="#terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
