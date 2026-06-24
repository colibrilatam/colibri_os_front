'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import { useGuestLogin } from '@/hooks/useGuestLogin';
import NotificationPopup from '@/components/NotificationPopup';
import SelectRole from '@/components/login/SelectRole';
import GoogleButton from '@/components/login/GoogleButton';
import Login from '@/components/login/Login';
import Register from '@/components/login/Register';
import NftLink from '@/components/login/NftLink';
import Button from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { useLogin } from '@/hooks';

import { useNewProject } from '@/hooks/useNewProject';
import { useUserStore } from '@/lib/store';

export default function LoginRegisterPage() {
  const { t } = useTranslation('login');
  
  const setIsDemo = useUserStore((state) => state.setIsDemo);
  useEffect(() => {
    setIsDemo(false) 
  }, [])
  
  
  const [view, setView] = useState('login'); // login | selectRole | register | nftLink
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const router = useRouter();
  const { handleDemoLogin } = useLogin();

  const { handleGuestLogin } = useGuestLogin();

  // vistas
  const isLogin = view === 'login';
  const isSelectRole = view === 'selectRole';

  // cambio de rol
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setView('nftLink');
  };

  // google auth
  const handleGuestLoginClick = async () => {
    setLoading(true);
    const { data, error } = await handleDemoLogin('mentor');
    if (data) {
      setLoading(false);
      setPopupMessage(t('guestLoginMessage'));
      setIsPopupOpen(true);
    } else {
      console.log(data, error);
      alert(result);
      setLoading(false);
    }
  };

  // popup
  const handlePopupClose = () => {
    setIsPopupOpen(false);
    router.push('/home');
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-6">
      <Button
        className="absolute top-4 left-4"
        color="green"
        content={t('back')}
        redirect="https://colibrilatam.com/index.html"
      ></Button>

      {/* Popup */}
      {isPopupOpen && (
        <NotificationPopup
          message={popupMessage}
          isOpen={isPopupOpen}
          onClose={handlePopupClose}
        />
      )}

      <div
        className={`w-full ${isSelectRole ? 'max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl' : 'max-w-md'} mt-12 lg:mt-2 glass-effect-dark border-glass rounded-2xl p-6 sm:p-8 sm:p-10`}
      >
        <p className="text-overline text-center mb-2">{t('systemAccess')}</p>

        <h1 className="text-h1 text-center mb-2">
          {isLogin
            ? t('loginTitle')
            : isSelectRole
              ? t('selectRoleTitle')
              : t('registerTitle')}
        </h1>

        <p className="text-body--muted text-center mb-8">
          {isLogin
            ? t('loginSubtitle')
            : isSelectRole
              ? t('selectRoleSubtitle')
              : t('registerSubtitle')}
        </p>

        {/* Vistas */}
        {isSelectRole && <SelectRole onSelectRole={handleSelectRole} />}
        {view === 'nftLink' && (
          <NftLink
            role={selectedRole}
            onBack={() => setView('selectRole')}
            onSuccess={() => setView('register')}
          />
        )}

        {isLogin && (
          <>
            <Login onLoadingChange={setLoading} />
            <GoogleButton />
            <button
              onClick={handleGuestLoginClick}
              className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
            >
              {t('guestLogin')}
            </button>
          </>
        )}

        {view === 'register' && (
          <Register
            selectedRole={selectedRole}
            onSuccess={
              selectedRole === 'entrepreneur'
                ? () => router.push('/proyecto')
                : () => router.push('/user/nft')
            }
            onBack={() => setView('selectRole')}
            onLoadingChange={setLoading}
          />
        )}

        <p className="text-center text-body--muted mt-6">
          {isLogin ? t('noAccount') : t('hasAccount')}{' '}
          <button
            onClick={() => setView(isLogin ? 'selectRole' : 'login')}
            className="text-[var(--text-link)] font-semibold cursor-pointer"
          >
            {isLogin ? t('registerLink') : t('loginLink')}
          </button>
        </p>
      </div>
    </div>
  );
}
