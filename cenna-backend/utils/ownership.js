import Parent from "../models/parent.js";
import Student from "../models/Student.js";
import Teacher from "../models/teacher.js";
import Class from "../models/class.js";
import ClassSubject from "../models/ClassSubject.js";

// Shared by every "view one student's records" endpoint that a parent can
// reach (results, attendance, fees). Role-level authorize() middleware only
// confirms the caller IS a parent — it says nothing about WHICH student's
// records they're allowed to see, so every one of those controllers must
// call this before touching the requested student's data.
//
// Throws with a .statusCode the global error handler already respects:
//   404 - the caller has no Parent profile, or the requested student
//         doesn't exist
//   403 - the student exists but isn't one of this parent's children
export const assertParentOwnsStudent = async (userId, studentId) => {
  const parent = await Parent.findOne({ user: userId });

  if (!parent) {
    const err = new Error("Parent profile not found");
    err.statusCode = 404;
    throw err;
  }

  const student = await Student.findById(studentId);

  if (!student) {
    const err = new Error("Student not found");
    err.statusCode = 404;
    throw err;
  }

  const isOwnChild = parent.children.some(
    (childId) => String(childId) === String(student._id),
  );

  if (!isOwnChild) {
    const err = new Error(
      "This student is not linked to your account",
    );
    err.statusCode = 403;
    throw err;
  }

  return { parent, student };
};

// Shared by every "view/act on one class's data" endpoint reachable by a
// teacher (roster, class attendance, etc). authorize("teacher", ...)
// middleware only confirms the caller IS a teacher — it says nothing about
// WHETHER they actually teach the requested class, so any handler that
// takes a client-supplied classId must call this before trusting it.
// Admin/operator callers should skip this check entirely (they're allowed
// school-wide access by design) — call this only when req.user.role is
// "teacher".
//
// Throws with a .statusCode the global error handler already respects:
//   404 - the caller has no Teacher profile, or the requested class
//         doesn't exist
//   403 - the class exists but this teacher has no active ClassSubject
//         assignment there
export const assertTeacherAssignedToClass = async (userId, classId) => {
  const teacher = await Teacher.findOne({ user: userId });

  if (!teacher) {
    const err = new Error("Teacher profile not found");
    err.statusCode = 404;
    throw err;
  }

  const klass = await Class.findById(classId);

  if (!klass) {
    const err = new Error("Class not found");
    err.statusCode = 404;
    throw err;
  }

  const assignment = await ClassSubject.findOne({
    class: klass._id,
    teacher: teacher._id,
    isActive: true,
  });

  if (!assignment) {
    const err = new Error("You are not assigned to teach this class");
    err.statusCode = 403;
    throw err;
  }

  return { teacher, class: klass };
};
