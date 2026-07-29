'use client';
import { useUserStore } from '@/lib/store';

/**
 * Hook para obtener el valor localizado de un campo según el idioma del usuario
 * @param obj - Objeto que contiene los campos localizados
 * @param fieldBase - Nombre base del campo (sin sufijo _es/_en)
 * @returns El valor del campo en el idioma actual, con fallback a inglés
 */
export function useLocalizedField(obj, fieldBase) {
  const language = useUserStore((state) => state.language);
  
  if (!obj || !fieldBase) return '';
  
  // Intentar obtener el campo en el idioma actual
  const localizedValue = obj[`${fieldBase}_${language}`];
  
  // Fallback a inglés si no existe el valor en el idioma actual
  if (!localizedValue) {
    return obj[`${fieldBase}_en`] || obj[fieldBase] || '';
  }
  
  return localizedValue;
}

/**
 * Función utilitaria para obtener el valor localizado (versión no-hook)
 * Útil para usar fuera de componentes React
 */
export function getLocalizedValue(obj, fieldBase, language) {
  if (!obj || !fieldBase) return '';
  
  const localizedValue = obj[`${fieldBase}_${language}`];
  
  if (!localizedValue) {
    return obj[`${fieldBase}_en`] || obj[fieldBase] || '';
  }
  
  return localizedValue;
}
