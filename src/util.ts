import { Class, Assignment, Grade, GradeUpdate } from "./types";

function extractAssignmentInfo(input: string) {
  const lines = input.trim().split("\n");
  if (lines.length !== 3) {
    return null; // Invalid input format
  }

  const classInfo: Class = {
    period: parseInt(lines[0].match(/\d+/)?.[0]?.trim()!),
    name: lines[0].replace(/\d+/, "").replace(/,/, "").trim(),
    teacher: lines[1].trim(),
  };

  const assignmentData = lines[2].match(/^(.*?) - (\d+\/\d+), (.*)$/)!;
  const assignment: Assignment = {
    name: assignmentData[3].trim(),
    category: assignmentData[1].trim(),
    date: assignmentData[2].trim(),
  };

  return {
    classInfo,
    assignment,
  };
}

function extractGrade(input: string): Grade {
  // Split the input string by '/'
  const parts = input.split("/");

  // Parse the earned and total points as numbers
  const earned = parseFloat(parts[0]);
  const total = parseFloat(parts[1]);

  // Calculate the percentage
  const percent = (earned / total) * 100;

  // Create and return the Grade object
  const grade: Grade = {
    percent,
    points: {
      earned,
      total,
    },
  };

  return grade;
}

function arraysAreEqual<T>(arr1: T[], arr2: T[]) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

function objectsAreEqual<T>(obj1: T, obj2: T) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getRandomMessage(newGrade: GradeUpdate) {
  const messages = [
    `You have a new grade for ${newGrade.class.name}: ${newGrade.assignment.name} - ${newGrade.grade.percent}% (${newGrade.grade.points.earned}/${newGrade.grade.points.total}). Check it out: ${newGrade.link}`,
    `Your grade has been updated for ${newGrade.assignment.name} in ${newGrade.class.name}: ${newGrade.grade.percent}% (${newGrade.grade.points.earned}/${newGrade.grade.points.total}). See details here: ${newGrade.link}`,
    `A grade update is available for ${newGrade.assignment.name} in ${newGrade.class.name}: ${newGrade.grade.percent}% (${newGrade.grade.points.earned}/${newGrade.grade.points.total}). View it now: ${newGrade.link}`,
    `Notification: ${newGrade.assignment.name} in ${newGrade.class.name} - ${newGrade.grade.percent}% (${newGrade.grade.points.earned}/${newGrade.grade.points.total}). Link: ${newGrade.link}`,
    `New grade received: ${newGrade.class.name} - ${newGrade.assignment.name} - ${newGrade.grade.percent}% (${newGrade.grade.points.earned}/${newGrade.grade.points.total}). Check the details: ${newGrade.link}`,
    `Your latest grade update: ${newGrade.assignment.name} - ${newGrade.grade.percent}% (${newGrade.grade.points.earned}/${newGrade.grade.points.total}) in ${newGrade.class.name}. Link: ${newGrade.link}`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

export {
  extractAssignmentInfo,
  extractGrade,
  arraysAreEqual,
  objectsAreEqual,
  sleep,
  getRandomMessage,
};
