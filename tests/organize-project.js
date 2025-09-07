#!/usr/bin/env node

/**
 * CREB-JS Project Organization Script
 * Cleans up, organizes, and validates the project structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 CREB-JS Project Organization');
console.log('==============================\n');

// 1. Check and organize file structure
function organizeFileStructure() {
  console.log('📁 Organizing file structure...');
  
  const projectRoot = __dirname;
  const directories = {
    'src': 'Core source code',
    'dist': 'Built files',
    'docs': 'Documentation',
    'examples': 'Usage examples',
    'demos': 'Interactive demonstrations',
    'packages': 'Sub-packages',
    'tests': 'Test files'
  };

  Object.entries(directories).forEach(([dir, desc]) => {
    const dirPath = path.join(projectRoot, dir);
    if (fs.existsSync(dirPath)) {
      console.log(`  ✅ ${dir}/ - ${desc}`);
    } else {
      console.log(`  ❌ ${dir}/ - ${desc} (missing)`);
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`     Created ${dir}/ directory`);
    }
  });

  console.log('');
}

// 2. Validate package.json
function validatePackageJson() {
  console.log('📦 Validating package.json...');
  
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  
  const requiredFields = ['name', 'version', 'description', 'main', 'types'];
  const missingFields = requiredFields.filter(field => !packageJson[field]);
  
  if (missingFields.length === 0) {
    console.log('  ✅ All required fields present');
    console.log(`  📋 ${packageJson.name} v${packageJson.version}`);
  } else {
    console.log(`  ❌ Missing fields: ${missingFields.join(', ')}`);
  }

  // Check scripts
  const recommendedScripts = ['build', 'test', 'lint', 'clean'];
  const missingScripts = recommendedScripts.filter(script => !packageJson.scripts?.[script]);
  
  if (missingScripts.length === 0) {
    console.log('  ✅ All recommended scripts present');
  } else {
    console.log(`  ⚠️  Missing scripts: ${missingScripts.join(', ')}`);
  }

  console.log('');
}

// 3. Check build output
function checkBuildOutput() {
  console.log('🏗️  Checking build output...');
  
  const distPath = path.join(__dirname, 'dist');
  const expectedFiles = ['index.js', 'index.esm.js', 'index.umd.js', 'index.d.ts'];
  
  if (!fs.existsSync(distPath)) {
    console.log('  ❌ dist/ directory not found - run npm run build');
    return;
  }

  expectedFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`  ✅ ${file} (${sizeKB} KB)`);
    } else {
      console.log(`  ❌ ${file} (missing)`);
    }
  });

  console.log('');
}

// 4. Check documentation
function checkDocumentation() {
  console.log('📚 Checking documentation...');
  
  const docFiles = ['README.md', 'CHANGELOG.md', 'CONTRIBUTING.md'];
  
  docFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} (missing)`);
    }
  });

  // Check docs directory
  const docsPath = path.join(__dirname, 'docs');
  if (fs.existsSync(docsPath)) {
    const docFiles = fs.readdirSync(docsPath).filter(f => f.endsWith('.md'));
    console.log(`  📂 docs/ contains ${docFiles.length} documentation files`);
  }

  console.log('');
}

// 5. Generate summary report
function generateSummary() {
  console.log('📊 Project Summary');
  console.log('==================');
  
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
  
  console.log(`Project: ${packageJson.name}`);
  console.log(`Version: ${packageJson.version}`);
  console.log(`Description: ${packageJson.description}`);
  
  // Count source files
  const srcPath = path.join(__dirname, 'src');
  if (fs.existsSync(srcPath)) {
    const countFiles = (dir, ext) => {
      let count = 0;
      const scan = (currentDir) => {
        const items = fs.readdirSync(currentDir);
        items.forEach(item => {
          const itemPath = path.join(currentDir, item);
          const stat = fs.statSync(itemPath);
          if (stat.isDirectory() && !item.startsWith('.')) {
            scan(itemPath);
          } else if (item.endsWith(ext)) {
            count++;
          }
        });
      };
      scan(dir);
      return count;
    };

    const tsFiles = countFiles(srcPath, '.ts');
    const jsFiles = countFiles(srcPath, '.js');
    
    console.log(`\nSource Files:`);
    console.log(`  TypeScript: ${tsFiles} files`);
    console.log(`  JavaScript: ${jsFiles} files`);
  }

  // Check test coverage
  const testPath = path.join(__dirname, 'src', '__tests__');
  if (fs.existsSync(testPath)) {
    const testFiles = fs.readdirSync(testPath, { recursive: true })
      .filter(f => f.endsWith('.test.ts') || f.endsWith('.test.js'));
    console.log(`  Test files: ${testFiles.length} files`);
  }

  console.log('\n✅ Project organization complete!');
}

// Main execution
async function main() {
  try {
    organizeFileStructure();
    validatePackageJson();
    checkBuildOutput();
    checkDocumentation();
    generateSummary();
  } catch (error) {
    console.error('❌ Error during organization:', error.message);
    process.exit(1);
  }
}

main();
