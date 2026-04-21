'use client';
import { useState } from 'react';
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

export default function LoginRegisterPage() {
  const [view, setView] = useState('login'); // login | selectRole | register | nftLink
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const router = useRouter();

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
  const handleGuestLoginClick = () => {
    const result = handleGuestLogin();
    if (result.success) {
      setPopupMessage('¡Iniciaste sesión como invitado! Tu acceso será limitado.');
      setIsPopupOpen(true);
    } else {
      alert(result.error);
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
      <Button className="absolute top-4 left-4" color='green' content="Volver" redirect="home"></Button>

      {/* Popup */}
      {isPopupOpen && (
        <NotificationPopup
          message={popupMessage}
          isOpen={isPopupOpen}
          onClose={handlePopupClose}
        />
      )}

      <div
        className={`w-full ${isSelectRole ? 'max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl' : 'max-w-md'} glass-effect-dark border-glass rounded-2xl p-6 sm:p-8 sm:p-10`}
      >
        <p className="text-overline text-center mb-2">Acceso al sistema</p>

        <h1 className="text-h1 text-center mb-2">
          {isLogin ? 'Iniciar sesión' : isSelectRole ? 'Elegir rol' : 'Crear cuenta'}
        </h1>

        <p className="text-body--muted text-center mb-8">
          {isLogin
            ? 'Ingresá a Colibrí OS'
            : isSelectRole
              ? 'Elegí cómo querés participar'
              : 'Elige tu rol, verifica tu NFT y entra al panel del Reputation Lab'}
        </p>

        {/* Vistas */}
        {isSelectRole && <SelectRole onSelectRole={handleSelectRole} />}
        {view === 'nftLink' && <NftLink role={selectedRole} onBack={() => setView('selectRole')} onSuccess={() => setView('register')}/>}
       
        {isLogin && (
          <>
            <Login onLoadingChange={setLoading} />
            <GoogleButton />
            <button
              onClick={handleGuestLoginClick}
              className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
            >
              Entrar como invitado
            </button>
          </>
        )}

        {view === 'register' && (
          <Register
            selectedRole={selectedRole}
            onSuccess={selectedRole === 'emprendedor' ? () => router.push('/proyecto') : () => router.push('/home')}
            onBack={() => setView('selectRole')}
            onLoadingChange={setLoading}
          />
        )}

        <p className="text-center text-body--muted mt-6">
          {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button
            onClick={() => setView(isLogin ? 'selectRole' : 'login')}
            className="text-[var(--text-link)] font-semibold cursor-pointer"
          >
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
