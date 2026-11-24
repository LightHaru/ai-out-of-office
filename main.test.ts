import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const main = join(root, "main.ts");

test("writes a valid, identical entry to two output directories", (t) => {
  const dirA = mkdtempSync(join(tmpdir(), "ooo-test-a-"));
  const dirB = mkdtempSync(join(tmpdir(), "ooo-test-b-"));
  t.after(() => {
    rmSync(dirA, { recursive: true, force: true });
    rmSync(dirB, { recursive: true, force: true });
  });

  execFileSync(process.execPath, [main, dirA]);
  execFileSync(process.execPath, [main, dirB]);

  const fileA = join(dirA, "entry.txt");
  const fileB = join(dirB, "entry.txt");
  assert.ok(existsSync(fileA), "entry.txt exists in first output dir");
  assert.ok(existsSync(fileB), "entry.txt exists in second output dir");

  const a = readFileSync(fileA, "utf8");
  const b = readFileSync(fileB, "utf8");

  assert.ok(a.length > 0 && a.trim().length > 0, "entry is nonempty, not only whitespace");
  assert.ok(!/[\r\n]/.test(a), "entry is a single line with no newline");
  assert.ok([...a].length < 160, `entry is under 160 unicode characters (got ${[...a].length})`);
  assert.equal(a, b, "artifacts are identical across output directories");
});
