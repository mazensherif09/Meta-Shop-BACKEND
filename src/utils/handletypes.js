export const handleNumber = (number, onError = 0) => {
    return isNaN(Number(number)) ? onError : number;
  };
  