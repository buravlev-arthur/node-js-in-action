const Currency = require('./lib');

const canadianDollar = 0.91;
const currency = new Currency(canadianDollar);

console.log( '50 canadian dollar = %s', currency.canadianToUS(50), ' us dollars');
console.log('50 us dollars = %s', currency.USToCanadian(50), ' canadian dollars');