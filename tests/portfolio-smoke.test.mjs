import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const requiredFiles = [
  "README.md",
  "LICENSE",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "index.html",
  "style.css",
  "script.js",
  "docs/PORTFOLIO-DIRECTION.md",
  "docs/ui-ux/student-resource-hub-case-study.md",
  "docs/ui-ux/study-resource-manager-case-study.md",
  "docs/ui-ux/student-productivity-dashboard-case-study.md",
];

const featuredProjects = [
  "student-resource-hub",
  "projects/study-resource-manager",
  "projects/student-productivity-dashboard",
];

test("required portfolio files exist", () => {
  for (const relative of requiredFiles) {
    assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  }
});

test("featured project directories exist", () => {
  for (const relative of featuredProjects) {
    assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  }
});

test("README does not reference missing local featured files", () => {
  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  const localLinks = [...readme.matchAll(/\]\((\.\/[^)]+)\)/g)].map((match) => match[1]);

  for (const link of localLinks) {
    const clean = link.split("#")[0];
    assert.equal(fs.existsSync(path.join(root, clean)), true, clean);
  }
});

test("tracked source does not contain obvious environment assignments", () => {
  const suspicious = /(?:^|\n)\s*(?:API_KEY|SECRET_KEY|AUTH_SECRET|DATABASE_URL|ADMIN_PASSWORD)\s*=\s*[^\s#]+/m;
  const candidates = ["README.md", "SECURITY.md", "CONTRIBUTING.md", "script.js", "index.html"];

  for (const relative of candidates) {
    const content = fs.readFileSync(path.join(root, relative), "utf8");
    assert.equal(suspicious.test(content), false, relative);
  }
});
