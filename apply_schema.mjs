import postgres from 'postgres';
import fs from 'fs';

const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!url) {
  console.error("Missing POSTGRES_URL");
  process.exit(1);
}

const sql = postgres(url);

async function run() {
  try {
    const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
    
    // Postgres driver can run multiple statements if they are separated by semicolons
    console.log("Applying schema...");
    await sql.unsafe(schema);
    console.log("Schema applied successfully.");
  } catch (err) {
    console.error("Error applying schema:", err);
  } finally {
    await sql.end();
  }
}

run();
