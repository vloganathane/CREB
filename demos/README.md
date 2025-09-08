# CREB-JS Demos

This directory contains the demonstration files for the CREB-JS computational chemistry platform.

## 🎮 Interactive Playground

### **[New] Modern React Playground** 🚀
- **Location**: `playground/` directory
- **URL**: `http://localhost:5173/` (when running `npm run dev`)
- **Features**:
  - **Live Code Editor** with Monaco Editor (VS Code editor)
  - **Real-time Execution** of CREB-JS code
  - **Interactive Examples Gallery** with progressive difficulty
  - **API Explorer** with live documentation
  - **Chemical Visualizer** for 2D/3D molecular structures
  - **Dark Theme** with professional styling

### **Getting Started with Playground**
```bash
cd playground/
npm install
npm run dev
# Open http://localhost:5173/ in your browser
```

## 📁 Archived Legacy Demos

The previous HTML demos have been moved to `archive/legacy-demos/` for reference:

### **Archive Contents**
- `demo.html` - Main interactive demo with comprehensive features
- `enhanced-2d-structures.html` - 2D molecular structure rendering
- `pubchem-real-data.html` - PubChem integration showcase
- `svg-export-demo.html` - SVG export capabilities
- `molecular-visualization-integrated.html` - 3D molecular visualization
- `test-demo.html` - Automated testing interface
- `enhanced-demo.js` - Node.js console demonstration

### **Why Archived?**
The legacy demos served their purpose but have been superseded by the modern playground:
- ✅ **Better UX**: Interactive playground vs static HTML
- ✅ **Modern Tech**: React + TypeScript vs vanilla JS/HTML
- ✅ **Educational**: Progressive examples with explanations
- ✅ **Comprehensive**: All features in one unified interface
- ✅ **Maintainable**: Single codebase vs multiple HTML files

## 🎯 Playground Features

### **1. Code Editor**
- Monaco Editor with TypeScript support
- Syntax highlighting for chemical formulas
- Auto-completion for CREB-JS APIs
- Real-time error checking

### **2. Examples Gallery**
- **Beginner**: Basic equation balancing
- **Intermediate**: PubChem integration, 2D visualization
- **Advanced**: SVG export, thermodynamic calculations
- **Expert**: Custom plugins and complex workflows

### **3. API Explorer**
- Interactive method browser
- Live parameter testing
- Code generation
- Complete documentation

### **4. Chemical Visualizer**
- 2D molecular structures with Canvas rendering
- 3D interactive models with 3Dmol.js
- Export capabilities (PNG, SVG, JSON)
- Real-time updates from code execution

### **5. Results Panel**
- Live code execution output
- Chemical calculation results
- Error handling with helpful messages
- Console output capture

## 🔧 Development

### **Playground Architecture**
```
playground/
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx        # Monaco editor wrapper
│   │   ├── ChemicalVisualizer.tsx # 2D/3D molecular display
│   │   ├── ResultsPanel.tsx      # Output visualization
│   │   ├── ExamplesGallery.tsx   # Pre-built examples
│   │   └── APIExplorer.tsx       # Interactive API docs
│   ├── types.ts                  # TypeScript definitions
│   ├── App.tsx                   # Main application
│   └── App.css                   # Styling
├── package.json                  # Dependencies and scripts
└── dist/                        # Built playground (after npm run build)
```

### **Tech Stack**
- **Frontend**: React 19 + TypeScript
- **Editor**: Monaco Editor (VS Code editor)
- **Styling**: CSS Custom Properties + Framer Motion
- **Icons**: Lucide React
- **Build**: Vite
- **Chemistry**: CREB-JS integration

---

*For technical support or feature requests for the playground, please open an issue in the main CREB-JS repository.*
