'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { userService } from '@/services/user';
import { useRequest } from '@/hooks/useRequest';
import { getUserRoleLabel } from '@/lib/mappers/evidence-labels';
import { useTranslation } from '@/hooks/useTranslation';

export default function MainHeader() {
  const { t } = useTranslation('mainHeader');
  const router = useRouter();

  const { logout, user: authUser } = useUserStore();

  const { execute: fetchProfile, loading: profileLoading } = useRequest(
    userService.userData,
  );

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!authUser?.sub) return;

    const loadProfile = async () => {
      const { data } = await fetchProfile(authUser.sub);

      setProfile(data);
    };

    loadProfile();
  }, [authUser]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const displayName = profile?.fullName || t('userFallback');
  const displayRole = getUserRoleLabel(profile?.role) || t('evaluatorFallback');

  const avatarLetter = displayName
  .trim()
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word.charAt(0).toUpperCase())
  .join('');

  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        h-20
        glass-effect-dark
        border-b border-white/10
      "
    >
      <div
        className="
          h-full
          flex
          items-center
          justify-between
          px-6
        "
      >
        {/* LEFT */}

        <div
          onClick={() => router.push('/home')}
          className="flex items-center gap-4 cursor-pointer"
        >
          <div
            className="
              h-12 w-12
              rounded-full
              bg-white
              flex
              items-center
              justify-center
              overflow-hidden
            "
          >
            <img
              src="/Imagotipo Colibri OS.svg"
              alt={t('altLogo')}
              className="h-10 w-10 object-contain"
            />
          </div>

          <h1 className="text-lg font-semibold text-white">{t('colibriOs')}</h1>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt={displayName}
              className="
                h-10 w-10
                rounded-full
                object-cover
                border border-cyan-500/20
              "
            />
          ) : (
            <div
              className="
                h-10 w-10
                rounded-full
                bg-cyan-500/10
                border border-cyan-500/20
                flex items-center justify-center
                text-cyan-300
                font-semibold
                text-sm
              "
            >
              {avatarLetter}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-white whitespace-nowrap">
              {displayName}
            </span>

            <span className="text-slate-600">•</span>

            <span className="text-slate-400 whitespace-nowrap">
              {displayRole}
            </span>

            <span className="text-slate-600">•</span>

            <button
              onClick={handleLogout}
              className="
                flex items-center gap-1
                text-slate-400
                hover:text-red-300
                transition-colors
                cursor-pointer
              "
            >
              <LogOut size={14} />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
