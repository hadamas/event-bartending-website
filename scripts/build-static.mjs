/** Build estático (pasta /out) — funciona em Windows, macOS e Linux. */
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, STATIC_EXPORT: "1" },
});
process.exit(result.status ?? 1);
