import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export function fCurrency(number) {
  const format = number ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

export function fIndianCurrency(number) {
  if (number === undefined || number === null) return '';
  
  // If number is large (likely in base units), convert to Cr
  if (number >= 10000000) {
    const cr = number / 10000000;
    return `₹${cr.toFixed(1)} Cr`;
  }
  
  if (number >= 100000) {
    const lakhs = number / 100000;
    return `₹${lakhs.toFixed(1)} L`;
  }

  // Handle cases where number might already be in Cr (backward compatibility or specific usage)
  if (number >= 1 && number < 100) {
    return `₹${number} Cr`;
  }
  
  return `₹${number}`;
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
