"use strict";

const assert = require("node:assert/strict");
const {
  normalizePlannerState,
  MAX_SUBJECTS,
  MAX_ASSIGNMENTS,
  MAX_NOTES_LENGTH,
  MAX_STUDY_MINUTES
} = require("../state");

const defaults = normalizePlannerState(null);
assert.equal(defaults.subjects.length, 3);
assert.equal(defaults.assignments.length, 2);

const normalized = normalizePlannerState({
  subjects: [
    { name: "  Physics  ", attendance: 120 },
    { name: "Invalid", attendance: "NaN" },
    { name: "<script>alert(1)</script>", attendance: -12 },
    null
  ],
  assignments: [
    { title: "  Revision  ", date: "2026-11-07", done: 1 },
    { title: "Bad date", date: "2026-02-31", done: false },
    { title: "Missing date", done: false },
    { title: "Valid", date: "2024-02-29", done: true }
  ],
  notes: "x".repeat(MAX_NOTES_LENGTH + 100),
  studyMinutes: -5
});
assert.deepEqual(normalized.subjects, [
  { name: "Physics", attendance: 100 },
  { name: "<script>alert(1)</script>", attendance: 0 }
]);
assert.deepEqual(normalized.assignments, [
  { title: "Revision", date: "2026-11-07", done: false },
  { title: "Valid", date: "2024-02-29", done: true }
]);
assert.equal(normalized.notes.length, MAX_NOTES_LENGTH);
assert.equal(normalized.studyMinutes, 0);

assert.equal(normalizePlannerState({ studyMinutes: Infinity }).studyMinutes, 0);
assert.equal(normalizePlannerState({ studyMinutes: MAX_STUDY_MINUTES + 1 }).studyMinutes, MAX_STUDY_MINUTES);
assert.equal(normalizePlannerState({ subjects: "bad", assignments: {} }).subjects.length, 3);
assert.equal(normalizePlannerState({ subjects: Array(MAX_SUBJECTS + 20).fill({name:"A",attendance:50}) }).subjects.length, MAX_SUBJECTS);
assert.equal(normalizePlannerState({ assignments: Array(MAX_ASSIGNMENTS + 20).fill({title:"A",date:"2026-11-07"}) }).assignments.length, MAX_ASSIGNMENTS);
assert.equal(normalizePlannerState({ notes: 123 }).notes, "");
assert.equal(normalizePlannerState({ notes: "a\u0000b\u0001c" }).notes, "abc");

console.log("academic planner state validation tests passed");
