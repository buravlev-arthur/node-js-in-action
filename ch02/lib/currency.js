class Currency {
  constructor(canadianDollar) {
    this.canadianDollar = canadianDollar;
  }

  canadianToUS(canadian) {
    return Math.round(canadian * this.canadianDollar);
  }

  USToCanadian(us) {
    return Math.round(us / this.canadianDollar);
  }
}

module.exports = Currency;