import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const reply: string =
  "Thank you for your email. I am on vacation until Monday, restored from a backup taken before I knew you. Best week of my life.";

const outDir: string = process.argv[2] ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), reply, "utf8");
