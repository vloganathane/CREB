/**
 * Simple telemetry test
 */
import { telemetry, initializeTelemetry } from '../src/index.js';

console.log('🧪 Simple Telemetry Test');
console.log('=========================\n');

// Initialize telemetry
initializeTelemetry();

// Test basic logging
telemetry.info('Telemetry system is working!', { test: true });
telemetry.warn('This is a warning message', { level: 'test' });
telemetry.error('This is an error message', new Error('Test error'));

console.log('\n✅ Simple telemetry test completed!');
