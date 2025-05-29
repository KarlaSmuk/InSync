import path from 'path';
import { defineConfig } from 'orval';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, '.env')
});

export default defineConfig({
  insync: {
    input: `http://${process.env.VITE_API_URL}/openapi.json`,
    output: {
      mode: 'tags-split',
      target: './src/api/',
      client: 'axios',
      override: {
        mutator: {
          path: './src/utils/customAxios.ts',
          name: 'customInstance'
        }
      }
    }
  }
});
