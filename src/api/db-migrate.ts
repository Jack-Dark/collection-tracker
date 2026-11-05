import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { db, pool } from './db';

async function main() {
  console.log('Running production migrations...');

  // This will read the SQL files directly from your folder
  await migrate(db, { migrationsFolder: './migrations' });

  console.log('Migrations applied successfully!');
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
