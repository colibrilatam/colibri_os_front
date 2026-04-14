export function getNextTramoCode(tramoCode) {
    if (!tramoCode) return null;
  
    const number = parseInt(tramoCode.replace('T', ''), 10);
  
    if (isNaN(number)) return tramoCode;
  
    return `T${number + 1}`;
  }