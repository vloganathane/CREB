// Test file to verify local package installation
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if distribution files exist
const distFiles = [
    'dist/index.js',
    'dist/index.esm.js', 
    'dist/index.umd.js',
    'packages/pubchem-js/dist/index.js',
    'packages/pubchem-js/dist/index.esm.js',
    'packages/pubchem-js/dist/index.umd.js'
];

console.log('🧪 Testing CREB-JS Build Distribution');
console.log('=====================================');

let allFilesExist = true;

distFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`✅ ${file} - exists`);
    } else {
        console.log(`❌ ${file} - missing`);
        allFilesExist = false;
    }
});

if (allFilesExist) {
    console.log('\n🎉 All distribution files are built successfully!');
    console.log('\n📦 Package Information:');
    
    // Read package.json files
    const mainPackage = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    const pubchemPackage = JSON.parse(fs.readFileSync(path.join(__dirname, 'packages/pubchem-js/package.json'), 'utf8'));
    
    console.log(`📋 Main Package: ${mainPackage.name}@${mainPackage.version}`);
    console.log(`📋 PubChem Package: ${pubchemPackage.name}@${pubchemPackage.version}`);
    
    console.log('\n🚀 Ready for local testing or npm publishing!');
    console.log('\n💡 To test locally:');
    console.log('   • Use npm link for local development');
    console.log('   • Reference the UMD builds in HTML files');
    console.log('   • Import from local file paths');
    
} else {
    console.log('\n❌ Some distribution files are missing. Run "npm run build" first.');
}
