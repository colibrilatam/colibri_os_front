// /lib/utils/date.js

export const formatDateSafe = (dateString) => {
    return dateString.split('T')[0].split('-').reverse().join('-');
  };