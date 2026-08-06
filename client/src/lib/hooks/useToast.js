import { useState, useCallback } from 'react';

export function useToast(duration = 5000) {
  const [toast, setToast] = useState({
    open: false,
    type: 'success',
    message: '',
  });

  const showToast = useCallback((type, message) => {
    setToast({
      open: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        open: false,
      }));
    }, duration);
  }, [duration]);

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}