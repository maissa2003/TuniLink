import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import '../assets/css/auth.css';
import { GOOGLE_CLIENT_ID } from '@/lib/google';
import { useLanguage } from '@/lib/useLanguage';
import GoogleSignInButton from '@/components/shared/GoogleSignInButton';
import { getDashboardPath, getSettingsPath, persistSession } from '@/lib/auth';
import { removeLandingStylesheets } from '@/components/LandingPage';

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

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
    try {
      const res = await api.post('/auth/login', { email, password });
      finishLogin(res.data);
    } catch (err: any) {
      console.error(err);
      const message = err?.response?.data?.message || t('login.invalid');
      setError(message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    try {
      const res = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      finishLogin(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || t('login.googleError'));
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-overlay"></div>
      <div className="container">
        <div className="row">
          <div className="col-md-5 col-md-offset-3">
            <div className="auth-card">
              <div className="section-heading auth-heading">
                <span>{t('login.welcome')} </span>
                <h2>{t('login.title')}</h2>
                <p style={{ marginTop: '0.5rem' }}>
                  <Link to="/" style={{ color: '#1E3A8A' }}>TuniLink</Link>
                </p>
              </div>
              <div className="google-login">
                {GOOGLE_CLIENT_ID ? (
                  <GoogleSignInButton
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      setError(t('login.googleError'));
                    }}
                  />
                ) : (
                  <p className="auth-error">{t('login.googleUnavailable')}</p>
                )}
              </div>
              <div className="auth-divider">
                <span>{t('login.or')}</span>
              </div>

              {error && <p className="auth-error">{error}</p>}

              <form onSubmit={handleSubmit} className="auth-form">
                <fieldset>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="auth-password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder={t('login.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </fieldset>
                <div className="blue-button auth-submit">
                  <button type="submit">{t('login.submit')}</button>
                </div>
                <p className="auth-switch">
                  {t('login.noAccount')} <Link to="/signup">{t('login.signup')}</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
