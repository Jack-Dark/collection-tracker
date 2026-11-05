import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

import { configs } from '#/configs.ts';

import { relations } from './db/relations.ts';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: configs.dbUrl });

export const db = drizzle({
  client: pool,
  connection: configs.dbUrl,
  relations,
});
