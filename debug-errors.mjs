import { SystemError, ErrorUtils, CREBError } from './src/core/errors/CREBError.ts';

// Simple test
const error = new SystemError('test');
console.log('SystemError constructor name:', error.constructor.name);
console.log('SystemError instanceof SystemError:', error instanceof SystemError);
console.log('SystemError instanceof CREBError:', error instanceof CREBError);

// Test transformUnknownError
const transformed = ErrorUtils.transformUnknownError('test string');
console.log('Transformed constructor name:', transformed.constructor.name);
console.log('Transformed instanceof SystemError:', transformed instanceof SystemError);
console.log('Transformed instanceof CREBError:', transformed instanceof CREBError);
