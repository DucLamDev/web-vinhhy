import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const buildDir = path.join(rootDir, ".next");
const standaloneDir = path.join(buildDir, "standalone");
const standaloneNextDir = path.join(standaloneDir, ".next");

const copyIntoStandalone = (from, to) => {
  if (!fs.existsSync(from)) {
    return;
  }

  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
};

copyIntoStandalone(path.join(buildDir, "static"), path.join(standaloneNextDir, "static"));
copyIntoStandalone(path.join(rootDir, "public"), path.join(standaloneDir, "public"));

console.log("Prepared Next standalone assets.");
