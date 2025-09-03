# PubChem-JS Demo Collection

This directory contains comprehensive demos showcasing the capabilities of the `@creb-js/pubchem` library.

## 🚀 Quick Start

First, make sure the library is built:

```bash
cd packages/pubchem-js
npm run build
```

## 📁 Demo Files

### 1. Basic Demo (`basic.js`)
**Node.js demo showcasing core functionality**

```bash
node demo/basic.js
```

**Features demonstrated:**
- ✅ Get compound by CID
- ✅ Search by name
- ✅ Search by SMILES
- ✅ Property access
- ✅ Data export

**Sample output:**
```
🧪 PubChem-JS Demo - Basic Usage
==================================================

📍 Demo 1: Get Compound by CID
Getting benzene (CID: 241)...
✅ Found: Benzene
   Formula: C6H6
   Weight: 78.11 g/mol
   SMILES: C1=CC=CC=C1
```

### 2. Interactive Demo (`interactive.ts`)
**TypeScript-powered interactive CLI demo**

```bash
npx tsx demo/interactive.ts
```

**Features:**
- 🎯 Interactive command-line interface
- 🔍 Real-time compound search
- ⚖️ Compound comparison
- 📊 Detailed property display
- 🎨 TypeScript with full type safety

**Available commands:**
```
cid <number>           - Get compound by CID
name <compound_name>   - Search by name
smiles <smiles_string> - Search by SMILES
formula <formula>      - Search by molecular formula
compare <name1> <name2> - Compare two compounds
help                   - Show help
exit                   - Exit demo
```

**Example session:**
```
pubchem> cid 241
🔍 Fetching compound with CID 241...

📋 Compound Details:
   CID: 241
   Molecular Formula: C6H6
   Molecular Weight: 78.11 g/mol
   SMILES: C1=CC=CC=C1

pubchem> compare aspirin ibuprofen
🔍 Comparing "aspirin" and "ibuprofen"...
```

### 3. Browser Demo (`browser.html`)
**Full-featured web interface**

```bash
# Serve the demo (from packages/pubchem-js directory)
python -m http.server 8000
# or
npx serve .

# Open http://localhost:8000/demo/browser.html
```

**Features:**
- 🌐 Beautiful web interface
- 📱 Responsive design
- 🔍 Multiple search types
- 📊 Rich compound display
- 🎯 Click-to-try examples
- ⌨️ Keyboard shortcuts

**Search capabilities:**
- Search by CID with validation
- Search by compound name with suggestions
- Search by SMILES with examples
- Interactive example links

### 4. Performance Benchmark (`benchmark.js`)
**Comprehensive performance testing**

```bash
node demo/benchmark.js
```

**Features:**
- 📊 Single compound benchmarks
- 🗄️ Caching performance tests
- ⚡ Batch processing tests
- 🚀 Stress testing
- 🔍 Property access timing
- 📈 Detailed performance analysis

**Sample output:**
```
🧪 PubChem-JS Performance Benchmark

📊 SINGLE COMPOUND BENCHMARKS
==================================================

🔬 Running Fetch by CID (Benzene)...
✅ Completed in 245.67ms

🗄️  CACHING PERFORMANCE TESTS
==================================================

🔬 Running First CID request (cache miss)...
✅ Completed in 234.12ms

🔬 Running Second CID request (cache hit)...
✅ Completed in 1.23ms

📈 BENCHMARK SUMMARY
==================================================
| Test Name                      | Avg Time  | Min Time  | Max Time  |
|--------------------------------|-----------|-----------|-----------|
| Fetch by CID (Benzene)        |  245.67ms |  234.12ms |  267.89ms |
| Search by Name (Aspirin)       |  389.45ms |  356.78ms |  423.12ms |

🎯 PERFORMANCE INSIGHTS:
   Fastest: Second CID request (cache hit) (1.23ms)
   Slowest: Search by Name (Aspirin) (389.45ms)
   Cache speedup: 190.4x faster
```

## 🛠️ Development Tips

### Running with Different Node Versions
```bash
# Use with tsx for TypeScript
npx tsx demo/interactive.ts

# Use with ts-node (alternative)
npx ts-node demo/interactive.ts
```

### Debugging
```bash
# Enable debug logging
DEBUG=pubchem:* node demo/basic.js

# Run with verbose output
node demo/basic.js --verbose
```

### Customization
Each demo can be easily modified:

1. **Change compounds**: Edit the example CIDs, names, or SMILES
2. **Add features**: Extend with new search types or properties
3. **Styling**: Customize the browser demo CSS
4. **Benchmarks**: Add your own performance tests

## 🔧 Troubleshooting

### Common Issues

**❌ "Cannot find module" errors**
```bash
# Make sure the package is built
npm run build
```

**❌ Network errors**
```bash
# Check internet connection
# PubChem API requires internet access
```

**❌ TypeScript errors**
```bash
# Install tsx globally or use npx
npm install -g tsx
```

**❌ Browser demo not loading**
```bash
# Serve from the correct directory
cd packages/pubchem-js
python -m http.server 8000
```

### Performance Notes

- **First requests** are slower (network + parsing)
- **Cached requests** are 100-1000x faster
- **CID lookups** are fastest (direct access)
- **Name searches** may return multiple results
- **Large batches** benefit from parallel processing

## 🎯 Use Cases

### Research & Education
- Chemical compound exploration
- Property comparison studies
- Molecular structure analysis
- Educational demonstrations

### Development & Integration
- API testing and validation
- Performance benchmarking
- Integration examples
- Error handling patterns

### Production Applications
- Chemical database integration
- Compound validation systems
- Batch processing workflows
- Caching optimization

## 📚 Next Steps

1. **Explore the examples** - Start with `basic.js`
2. **Try the interactive demo** - Use `interactive.ts` for hands-on exploration
3. **Test in browser** - Open `browser.html` for web integration
4. **Benchmark performance** - Run `benchmark.js` for optimization insights
5. **Integrate with CREB** - Use compounds in chemical equation balancing

## 🤝 Contributing

Found issues or want to add more demos?

1. Fork the repository
2. Add your demo to this directory
3. Update this README
4. Submit a pull request

---

🧪 **Happy experimenting with PubChem-JS!** 🧪
