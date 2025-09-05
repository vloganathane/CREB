# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0-alpha] - 2025-09-02

### Added - Phase 3: Thermodynamics Module
- **NEW**: `ThermodynamicsCalculator` class for comprehensive thermodynamic analysis
- **Thermodynamic calculations**: Calculate ΔH°, ΔS°, and ΔG° for chemical reactions
- **Spontaneity prediction**: Determine if reactions are thermodynamically favorable
- **Temperature analysis**: Study how temperature affects reaction thermodynamics
- **Energy analysis**: Calculate heat released/absorbed in reactions
- **Glucose combustion demo**: Interactive analysis of biochemical reactions
- **Scientific accuracy**: Based on NIST and CRC Handbook reference data
- **Interactive demo integration**: New thermodynamics page in web demo
- **Comprehensive testing**: Full test suite for thermodynamic calculations
- **Documentation**: Complete API reference and usage examples

### Enhanced
- Demo updated to v1.3.0-alpha with new "🔥 Thermodynamics (NEW!)" menu
- CSS styling for thermodynamic property grids and result displays
- JavaScript functions for interactive thermodynamic calculations
- Documentation updated with thermodynamic principles and examples
- README.md updated with Phase 3 features and examples

### Technical
- `src/thermodynamics/` module with types, calculator, and comprehensive tests
- TypeScript interfaces for `ReactionData`, `ThermodynamicsResult`, `CompoundThermodynamics`
- Temperature-dependent Gibbs free energy calculations (ΔG = ΔH - TΔS)
- Standard thermodynamic data integration for common compounds
- Error handling and validation for thermodynamic inputs

## [1.0.0] - 2025-09-02

### Added
- Initial release of CREB-JS
- Chemical equation balancing functionality
- Stoichiometric calculations (moles/grams conversions)
- Molar weight calculations for complex chemical formulas
- Support for formulas with parentheses and multipliers
- TypeScript support with full type definitions
- ES modules and CommonJS builds
- Comprehensive test suite with Jest
- Browser and Node.js compatibility
- Interactive HTML demo
- Complete API documentation
- GitHub Actions CI/CD pipeline

### Features
- `ChemicalEquationBalancer` class for balancing equations
- `Stoichiometry` class for calculations
- Support for complex chemical formulas: `Ca(OH)2`, `Al2(SO4)3`
- Error handling with informative messages
- Professional build system with Rollup
- Full periodic table data (118 elements)

### Examples
- Basic usage examples
- Advanced stoichiometric calculations
- Browser integration demo
- Node.js examples

This release represents a complete JavaScript/TypeScript port of the original CREB Python project by LastChemist, bringing chemical equation balancing capabilities to the JavaScript ecosystem.
