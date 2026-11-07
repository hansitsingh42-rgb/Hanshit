"use strict";

(function (root) {
  const DEFAULTS = {
    subjects: [
      { name: "Computer", attendance: 82 },
      { name: "Mathematics", attendance: 74 },
      { name: "Physics", attendance: 79 }
    ],
    assignments: [
      { title: "Computer Networks notes", date: "2026-09-18", done: false },
      { title: "Mechanics revision", date: "2026-09-20", done: false }
    ],
    notes: "",
    studyMinutes: 0
  };

  const MAX_SUBJECTS = 100;
  const MAX_ASSIGNMENTS = 500;
  const MAX_NOTES_LENGTH = 10000;
  const MAX_STUDY_MINUTES = 10000000;

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function cleanText(value, maxLength) {
    if (typeof value !== "string") return "";
    return value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, maxLength);
  }

  function validDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + "T00:00:00.000Z");
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function normalizeSubject(value) {
    if (!isRecord(value)) return null;
    const name = cleanText(value.name, 40);
    const attendance = Number(value.attendance);
    if (!name || !Number.isFinite(attendance)) return null;
    return { name, attendance: Math.max(0, Math.min(100, Math.round(attendance))) };
  }

  function normalizeAssignment(value) {
    if (!isRecord(value)) return null;
    const title = cleanText(value.title, 70);
    if (!title || !validDate(value.date)) return null;
    return { title, date: value.date, done: value.done === true };
  }

  function normalizePlannerState(value) {
    if (!isRecord(value)) value = {};
    const subjects = Array.isArray(value.subjects)
      ? value.subjects.slice(0, MAX_SUBJECTS).map(normalizeSubject).filter(Boolean)
      : DEFAULTS.subjects.map(subject => ({ ...subject }));
    const assignments = Array.isArray(value.assignments)
      ? value.assignments.slice(0, MAX_ASSIGNMENTS).map(normalizeAssignment).filter(Boolean)
      : DEFAULTS.assignments.map(assignment => ({ ...assignment }));
    const minutes = Number(value.studyMinutes);
    return {
      subjects,
      assignments,
      notes: cleanText(value.notes, MAX_NOTES_LENGTH),
      studyMinutes: Number.isFinite(minutes)
        ? Math.max(0, Math.min(MAX_STUDY_MINUTES, Math.floor(minutes)))
        : 0
    };
  }

  root.normalizePlannerState = normalizePlannerState;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { normalizePlannerState, MAX_SUBJECTS, MAX_ASSIGNMENTS, MAX_NOTES_LENGTH, MAX_STUDY_MINUTES };
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
