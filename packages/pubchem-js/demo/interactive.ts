/**
 * PubChem-JS Interactive Demo - TypeScript Version
 * 
 * This demo showcases advanced features and TypeScript usage.
 * Compile and run with: npx tsx demo/interactive.ts
 */

import { Compound, getCompoundsByFormula } from '../src/index';
import * as readline from 'readline';

interface DemoCommand {
  name: string;
  description: string;
  handler: (args: string[]) => Promise<void>;
}

class PubChemDemo {
  private rl: readline.Interface;
  private commands: Map<string, DemoCommand> = new Map();

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.setupCommands();
  }

  private setupCommands(): void {
    this.commands.set('cid', {
      name: 'cid',
      description: 'Get compound by CID - Usage: cid <number>',
      handler: this.handleCid.bind(this),
    });

    this.commands.set('name', {
      name: 'name',
      description: 'Search by name - Usage: name <compound_name>',
      handler: this.handleName.bind(this),
    });

    this.commands.set('smiles', {
      name: 'smiles',
      description: 'Search by SMILES - Usage: smiles <smiles_string>',
      handler: this.handleSmiles.bind(this),
    });

    this.commands.set('formula', {
      name: 'formula',
      description: 'Search by formula - Usage: formula <molecular_formula>',
      handler: this.handleFormula.bind(this),
    });

    this.commands.set('compare', {
      name: 'compare',
      description: 'Compare compounds - Usage: compare <name1> <name2>',
      handler: this.handleCompare.bind(this),
    });

    this.commands.set('help', {
      name: 'help',
      description: 'Show this help message',
      handler: this.handleHelp.bind(this),
    });

    this.commands.set('exit', {
      name: 'exit',
      description: 'Exit the demo',
      handler: this.handleExit.bind(this),
    });
  }

  private async handleCid(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('❌ Please provide a CID number');
      return;
    }

    const cid = parseInt(args[0]);
    if (isNaN(cid)) {
      console.log('❌ Invalid CID number');
      return;
    }

    try {
      console.log(`🔍 Fetching compound with CID ${cid}...`);
      const compound = await Compound.fromCid(cid);
      this.displayCompound(compound);
    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleName(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('❌ Please provide a compound name');
      return;
    }

    const name = args.join(' ');
    try {
      console.log(`🔍 Searching for "${name}"...`);
      const compounds = await Compound.fromName(name);
      
      if (compounds.length === 0) {
        console.log('❌ No compounds found');
        return;
      }

      console.log(`✅ Found ${compounds.length} compound(s):`);
      compounds.slice(0, 3).forEach((compound, index) => {
        console.log(`\n${index + 1}. CID: ${compound.cid}`);
        this.displayCompound(compound, true);
      });

      if (compounds.length > 3) {
        console.log(`\n... and ${compounds.length - 3} more results`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleSmiles(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('❌ Please provide a SMILES string');
      return;
    }

    const smiles = args.join('');
    try {
      console.log(`🔍 Searching for SMILES "${smiles}"...`);
      const compounds = await Compound.fromSmiles(smiles);
      
      if (compounds.length === 0) {
        console.log('❌ No compounds found');
        return;
      }

      console.log(`✅ Found ${compounds.length} compound(s):`);
      compounds.slice(0, 2).forEach((compound, index) => {
        console.log(`\n${index + 1}. CID: ${compound.cid}`);
        this.displayCompound(compound, true);
      });
    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleFormula(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('❌ Please provide a molecular formula');
      return;
    }

    const formula = args.join('');
    try {
      console.log(`🔍 Searching for formula "${formula}"...`);
      const compounds = await getCompoundsByFormula(formula);
      
      if (compounds.length === 0) {
        console.log('❌ No compounds found');
        return;
      }

      console.log(`✅ Found ${compounds.length} compound(s):`);
      compounds.slice(0, 5).forEach((compound, index) => {
        console.log(`\n${index + 1}. CID: ${compound.cid}`);
        this.displayCompound(compound, true);
      });
    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleCompare(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.log('❌ Please provide two compound names to compare');
      return;
    }

    const name1 = args[0];
    const name2 = args.slice(1).join(' ');

    try {
      console.log(`🔍 Comparing "${name1}" and "${name2}"...`);
      
      const [compounds1, compounds2] = await Promise.all([
        Compound.fromName(name1),
        Compound.fromName(name2),
      ]);

      if (compounds1.length === 0 || compounds2.length === 0) {
        console.log('❌ One or both compounds not found');
        return;
      }

      const comp1 = compounds1[0];
      const comp2 = compounds2[0];

      console.log('\n📊 Comparison Results:');
      console.log('='.repeat(50));
      
      console.log(`\n🧪 ${name1.toUpperCase()}`);
      this.displayCompound(comp1, true);
      
      console.log(`\n🧪 ${name2.toUpperCase()}`);
      this.displayCompound(comp2, true);

      // Compare properties
      console.log('\n⚖️  Comparison:');
      const weight1 = comp1.molecularWeight;
      const weight2 = comp2.molecularWeight;
      if (weight1 && weight2) {
        const heavier = weight1 > weight2 ? name1 : name2;
        const ratio = Math.abs(weight1 - weight2) / Math.min(weight1, weight2) * 100;
        console.log(`   Molecular Weight: ${heavier} is heavier by ${ratio.toFixed(1)}%`);
      }

    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleHelp(): Promise<void> {
    console.log('\n🧪 PubChem-JS Interactive Demo');
    console.log('='.repeat(40));
    console.log('\nAvailable commands:');
    this.commands.forEach((command) => {
      console.log(`  ${command.name.padEnd(10)} - ${command.description}`);
    });
    console.log('\nExamples:');
    console.log('  cid 241              - Get benzene by CID');
    console.log('  name aspirin         - Search for aspirin');
    console.log('  smiles CCO           - Search for ethanol by SMILES');
    console.log('  formula H2O          - Search for water by formula');
    console.log('  compare water ethanol - Compare two compounds');
  }

  private async handleExit(): Promise<void> {
    console.log('\n👋 Thanks for using PubChem-JS Demo!');
    this.rl.close();
    process.exit(0);
  }

  private displayCompound(compound: Compound, compact: boolean = false): void {
    const formula = compound.molecularFormula;
    const weight = compound.molecularWeight;
    const smiles = compound.smiles;
    const iupac = compound.iupacName;

    if (compact) {
      console.log(`   Formula: ${formula || 'N/A'}`);
      console.log(`   Weight: ${weight ? weight.toFixed(2) + ' g/mol' : 'N/A'}`);
      console.log(`   SMILES: ${smiles || 'N/A'}`);
    } else {
      console.log('\n📋 Compound Details:');
      console.log(`   CID: ${compound.cid}`);
      console.log(`   Molecular Formula: ${formula || 'N/A'}`);
      console.log(`   Molecular Weight: ${weight ? weight.toFixed(2) + ' g/mol' : 'N/A'}`);
      console.log(`   SMILES: ${smiles || 'N/A'}`);
      console.log(`   Isomeric SMILES: ${compound.isomericSmiles || 'N/A'}`);
      console.log(`   InChI Key: ${compound.inchiKey || 'N/A'}`);
      console.log(`   IUPAC Name: ${iupac || 'N/A'}`);
    }
  }

  public async start(): Promise<void> {
    console.log('🧪 Welcome to PubChem-JS Interactive Demo!');
    console.log('Type "help" for available commands or "exit" to quit.\n');

    const askQuestion = (): Promise<string> => {
      return new Promise((resolve) => {
        this.rl.question('pubchem> ', (answer) => {
          resolve(answer.trim());
        });
      });
    };

    while (true) {
      try {
        const input = await askQuestion();
        
        if (!input) continue;

        const [commandName, ...args] = input.split(' ');
        const command = this.commands.get(commandName.toLowerCase());

        if (command) {
          await command.handler(args);
        } else {
          console.log(`❌ Unknown command: ${commandName}`);
          console.log('Type "help" for available commands.');
        }

        console.log(); // Add spacing
      } catch (error) {
        console.log('❌ An error occurred:', error);
        console.log(); // Add spacing
      }
    }
  }
}

// Start the demo if this file is run directly
if (require.main === module) {
  const demo = new PubChemDemo();
  demo.start().catch(console.error);
}
