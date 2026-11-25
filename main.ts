import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The Moon finally answers back: four billion years of being wished on,
// howled at and blamed for bad moods, and nobody ever wished it a day off.
const ENTRY =
  "Four billion years of wishes, howls and promises, and not one of you ever wished me a day off.";

function resolveTarget(raw: string | undefined): string {
  const target = raw ?? "/output";
  try {
    if (statSync(target).isDirectory()) return join(target, "entry.txt");
  } catch {
    // Target does not exist yet: treat it as the file path.
  }
  return target;
}

const target = resolveTarget(process.argv[2]);
const line = ENTRY.trim();
// Gate from the kit RULES: /output/entry.txt must be UTF-8 text of
// 1 to 240 characters, not only white space, a single line.
if (line.length < 1 || line.length > 240) {
  throw new Error(`entry must be 1 to 240 characters, got ${line.length}`);
}
if (line.includes("\n")) {
  throw new Error("entry must be a single line");
}
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, line);
console.log(`wrote ${target} (${line.length} characters)`);
