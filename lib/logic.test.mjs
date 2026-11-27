import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

function loadESM(relPath) {
  const code = fs.readFileSync(path.resolve("lib", relPath), "utf8")
    .replace(/export const /g, "const ")
    .replace(/export function /g, "function ");
  const exports = {};
  const wrapped = `(function(exports){ ${code}; return { ${
    [...code.matchAll(/^(?:const|function)\s+([A-Za-z0-9_]+)/gm)].map(m => m[1]).join(",")
  } }; })({})`;
  return vm.runInThisContext(wrapped);
}

const avatar = loadESM("avatar.js");
const xp = loadESM("xp.js");
const quiz = loadESM("quiz.js");
const cert = loadESM("certificate.js");

assert.equal(avatar.hashString("Shivam Tiwari"), avatar.hashString("Shivam Tiwari"));
assert.equal(avatar.getInitials("Shivam Tiwari"), "ST");
assert.equal(avatar.getInitials(""), "L");
assert.deepEqual(avatar.generateAvatarConfig("Shivam", 1), avatar.generateAvatarConfig("Shivam", 1));

assert.equal(xp.levelFromXP(0), 1);
assert.equal(xp.levelFromXP(60), 2);
assert.equal(xp.xpForLevel(3), 240);
assert.deepEqual(xp.updateStreak(3, 5, "2026-01-31", "2026-02-01"), { streak: 4, longestStreak: 5, isNewDay: true });
assert.deepEqual(xp.updateStreak(4, 5, "2026-02-01", "2026-02-03"), { streak: 1, longestStreak: 5, isNewDay: true });

const q = { passingScore: 70, questions: [{ id: "1", correctIndex: 0, explanation: "" }, { id: "2", correctIndex: 1, explanation: "" }] };
assert.equal(quiz.gradeAttempt(q, { "1": 0, "2": 1 }).passed, true);
assert.equal(quiz.gradeAttempt(q, { "1": 0, "2": 0 }).passed, false);
assert.equal(quiz.formatTimer(65), "1:05");

assert.equal(cert.getCertificateEligibility({ completedLessons: 15, totalLessons: 15, bestQuizScore: 80, passingScore: 70 }).eligible, true);
assert.equal(cert.getCertificateEligibility({ completedLessons: 14, totalLessons: 15, bestQuizScore: 80, passingScore: 70 }).eligible, false);

console.log("All 14 Learnly pure logic tests passed!");
