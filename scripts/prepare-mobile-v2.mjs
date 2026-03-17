import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const workspaceRoot = process.cwd();
const appRoot = path.join(workspaceRoot, "apps", "mobile-v2");
const srcRoot = path.join(appRoot, "src");
const generatedRoot = path.join(appRoot, ".generated");
const tsconfigPath = path.join(appRoot, "tsconfig.roadhog.json");

function resetDir(target) {
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
}

function copyRecursive(source, target) {
  const stats = fs.statSync(source);

  if (stats.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(target, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyNonCodeAssets(sourceDir, targetDir) {
  for (const entry of fs.readdirSync(sourceDir)) {
    const sourcePath = path.join(sourceDir, entry);
    const targetPath = path.join(targetDir, entry);
    const stats = fs.statSync(sourcePath);

    if (stats.isDirectory()) {
      copyNonCodeAssets(sourcePath, targetPath);
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry)) {
      continue;
    }

    copyRecursive(sourcePath, targetPath);
  }
}

resetDir(generatedRoot);
copyNonCodeAssets(srcRoot, generatedRoot);

execFileSync(
  path.join(workspaceRoot, "node_modules", ".bin", "tsc"),
  ["-p", tsconfigPath],
  {
    cwd: workspaceRoot,
    stdio: "inherit",
  },
);
