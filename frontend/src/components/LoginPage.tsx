import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Lock, Mail, Users, FileText, ShieldCheck } from 'lucide-react';
import api from '../api/axios';
import { GOOGLE_CLIENT_ID } from '@/lib/google';
import { useLanguage } from '@/lib/useLanguage';
import GoogleSignInButton from '@/components/shared/GoogleSignInButton';
import { getDashboardPath, getSettingsPath, persistSession } from '@/lib/auth';
import { removeLandingStylesheets } from '@/components/LandingPage';
import logoImg from '@/assets/images/tunilinklogo.png';

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'TuniLink — Login';
    removeLandingStylesheets();
  }, []);

  const finishLogin = (data: { token: string; role: string; username: string; status?: string; profilePicture?: string | null }) => {
    persistSession(data);
    removeLandingStylesheets();
    if (data.status === 'PENDING') {
      sessionStorage.setItem('mustChangePassword', '1');
      window.location.assign(getSettingsPath(data.role));
      return;
    }
    window.location.assign(getDashboardPath(data.role));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      finishLogin(res.data);
    } catch (err: any) {
      const message = err?.response?.data?.message || t('login.invalid');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/google', { credential: credentialResponse.credential });
      finishLogin(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || t('login.googleError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Left panel — brand */}
      <div
        style={{
          flex: '0 0 42%',
          background: 'linear-gradient(145deg, #0f1f5c 0%, #1e3a8a 45%, #1d4ed8 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '52px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="login-left-panel"
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: '60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '80px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <img src={logoImg} alt="TuniLink" style={{ height: '120px', width: 'auto' }} />
          </Link>
        </div>

        {/* Center text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.12)', borderRadius: '20px', padding: '5px 14px', marginBottom: '20px' }}>
            <span style={{ color: '#93c5fd', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Tunisia → Canada</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 800, lineHeight: 1.2, margin: '0 0 16px' }}>
            The smart HR &amp; Finance platform
          </h1>
          <p style={{ color: '#bfdbfe', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
            Connect HR, Finance, Clients, and Employees — all in one secure, role-based workspace.
          </p>

          {/* Feature pills */}
          <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '10px' }}>
                <Users size={20} color="#93c5fd" />
              </div>
              <span style={{ color: '#dbeafe', fontSize: '14px', fontWeight: 500 }}>Multi-role access for every team member</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '10px' }}>
                <FileText size={20} color="#93c5fd" />
              </div>
              <span style={{ color: '#dbeafe', fontSize: '14px', fontWeight: 500 }}>Contracts, payroll & leave — fully managed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '10px' }}>
                <ShieldCheck size={20} color="#93c5fd" />
              </div>
              <span style={{ color: '#dbeafe', fontSize: '14px', fontWeight: 500 }}>Secure, role-based data visibility</span>
            </div>
          </div>
        </div>

        {/* Bottom badges */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['HR', 'Finance', 'Clients', 'Employees', 'Infrastructure'].map((role) => (
            <span key={role} style={{ background: 'rgba(255,255,255,0.1)', color: '#e0f2fe', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)' }}>
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <img src={logoImg} alt="TuniLink" style={{ height: '80px', width: 'auto' }} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              Welcome back
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Sign in to access your workspace
            </p>
          </div>

          {/* Google login */}
          {GOOGLE_CLIENT_ID ? (
            <div style={{ marginBottom: '24px' }}>
              <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={() => setError(t('login.googleError'))} />
            </div>
          ) : null}

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>or continue with email</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#ef4444', fontSize: '16px' }}>⚠</span>
              <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '42px',
                    paddingRight: '16px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b',
                    background: 'white',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#1d4ed8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '42px',
                    paddingRight: '48px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b',
                    background: 'white',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#1d4ed8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '6px',
                width: '100%',
                height: '50px',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(29,78,216,0.35)',
                letterSpacing: '0.2px',
              }}
              onMouseEnter={(e) => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(29,78,216,0.45)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={(e) => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(29,78,216,0.35)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; } }}
            >
              {loading ? (
                <>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to TuniLink
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '13px', color: '#94a3b8' }}>
            <Link to="/" style={{ color: '#1d4ed8', fontWeight: 600, textDecoration: 'none' }}>← Back to home</Link>
          </p>

          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#cbd5e1', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            © {new Date().getFullYear()} TuniLink · Tunisia–Canada Recruitment Platform
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .login-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
