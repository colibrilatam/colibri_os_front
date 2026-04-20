'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import {
  validatePassword,
  getPasswordErrors,
  validateEmail,
} from '@/lib/validations';
import { useRegister } from '@/hooks/useRegister';
import { useLogin } from '@/hooks/useLogin';
import { useGuestLogin } from '@/hooks/useGuestLogin';
import NotificationPopup from '@/components/NotificationPopup';

export default function LoginRegisterPage() {
  const [view, setView] = useState('login'); // login | selectRole | register
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [currentStep, setCurrentStep] = useState(0);
  const [nftVerified, setNftVerified] = useState(false);
  const [verifyingNFT, setVerifyingNFT] = useState(false);

  const { handleRegister } = useRegister();
  const { handleLogin } = useLogin();
  const { handleGuestLogin } = useGuestLogin();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false,
  });

  const isLogin = view === 'login';
  //const isRegister = view === 'register';
  const isSelectRole = view === 'selectRole';
  const isNftFlow = view === 'nftFlow';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };
    if (isLogin) return;

    if (name === 'username') {
      newErrors.username =
        value.trim() === '' ? 'El nombre de usuario es requerido' : '';
    }

    if (name === 'email') {
      if (value.trim() === '') newErrors.email = 'El email es requerido';
      else if (!validateEmail(value))
        newErrors.email = 'El email no tiene un formato válido';
      else newErrors.email = '';
    }

    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordValidation(validation);

      if (value.trim() === '')
        newErrors.password = 'La contraseña es requerida';
      else if (!validation.isValid)
        newErrors.password = getPasswordErrors(validation).join(', ');
      else newErrors.password = '';

      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      } else if (formData.confirmPassword === value) {
        newErrors.confirmPassword = '';
      }
    }

    if (name === 'confirmPassword') {
      if (value.trim() === '')
        newErrors.confirmPassword = 'Confirmar contraseña es requerido';
      else if (value !== formData.password)
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      else newErrors.confirmPassword = '';
    }

    setErrors(newErrors);
  };

  const isFormValid = () => {
    if (isLogin) {
      return (
        formData.email && formData.password && !errors.email && !errors.password
      );
    } else {
      return (
        formData.username &&
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        !errors.username &&
        !errors.email &&
        !errors.password &&
        !errors.confirmPassword &&
        passwordValidation.isValid
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      setLoading(true);
      const result = await handleLogin(formData);
      setLoading(false);

      if (result.success) {
        alert('¡Has iniciado sesión correctamente! Bienvenido a Colibri OS');
        router.push('/home');
      } else {
        alert(result.error);
      }
      return;
    }

    // REGISTER
    if (!selectedRole) {
      return alert('Seleccioná un rol');
    }

    if (!isFormValid()) {
      return alert(
        'Por favor, corrige los errores en el formulario antes de continuar.',
      );
    }

    setLoading(true);

    const result = await handleRegister({
      ...formData,
      role: selectedRole,
    });

    setLoading(false);

    if (result.success) {
      alert('¡Te has registrado correctamente! Bienvenido a Colibri OS');
      setView('login');
    } else {
      alert(result.error);
    }
  };

  const handleGoogleClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  const handleGuestLoginClick = () => {
    const result = handleGuestLogin();
    if (result.success) {
      setPopupMessage(
        '¡Iniciaste sesión como invitado! Tu acceso será limitado.',
      );
      setIsPopupOpen(true);
    } else {
      alert(result.error);
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    router.push('/home');
  };

  if (loading) return <LoadingScreen />;

  //🔥 NUEVA VISTA: NFT FLOW

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6">
      {isPopupOpen && (
        <NotificationPopup
          message={popupMessage}
          isOpen={isPopupOpen}
          onClose={() => {
            setIsPopupOpen(false);
            router.push('/home');
          }}
        />
      )}

      <div
        className={`w-full ${isSelectRole ? 'max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl' : 'max-w-md'} glass-effect-dark border-glass rounded-2xl p-6 sm:p-8 sm:p-10`}
      >
        {!isNftFlow && (
          <>
            <p className="text-overline text-center mb-2">Acceso al sistema</p>

            <h1 className="text-h1 text-center mb-2">
              {isLogin ? 'Iniciar sesión' : 'Elegir rol'}
            </h1>

            <p className="text-body--muted text-center mb-8">
              {isLogin
                ? 'Ingresá a Colibrí OS'
                : 'Elegí cómo querés participar'}
            </p>
          </>
        )}

        {/* <p className="text-body--muted text-center mb-8">
          {isLogin
            ? 'Ingresá a Colibrí OS'
            : isSelectRole
              ? 'Elegí cómo querés participar'
              : 'Registrate para comenzar'}
        </p> */}
        {/* <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
          {[
            '1 Elige tu rol',
            '2 Verificamos tu NFT',
            '3 Completa tu ficha',
            '4 Entra al R Lab',
          ].map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;

            return (
              <div
                key={step}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition
          ${
            isActive || isCompleted
              ? 'bg-[var(--action-primary)] text-white'
              : 'bg-white/10 text-white/50'
          }`}
              >
                {step}
              </div>
            );
          })}
        </div> */}
        {/* ================= STEPS ================= */}
        {isNftFlow && (
          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            {[
              '1 Elige tu rol',
              '2 Verificamos tu NFT',
              '3 Completa tu ficha',
              '4 Entra al R Lab',
            ].map((step, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;

              return (
                <div
                  key={step}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition
                  ${
                    isActive || isCompleted
                      ? 'bg-[var(--action-primary)] text-white'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {step}
                </div>
              );
            })}
          </div>
        )}

        {/* ================= SELECT ROLE ================= */}
        {isSelectRole && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* EMPRENDEDOR */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:bg-white/10 transition">
              <div>
                <div className="text-3xl mb-4">🚀</div>
                <p className="text-h2 mb-2">Emprendedor</p>
                <p className="text-body--muted">
                  Construí tu proyecto con evidencia real.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedRole('emprendedor');
                  setView('nftFlow');
                  setCurrentStep(2);
                }}
                className="mt-6 py-3 rounded-lg bg-[var(--action-primary)] cursor-pointer"
              >
                Continuar como Emprendedor
              </button>
            </div>
            {/* MECENAS */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:bg-white/10 hover:scale-[1.02] transition-all duration-200">
              <div>
                <div className="text-3xl mb-4">🤝</div>{' '}
                <p className="text-h2 mb-2">Mecenas</p>{' '}
                <p className="text-body--muted mb-4">
                  Apoyá proyectos con impacto sin tomar participación.{' '}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedRole('mecenas');
                  setView('register');
                }}
                className="mt-6 w-full py-3 rounded-lg font-semibold bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] transition cursor-pointer"
              >
                {' '}
                Continuar como Mecenas{' '}
              </button>{' '}
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {isNftFlow && currentStep === 2 && (
          <div className="grid md:grid gap-6">
            {!nftVerified ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 flex flex-col items-center text-center backdrop-blur-md">
                {/* ICONO */}
                <div className="text-6xl mb-6 opacity-70">📁</div>

                {/* TITULO */}
                <h2 className="text-h2 mb-3">Verificamos tu NFT de acceso</h2>

                {/* DESCRIPCION */}
                <p className="text-body--muted max-w-md mb-8">
                  Esta es una simulación: no firmarás transacciones reales. Solo
                  recreamos el momento en que tu wallet es detectada por el
                  sistema.
                </p>

                {/* BOTON PRINCIPAL */}
                <button
                  onClick={() => {
                    setVerifyingNFT(true);
                    setTimeout(() => {
                      setVerifyingNFT(false);
                      setNftVerified(true);
                    }, 2000);
                  }}
                  className="w-full max-w-md py-3 rounded-xl font-semibold 
                bg-gradient-to-r from-[var(--action-primary)] to-teal-400 
                hover:opacity-90 transition cursor-pointer"
                >
                  Verificar NFT en mi wallet (demo)
                </button>

                {/* VOLVER */}
                <button
                  onClick={() => {
                    setView('selectRole');
                    setCurrentStep(1);
                  }}
                  className="mt-6 text-sm text-white/50 hover:text-white/70 transition cursor-pointer"
                >
                  ← Volver atrás
                </button>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 flex flex-col items-center text-center backdrop-blur-md">
                {/* NFT IMAGE + BADGE */}
                <div className="relative mb-4">
                  <img
                    src="/colibri.png"
                    className="w-28 h-28 object-contain rounded-2xl bg-white/10 p-2"
                  />
                  <div className="absolute -top-2 -right-2 text-xs px-2 py-1 rounded-full bg-green-500 text-white">
                    N1
                  </div>
                </div>

                {/* TITULO */}
                <h2 className="text-green-400 text-h2 mb-1">¡NFT Detectado!</h2>

                {/* SUBTITULO */}
                <p className="text-body font-medium">
                  Colibrí #001 · Semilla de Luz
                </p>

                {/* HASH */}
                <div className="mt-2 px-4 py-1 rounded-full bg-white/10 text-xs text-white/70">
                  0x71C9...1B9E79
                </div>

                {/* CARD INFO */}
                <div className="mt-6 w-full max-w-md rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400/20">
                      ❤️
                    </div>

                    <div>
                      <p className="text-sm text-white/70">Aliado Semilla</p>
                      <p className="font-semibold text-green-300">
                        Fundación Raíces de Luz
                      </p>
                      <p className="text-xs text-white/60 mt-1">
                        Beca completa N1–N2. Asociado permanentemente a tu NFT.
                      </p>
                    </div>
                  </div>
                </div>

                {/* BOTON */}
                <button
                  onClick={() => setCurrentStep(3)}
                  className="mt-6 w-full max-w-md py-3 rounded-xl font-semibold 
    bg-gradient-to-r from-[var(--action-primary)] to-teal-400 
    hover:opacity-90 transition cursor-pointer"
                >
                  Completar Ficha del Proyecto →
                </button>
              </div>
            )}

            {verifyingNFT && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
                <div className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {isNftFlow && currentStep === 3 && (
          <div className="text-center">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 backdrop-blur-md w-full max-w-3xl mx-auto">
              {/* HEADER */}
              <div className="text-center mb-8">
                <h2 className="text-h2 mb-2">Ficha detallada del proyecto</h2>
                <p className="text-body--muted text-sm">
                  Estos datos se usarán como la versión 1.0 de tu proyecto.
                </p>
              </div>

              {/* SECCIÓN */}
              <div className="mb-6">
                <p className="text-xs text-[var(--color-turquoise)] font-semibold mb-2 uppercase">
                  Información básica
                </p>
                <p className="text-xs text-body--muted mb-4">
                  Completá los datos de tu proyecto
                </p>

                <div className="space-y-4">
                  {/* NOMBRE */}
                  <input
                    type="text"
                    placeholder="Nombre del proyecto"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-turquoise)]"
                  />

                  {/* EMPRENDEDOR */}
                  <input
                    type="text"
                    placeholder="Emprendedor"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-turquoise)]"
                  />

                  {/* SECTOR */}
                  <input
                    type="text"
                    placeholder="Sector / Categoría"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-turquoise)]"
                  />

                  {/* TAGLINE */}
                  <textarea
                    placeholder="Tagline"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-turquoise)] resize-none"
                  />

                  {/* LOCALIDAD */}
                  <input
                    type="text"
                    placeholder="Localidad / Región"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-turquoise)]"
                  />

                  {/* ESTADO */}
                  <input
                    type="text"
                    placeholder="Estado actual"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-turquoise)]"
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-sm text-white/50 hover:text-white/70 transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => setCurrentStep(4)}
                  className="py-3 px-6 rounded-lg font-semibold 
    bg-gradient-to-r from-[var(--action-primary)] to-teal-400 
    hover:opacity-90 transition cursor-pointer"
                >
                  Guardar y Entrar ✓
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4 ================= */}
        {isNftFlow && currentStep === 4 && (
          <div className="text-center flex flex-col items-center">
            {/* ICONO */}
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 mb-6 text-white text-3xl">
              ✓
            </div>

            {/* TITULO */}
            <h2 className="text-h1 mb-2">¡Bienvenido al Reputation Lab!</h2>

            {/* SUBTITULO */}
            <p className="text-body--muted mb-8">
              Tu proyecto{' '}
              <span className="font-semibold text-white">Colibrí LATAM</span> ha
              sido inicializado.
            </p>

            {/* CARD NIVEL */}
            <div className="w-full max-w-sm rounded-2xl bg-white/10 border border-white/10 p-4 flex items-center gap-4 mb-8 backdrop-blur-md">
              <img
                src="/colibri.png"
                className="w-14 h-14 rounded-lg bg-white/10 p-1"
              />

              <div className="text-left">
                <p className="text-xs text-white/50 uppercase">Nivel actual</p>

                <p className="font-semibold">Semilla de Luz (N1)</p>

                <p className="text-sm text-green-400">⚡ Estado: Activo</p>
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button className="flex-1 py-3 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition cursor-pointer">
                🎓 Acceso E-learning
              </button>

              <button
                onClose={()=>router.push('/home')}
                className="flex-1 py-3 rounded-lg font-semibold bg-gradient-to-r from-[var(--action-primary)] to-teal-400 hover:opacity-90 transition cursor-pointer"
              >
                Explorar Panel de Control
              </button>
            </div>
          </div>
        )}

        {/* FORM */}
        {/* {!isSelectRole && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="text-micro-label block mb-2">
                  Nombre completo
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
                    errors.username ? 'border-red-500' : ''
                  }`}
                />
              </div>
            )}

            <div>
              <label className="text-micro-label block mb-2">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
            </div>

            <div>
              <label className="text-micro-label block mb-2">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
                  errors.password ? 'border-red-500' : ''
                }`}
              />
            </div>

            {isRegister && (
              <div>
                <label className="text-micro-label block mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-3 rounded-lg font-semibold transition 
    ${
      isFormValid()
        ? 'bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] cursor-pointer'
        : 'bg-gray-500 cursor-not-allowed opacity-60'
    }`}
            >
              {isLogin ? 'Iniciar sesión' : 'Registrarse'}
            </button>
            {isRegister && (
              <button
                type="button"
                onClick={() => setView('selectRole')}
                className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
              >
                Volver atrás
              </button>
            )}
          </form>
        )} */}

        {/* LOGIN EXTRA */}
        {/* {isLogin && (
          <>
            <button
              onClick={handleGoogleClick}
              className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
            >
              Continuar con Google
            </button>

            <button
              onClick={handleGuestLoginClick}
              className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
            >
              Entrar como invitado
            </button>
          </>
        )} */}
        {/* ================= LOGIN ================= */}
        {isLogin && (
          <>
            <button
              onClick={() => {
                setView('selectRole');
                setCurrentStep(1);
              }}
              className="w-full py-3 rounded-lg bg-[var(--action-primary)] cursor-pointer"
            >
              Ir a registro
            </button>
            <button
              onClick={handleGoogleClick}
              className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
            >
              Continuar con Google
            </button>

            {/* <button
              onClick={() => {
                const result = handleGuestLogin();
                if (result.success) {
                  setPopupMessage('Entraste como invitado');
                  setIsPopupOpen(true);
                }
              }}
              className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 cursor-pointer"
            >
              Entrar como invitado
            </button> */}
            <button
              onClick={handleGuestLoginClick}
              className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
            >
              Entrar como invitado
            </button>
          </>
        )}

        {/* <p className="text-center text-body--muted mt-6">
          {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button
            onClick={() => setView(isLogin ? 'selectRole' : 'login')}
            className="text-[var(--text-link)] font-semibold cursor-pointer"
          >
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p> */}
      </div>
    </div>
  );
}
