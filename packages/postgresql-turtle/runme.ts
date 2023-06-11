import postgres from "postgres";

const sql = postgres({
  username: "postgres",
  password: "postgres",
}); // go with defaults

const records = await sql`SELECT * FROM pg_stat_activity`;

console.log(records);
