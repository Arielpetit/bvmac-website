// Prints one GATE_USERS entry for a tester:  node scripts/gate-user.mjs email password
// Join several entries with commas and store the result as the GATE_USERS secret.
import { pbkdf2Sync, randomBytes } from "node:crypto";

const [email, password] = process.argv.slice(2);
if (!email || !password || /[:,\s]/.test(email)) {
  console.error("Usage: node scripts/gate-user.mjs email password");
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
const hash = pbkdf2Sync(password, salt, 100_000, 32, "sha256").toString("hex");
console.log(`${email.toLowerCase()}:${salt}:${hash}`);
