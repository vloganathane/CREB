// Global type definitions for CREB visualization tests
declare global {
  interface Window {
    CREB: {
      balanceEquation: (equation: string) => any;
      StoichiometryCalculator: new () => any;
      ThermodynamicsCalculator: new () => any;
      ValidationEngine: new () => any;
    };
  }
}

export {};
