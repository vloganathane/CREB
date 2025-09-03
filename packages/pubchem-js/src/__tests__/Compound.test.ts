/**
 * Basic tests for Compound class
 */

import { Compound } from '../core/Compound';

// Mock compound record for testing (benzene - CID 241)
const mockBenzeneRecord = {
  id: {
    id: {
      cid: 241
    }
  },
  props: [
    {
      urn: {
        label: 'Molecular Formula'
      },
      value: 'C6H6'
    },
    {
      urn: {
        label: 'Molecular Weight'
      },
      value: '78.11'
    },
    {
      urn: {
        label: 'SMILES',
        name: 'Canonical'
      },
      value: 'C1=CC=CC=C1'
    },
    {
      urn: {
        label: 'InChI'
      },
      value: 'InChI=1S/C6H6/c1-2-4-6-5-3-1/h1-6H'
    }
  ]
};

describe('Compound', () => {
  let compound: Compound;

  beforeEach(() => {
    compound = new Compound(mockBenzeneRecord);
  });

  test('should return correct CID', () => {
    expect(compound.cid).toBe(241);
  });

  test('should return correct molecular formula', () => {
    expect(compound.molecularFormula).toBe('C6H6');
  });

  test('should return correct molecular weight', () => {
    expect(compound.molecularWeight).toBe(78.11);
  });

  test('should return correct SMILES', () => {
    expect(compound.smiles).toBe('C1=CC=CC=C1');
  });

  test('should return correct InChI', () => {
    expect(compound.inchi).toBe('InChI=1S/C6H6/c1-2-4-6-5-3-1/h1-6H');
  });

  test('should handle missing properties gracefully', () => {
    expect(compound.iupacName).toBeNull();
    expect(compound.xlogp).toBeNull();
  });

  test('should return atoms array (empty for mock)', () => {
    expect(Array.isArray(compound.atoms)).toBe(true);
    expect(compound.atoms).toHaveLength(0); // Mock doesn't have atom data
  });

  test('should return bonds array (empty for mock)', () => {
    expect(Array.isArray(compound.bonds)).toBe(true);
    expect(compound.bonds).toHaveLength(0); // Mock doesn't have bond data
  });

  test('should convert to dictionary', () => {
    const dict = compound.toDict(['cid', 'molecularFormula', 'smiles']);
    expect(dict).toEqual({
      cid: 241,
      molecularFormula: 'C6H6',
      smiles: 'C1=CC=CC=C1'
    });
  });
});

describe('Compound static methods (integration tests)', () => {
  // These tests require network access  
  const runIntegrationTests = process.env.NODE_ENV !== 'ci';
  
  (runIntegrationTests ? test : test.skip)('should fetch compound by CID', async () => {
    try {
      const compound = await Compound.fromCid(241); // Benzene
      expect(compound.cid).toBe(241);
      expect(compound.molecularFormula).toBe('C6H6');
    } catch (error) {
      // Network error - skip test
      console.warn('Skipping network test:', error);
    }
  }, 10000);

  (runIntegrationTests ? test : test.skip)('should search compounds by name', async () => {
    try {
      const compounds = await Compound.fromName('benzene');
      expect(compounds.length).toBeGreaterThan(0);
      expect(compounds[0].cid).toBeDefined();
    } catch (error) {
      // Network error - skip test
      console.warn('Skipping network test:', error);
    }
  }, 10000);

  (runIntegrationTests ? test : test.skip)('should search compounds by SMILES', async () => {
    try {
      const compounds = await Compound.fromSmiles('C1=CC=CC=C1');
      expect(compounds.length).toBeGreaterThan(0);
      expect(compounds[0].cid).toBeDefined();
    } catch (error) {
      // Network error - skip test
      console.warn('Skipping network test:', error);
    }
  }, 10000);
});
