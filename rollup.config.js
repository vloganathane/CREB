import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const isProduction = process.env.NODE_ENV === 'production';

export default [
  // Node.js builds (CJS + ESM) - Full functionality
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        preventAssignment: true
      }),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ],
    external: [
      'events',
      'fs', 
      'path',
      'url',
      'os',
      'better-sqlite3',
      'reflect-metadata'
    ]
  },
  
  // Browser-compatible ESM build - Core chemistry functionality only
  {
    input: 'src/index.browser.ts',
    output: {
      file: 'dist/index.browser.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        preventAssignment: true
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ],
    external: []
  },

  // UMD build for CDN usage
  {
    input: 'src/index.browser.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'CREB',
      sourcemap: true
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        preventAssignment: true
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ],
    external: []
  }
];
