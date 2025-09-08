// Mock PubChem implementation to isolate browser compatibility issues
export async function getSdf(cid: string | number): Promise<string> {
  // Mock SDF data for testing
  return `
  Molecule_${cid}
  3D structure placeholder
  
  3  2  0  0  0  0  0  0  0  0999 V2000
   0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   1.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   0.5000    1.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  1  0  0  0  0
M  END
`;
}

export async function getCompounds(cid: string | number) {
  return [{
    props: [
      { urn: { label: "IUPAC Name" }, value: { sval: `Mock Compound ${cid}` } },
      { urn: { label: "Molecular Formula" }, value: { sval: "C2H6O" } },
      { urn: { label: "Molecular Weight" }, value: { fval: 46.07 } }
    ]
  }];
}
