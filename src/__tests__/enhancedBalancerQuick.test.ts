/**
 * Quick test of enhanced balancer functionality
 */

import { EnhancedBalancer } from '../enhancedBalancerSimple';

describe('Enhanced Balancer Quick Test', () => {
  let balancer: EnhancedBalancer;

  beforeEach(() => {
    balancer = new EnhancedBalancer();
  });

  test('basic functionality test', () => {
    const result = balancer.balance('H2 + O2 = H2O');
    
    console.log('Result:', JSON.stringify(result, null, 2));
    
    expect(result).toBeDefined();
    expect(result.equation).toBeDefined();
    expect(result.compounds).toBeDefined();
    expect(Array.isArray(result.compounds)).toBe(true);
  });

  test('simple equation should work', () => {
    const result = balancer.balance('NaCl + AgNO3 = AgCl + NaNO3');
    
    console.log('Simple equation result:', JSON.stringify(result, null, 2));
    
    expect(result).toBeDefined();
    expect(result.equation).toBeDefined();
  });
});
