type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

interface Class {
  name: string;
  period: number;
  teacher: string;
}

interface Assignment {
  name: string;
  category: string;
  date: string;
}

interface Grade {
  percent: number;
  points: {
    earned: number;
    total: number;
  };
}

interface GradeUpdate {
  class: Class;
  assignment: Assignment;
  grade: Grade;
  day: Day;
  date: string;
  time: string;
  link: string;
}

export { Day, Class, Assignment, Grade, GradeUpdate };
