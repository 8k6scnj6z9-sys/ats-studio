// Prints an ADMIN_PASSWORD_HASH for /admin. The password is read without echo and never stored.
// Usage: node scripts/hash-admin-password.mjs
import { randomBytes, scryptSync } from "node:crypto";

process.stdout.write("Password do admin (mín. 12 caracteres): ");
process.stdin.setRawMode?.(true);
let password = "";
process.stdin.on("data", (chunk) => {
  for (const ch of chunk.toString("utf8")) {
    if (ch === "\u0003") process.exit(130);
    if (ch === "\r" || ch === "\n") {
      process.stdin.setRawMode?.(false);
      process.stdout.write("\n");
      if (password.length < 12) {
        console.error("Password demasiado curta.");
        process.exit(1);
      }
      const salt = randomBytes(16);
      const hash = scryptSync(password, salt, 64);
      console.log(`scrypt:${salt.toString("hex")}:${hash.toString("hex")}`);
      process.exit(0);
    }
    if (ch === "\u007f") password = password.slice(0, -1);
    else password += ch;
  }
});
