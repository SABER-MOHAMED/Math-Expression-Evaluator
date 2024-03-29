// Custom implementation of mathematical functions

const PI = 3.141592653589793;
const initialPrecision = 1e-4;

function abs(x) {
  return x >= 0 ? x : -x;
}

function factorial(n) {
  if (n === 0 || n === 1) return 1;

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function sqrt(x) {
  if (x === 0 || x === 1) return x;

  let guess = x / 2; // initial guess

  // iterate until the guess is close enough to the square root
  while (abs(guess * guess - x) > initialPrecision) {
    guess = (guess + x / guess) / 2;
  }

  return guess.toFixed();
}

function pow(base, exponent) {
  if (exponent === 0) return 1;
  else if (exponent > 0) {
    let result = 1;
    for (let i = 0; i < exponent; i++) {
      result *= base;
    }
    return result;
  } else {
    let result = 1;
    for (let i = 0; i > exponent; i--) {
      result /= base;
    }
    return result;
  }
}

function cos(x, precision = initialPrecision) {
  x = x % (2 * PI); // Ensure x is within one period (from 0 to 2PI)
  let result = 1;
  let delta = 1;
  let i = 2;
  let sign = -1;

  while (abs(delta) > precision) {
    delta *= pow(x, 2) / (factorial(i) * factorial(i - 1));
    result += sign * delta;
    sign *= -1;
    i += 2;
  }

  return result;
}

function acos(x, precision = initialPrecision) {
  // handle values outside [-1, 1]
  if (x < -1 || x > 1) return NaN;

  let result = PI / 2; // initial guess for x within [-1, 1]

  let delta = 1;
  let i = 1;
  let sign = 1;

  while (abs(delta) > precision) {
    delta *=
      (factorial(2 * i - 1) /
        (pow(2, 2 * i - 1) * factorial(i) * factorial(i))) *
      pow(x, 2 * i - 1);
    result -= sign * delta;
    sign *= -1;
    i++;
  }

  return result;
}

function sin(x, precision = initialPrecision) {
  // making sure x is within [0, 2PI], and posittive
  while (x < 0) {
    x += 2 * PI;
  }
  while (x >= 2 * PI) {
    x -= 2 * PI;
  }

  let result = 0;
  let delta = x;
  let i = 1;
  let sign = -1;

  while (abs(delta) > precision) {
    result += delta;
    delta *= -(x * x) / (2 * i * (2 * i + 1));
    i++;
    sign *= -1;
  }

  return result;
}

function asin(x, precision = 1e-15) {
  // making sure values are within [-1, 1]
  if (x < -1 || x > 1) return NaN;

  let result = x;

  let delta = x;
  let i = 1;

  while (abs(delta) > precision) {
    delta *=
      (factorial(2 * i - 1) /
        (pow(4, i) * factorial(i) * factorial(i) * (2 * i + 1))) *
      pow(x, 2 * i + 1);
    result += delta;
    i++;
  }

  return result;
}

function tan(x, precision = initialPrecision) {
  // making sure tath x is within [-PI/2, PI/2]
  while (x < -PI / 2) {
    x += PI;
  }
  while (x >= PI / 2) {
    x -= PI;
  }

  let result = 0;
  let delta = x;
  let divisor = 1;
  let numerator = x;
  let sign = 1;

  for (let i = 1; abs(delta) > precision; i++) {
    result += delta;
    divisor = 2 * i + 1;
    numerator *= x * x;
    delta = (sign * numerator) / divisor;
    sign *= -1;
  }

  return result;
}

function atan(x, precision = 1e-15) {
  let result = 0;
  let delta = x;
  let i = 1;
  let sign = 1;

  while (precision < abs(delta)) {
    result += sign * delta;
    delta *= (x * x) / (2 * i + 1);
    sign *= -1;
    i++;
  }

  return result;
}

module.exports = {
  cos,
  acos,
  sin,
  asin,
  tan,
  atan,
  sqrt,
  pow,
};
