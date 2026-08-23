'use client';
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { ERROR_CODES } from "@/lib/api/types";
import { isValidElement } from "react";
import Button from "@/components/ui/Button";

export default function ErrorScreen({ error, reset, back = '/home', next = null, redirect = '/login' }) {
  const { t } = useTranslation('errorScreen');
  const router = useRouter();

  const isTimeout = error?.code === ERROR_CODES.TIMEOUT || error?.code === ERROR_CODES.NETWORK_ERROR;

  return (
    <div className="flex items-center justify-center w-full h-full min-h-screen bg-linear-to-br from-slate-50/5 to-slate-100/5">
      <div className="glass-effect-red border-glass p-4 rounded-2xl flex flex-col items-center gap-6 max-w-md">
        <div className="p-4 rounded-full bg-red-100">
          <div className="w-12 h-12 flex items-center justify-center text-red-600 text-2xl font-bold">
            {isTimeout ? '⏳' : '⚠️'}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-(--text-primary) mb-2">
            {isTimeout ? t('timeoutTitle') : t('title')}
          </h1>
          <p className="text-(--text-secondary) mb-4">
            {isTimeout ? t('timeoutDescription') : t('description')}
          </p>
          {error?.message && !isTimeout && (
            <p className="text-xl text-black font-bold p-3 bg-red-50 rounded border border-red-200 mt-2">
              {error.message}
            </p>
          )}
        </div>
        { next &&
        <Button
          variant="danger-flat"
          onClick={() => router.push(redirect === '/home' ? '/login' : redirect)}
        >
          {next}
        </Button>
        }
        <Button
          variant="danger-flat"
          onClick={() => router.push(back)}
        >
          {t('back')}
        </Button>

        {reset && isValidElement(reset) && reset}

        {reset && typeof reset === 'function' && (
          <Button
            variant="danger-flat"
            onClick={() => reset()}
          >
            {t('retry')}
          </Button>
        )}
      </div>
    </div>
  );
}
