import postgres from "postgres";

const sql = postgres({
  username: "postgres",
  password: "postgres",
}); // go with defaults

const promises = Array.from({ length: 100 });
const start = Date.now();
for (let i = 0; i < promises.length; i++) {
  const rows = await sql`SELECT * FROM pg_stat_activity`;
  console.log(i, rows);
}
//await Promise.allSettled(promises);
console.log(Date.now() - start);
