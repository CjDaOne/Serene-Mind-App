import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import path from 'path';
import { fileURLToPath } from 'url';
import react from 'eslint-plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [{
  ignores: [
    '.next/**',
    'out/**',
    'build/**',
    'node_modules/**',
    'public/**',
    '.git/**',
    'next-env.d.ts',
    'agents/**',
  ],
}, ...nextCoreWebVitals, ...nextTypescript];
