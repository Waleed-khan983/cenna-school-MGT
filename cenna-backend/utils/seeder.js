import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Student from "../models/student.js";
import Teacher from "../models/teacher.js";
import Parent from "../models/parent.js";
import Fee from "../models/fee.js";
import Attendance from "../models/attendance.js";
import Result from "../models/result.js";
import Timetable from "../models/Timetable.js";
import Datesheet from "../models/Datesheet.js";
import News from "../models/news.js";
import Gallery from "../models/gallery.js";
import Notification from "../models/notification.js";
import JobVacancy from "../models/jobVacancy.js";
import JobApplication from "../models/jobApplication.js";
import Alumni from "../models/alumini.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB Connected");

try {
  console.log("🗑 Clearing old data...");

  await Promise.all([
    User.deleteMany(),
    Class.deleteMany(),
    Subject.deleteMany(),
    Student.deleteMany(),
    Teacher.deleteMany(),
    Parent.deleteMany(),
    Fee.deleteMany(),
    Attendance.deleteMany(),
    Result.deleteMany(),
    Timetable.deleteMany(),
    Datesheet.deleteMany(),
    News.deleteMany(),
    Gallery.deleteMany(),
    Notification.deleteMany(),
    JobVacancy.deleteMany(),
    JobApplication.deleteMany(),
    Alumni.deleteMany(),
  ]);

  console.log("✅ Database cleared");

  const admin = await User.create({
    name: "System Administrator",
    email: "admin@cennaschool.edu.pk",
    password: "Admin@123",
    role: "admin",
    phone: "03000000000",
    isActive: true,
  });

  const teacherUser1 = await User.create({
    name: "Sir Ahmad Khan",
    email: "teacher1@cenna.com",
    password: "Teacher@123",
    role: "teacher",
    phone: "03111111111",
    isActive: true,
  });

  const teacherUser2 = await User.create({
    name: "Miss Ayesha Noor",
    email: "teacher2@cenna.com",
    password: "Teacher@123",
    role: "teacher",
    phone: "03222222222",
    isActive: true,
  });

  const parentUser = await User.create({
    name: "Muhammad Rahim",
    email: "parent@cenna.com",
    password: "Parent@123",
    role: "parent",
    phone: "03333333333",
    isActive: true,
  });

  const studentUser1 = await User.create({
    name: "Ali Rahim",
    email: "student1@cenna.com",
    password: "Student@123",
    role: "student",
    phone: "03444444444",
    isActive: true,
  });

  const studentUser2 = await User.create({
    name: "Hamza Khan",
    email: "student2@cenna.com",
    password: "Student@123",
    role: "student",
    phone: "03555555555",
    isActive: true,
  });

  const accountantUser = await User.create({
    name: "Account Officer",
    email: "accountant@cenna.com",
    password: "Account@123",
    role: "accountant",
    phone: "03666666666",
    isActive: true,
  });

  console.log("✅ Users Created");

  const subjects = await Subject.insertMany([
    { name: "English", code: "ENG-01", maxMarks: 100, passMark: 40 },
    { name: "Urdu", code: "URD-01", maxMarks: 100, passMark: 40 },
    { name: "Mathematics", code: "MATH-01", maxMarks: 100, passMark: 40 },
    { name: "Islamiyat", code: "ISL-01", maxMarks: 100, passMark: 40 },
    { name: "Pakistan Studies", code: "PST-01", maxMarks: 100, passMark: 40 },
    { name: "General Science", code: "SCI-01", maxMarks: 100, passMark: 40 },
    { name: "Computer Science", code: "CS-01", maxMarks: 100, passMark: 40 },
    { name: "Physics", code: "PHY-01", maxMarks: 100, passMark: 40 },
    { name: "Chemistry", code: "CHE-01", maxMarks: 100, passMark: 40 },
    { name: "Biology", code: "BIO-01", maxMarks: 100, passMark: 40 },
  ]);

  const [english, urdu, math, isl, pst, sci, cs, phy, chem, bio] = subjects;

  console.log("✅ Subjects Created");

  const teacher1 = await Teacher.create({
    user: teacherUser1._id,
    qualification: "MSc Mathematics",
    subjects: [math._id, phy._id],
    designation: "Senior Teacher",
    salary: 45000,
    cnic: "12345-1111111-1",
    address: "Pabbi",
    isActive: true,
  });

  const teacher2 = await Teacher.create({
    user: teacherUser2._id,
    qualification: "MSc Biology",
    subjects: [bio._id, chem._id, sci._id],
    designation: "Science Teacher",
    salary: 42000,
    cnic: "12345-2222222-2",
    address: "Nowshera",
    isActive: true,
  });

  console.log("✅ Teachers Created");

  const classes = await Class.insertMany([
    {
      name: "Nursery",
      section: "A",
      room: "101",
      capacity: 30,
      subjects: [english._id, urdu._id, isl._id],
      classTeacher: teacher1._id,
      isActive: true,
    },
    {
      name: "KG",
      section: "A",
      room: "102",
      capacity: 30,
      subjects: [english._id, urdu._id, isl._id],
      classTeacher: teacher2._id,
      isActive: true,
    },
    {
      name: "Grade 1",
      section: "A",
      room: "103",
      capacity: 40,
      subjects: [english._id, urdu._id, math._id, isl._id],
      classTeacher: teacher1._id,
      isActive: true,
    },
    {
      name: "Grade 2",
      section: "A",
      room: "104",
      capacity: 40,
      subjects: [english._id, urdu._id, math._id, isl._id],
      classTeacher: teacher2._id,
      isActive: true,
    },
    {
      name: "Grade 3",
      section: "A",
      room: "105",
      capacity: 40,
      subjects: [english._id, urdu._id, math._id, sci._id],
      classTeacher: teacher1._id,
      isActive: true,
    },
    {
      name: "Grade 4",
      section: "A",
      room: "106",
      capacity: 40,
      subjects: [english._id, urdu._id, math._id, sci._id],
      classTeacher: teacher2._id,
      isActive: true,
    },
    {
      name: "Grade 5",
      section: "A",
      room: "107",
      capacity: 40,
      subjects: [english._id, urdu._id, math._id, sci._id],
      classTeacher: teacher1._id,
      isActive: true,
    },
    {
      name: "Grade 6",
      section: "A",
      room: "201",
      capacity: 45,
      subjects: [english._id, urdu._id, math._id, sci._id, isl._id, pst._id, cs._id],
      classTeacher: teacher2._id,
      isActive: true,
    },
    {
      name: "Grade 7",
      section: "A",
      room: "202",
      capacity: 45,
      subjects: [english._id, urdu._id, math._id, sci._id, isl._id, pst._id, cs._id],
      classTeacher: teacher1._id,
      isActive: true,
    },
    {
      name: "Grade 8",
      section: "A",
      room: "203",
      capacity: 45,
      subjects: [english._id, urdu._id, math._id, sci._id, isl._id, pst._id, cs._id],
      classTeacher: teacher2._id,
      isActive: true,
    },
    {
      name: "Grade 9",
      section: "A",
      room: "301",
      capacity: 50,
      subjects: [english._id, urdu._id, math._id, phy._id, chem._id, bio._id, pst._id, isl._id, cs._id],
      classTeacher: teacher1._id,
      isActive: true,
    },
    {
      name: "Grade 10",
      section: "A",
      room: "302",
      capacity: 50,
      subjects: [english._id, urdu._id, math._id, phy._id, chem._id, bio._id, pst._id, isl._id],
      classTeacher: teacher2._id,
      isActive: true,
    },
    {
      name: "F.Sc Part 1",
      section: "A",
      room: "401",
      capacity: 55,
      subjects: [english._id, urdu._id, math._id, phy._id, chem._id, bio._id],
      classTeacher: teacher1._id,
      isActive: true,
    },
    {
      name: "F.Sc Part 2",
      section: "A",
      room: "402",
      capacity: 55,
      subjects: [english._id, urdu._id, math._id, phy._id, chem._id, bio._id],
      classTeacher: teacher2._id,
      isActive: true,
    },
  ]);

  const grade9 = classes.find((c) => c.name === "Grade 9");
  const grade10 = classes.find((c) => c.name === "Grade 10");

  console.log("✅ Classes Created");

  const parent = await Parent.create({
    user: parentUser._id,
    occupation: "Businessman",
    cnic: "12345-3333333-3",
    address: "Pabbi, Nowshera",
    isActive: true,
  });

  console.log("✅ Parent Created");

  const student1 = await Student.create({
    user: studentUser1._id,
    rollNumber: "09-A-01",
    admissionNo: "ADM-001",
    class: grade9._id,
    section: "A",
    fatherName: "Muhammad Rahim",
    motherName: "Fatima",
    dob: new Date("2010-05-10"),
    gender: "Male",
    religion: "Islam",
    nationality: "Pakistani",
    bForm: "12345-4444444-4",
    address: "Pabbi, Nowshera",
    parent: parent._id,
    bloodGroup: "B+",
    prevSchool: "CENNA Junior School",
    prevMarks: "85%",
    isActive: true,
  });

  const student2 = await Student.create({
    user: studentUser2._id,
    rollNumber: "10-A-01",
    admissionNo: "ADM-002",
    class: grade10._id,
    section: "A",
    fatherName: "Sajjad Khan",
    motherName: "Zainab",
    dob: new Date("2009-03-15"),
    gender: "Male",
    religion: "Islam",
    nationality: "Pakistani",
    bForm: "12345-5555555-5",
    address: "Nowshera",
    bloodGroup: "O+",
    prevSchool: "CENNA School",
    prevMarks: "88%",
    isActive: true,
  });

  console.log("✅ Students Created");

  await Attendance.insertMany([
    {
      student: student1._id,
      class: grade9._id,
      date: new Date(),
      status: "present",
      markedBy: teacher1._id,
    },
    {
      student: student2._id,
      class: grade10._id,
      date: new Date(),
      status: "absent",
      markedBy: teacher2._id,
    },
  ]);

  console.log("✅ Attendance Created");

  await Fee.insertMany([
    {
      student: student1._id,
      class: grade9._id,
      challanNo: "CH-001",
      month: "June",
      year: 2026,
      monthNum: 6,
      monthlyFee: 4500,
      admissionFee: 0,
      examFee: 500,
      lateFine: 0,
      discount: 0,
      totalAmount: 5000,
      paidAmount: 5000,
      status: "Paid",
      dueDate: new Date("2026-06-20"),
      paymentMethod: "Cash",
    },
    {
      student: student2._id,
      class: grade10._id,
      challanNo: "CH-002",
      month: "June",
      year: 2026,
      monthNum: 6,
      monthlyFee: 5000,
      admissionFee: 0,
      examFee: 500,
      lateFine: 200,
      discount: 0,
      totalAmount: 5700,
      paidAmount: 2000,
      status: "Partial",
      dueDate: new Date("2026-06-20"),
      paymentMethod: "Cash",
    },
  ]);

  console.log("✅ Fees Created");

  await Result.insertMany([
    {
      student: student1._id,
      class: grade9._id,
      examType: "Monthly",
      session: "2026",
      examMonth: "June",
      marks: [
        {
          subject: math._id,
          maxMarks: 100,
          obtained: 86,
          grade: "A",
          isPassed: true,
        },
        {
          subject: english._id,
          maxMarks: 100,
          obtained: 78,
          grade: "B",
          isPassed: true,
        },
      ],
      totalMarks: 200,
      totalObtained: 164,
      percentage: 82,
      grade: "A",
      isPassed: true,
      position: 1,
      remarks: "Excellent performance.",
      enteredBy: teacher1._id,
    },
    {
      student: student2._id,
      class: grade10._id,
      examType: "Monthly",
      session: "2026",
      examMonth: "June",
      marks: [
        {
          subject: math._id,
          maxMarks: 100,
          obtained: 70,
          grade: "B",
          isPassed: true,
        },
        {
          subject: english._id,
          maxMarks: 100,
          obtained: 65,
          grade: "C",
          isPassed: true,
        },
      ],
      totalMarks: 200,
      totalObtained: 135,
      percentage: 67.5,
      grade: "B",
      isPassed: true,
      position: 2,
      remarks: "Good. Needs improvement.",
      enteredBy: teacher2._id,
    },
  ]);

  console.log("✅ Results Created");

  await Timetable.insertMany([
    {
      classId: grade9._id,
      subjectId: math._id,
      teacherId: teacher1._id,
      day: "Monday",
      startTime: "08:00",
      endTime: "08:45",
      room: "301",
    },
    {
      classId: grade10._id,
      subjectId: english._id,
      teacherId: teacher2._id,
      day: "Tuesday",
      startTime: "09:00",
      endTime: "09:45",
      room: "302",
    },
  ]);

  console.log("✅ Timetable Created");

  await Datesheet.insertMany([
    {
      classId: grade9._id,
      subjectId: math._id,
      examDate: new Date("2026-07-10"),
      startTime: "09:00",
      endTime: "12:00",
      room: "Hall A",
    },
    {
      classId: grade10._id,
      subjectId: english._id,
      examDate: new Date("2026-07-12"),
      startTime: "09:00",
      endTime: "12:00",
      room: "Hall B",
    },
  ]);

  console.log("✅ Datesheets Created");

  await Notification.insertMany([
    {
      title: "School Reopening",
      message: "School will reopen from Monday.",
      audience: "all",
      createdBy: admin._id,
    },
    {
      title: "Fee Reminder",
      message: "Please submit pending fees before due date.",
      audience: "parents",
      createdBy: admin._id,
    },
  ]);

  console.log("✅ Notifications Created");

  await News.insertMany([
    {
      title: "Annual Result Ceremony",
      content:
        "CENNA School successfully conducted its annual result ceremony. Outstanding students were awarded certificates and prizes for their excellent academic performance.",

      image: "/images/logo.jpg",
      isActive: true,
    },

    {
      title: "Sports Day Announcement",
      content:
        "The annual sports day will be held next month. Students are encouraged to participate in different sports competitions and activities.",

      image: "/images/logo.jpg",
      isActive: true,
    },

    {
      title: "New Computer Lab Inauguration",
      content:
        "A new state-of-the-art computer laboratory has been inaugurated to improve digital learning opportunities for students.",

      image: "/images/logo.jpg",
      isActive: true,
    },
  ]);

  console.log("✅ News Created");

  await Gallery.insertMany([
    {
      title: "School Building",
      image: "/images/logo.jpg",
      category: "sports",
      isActive: true,
    },
    {
      title: "Students Activity",
      image: "/images/logo.jpg",
      category: "events",
      isActive: true,
    },
  ]);

  console.log("✅ Gallery Created");

  const vacancy = await JobVacancy.create({
    title: "Mathematics Teacher",
    department: "Science",
    jobType: "Full-Time",
    seats: 2,
    qualification: "MSc Mathematics",
    experience: "2 Years",
    salary: "40000-60000",
    lastDate: new Date("2026-07-30"),
    description: "CENNA School requires an experienced Mathematics Teacher.",
    status: "active",
    createdBy: admin._id,
  });

  await JobApplication.create({
    vacancy: vacancy._id,
    position: "Mathematics Teacher",
    fullName: "Bilal Ahmad",
    fatherName: "Sardar Ahmad",
    cnic: "12345-9999999-9",
    phone: "03009999999",
    email: "bilal@example.com",
    address: "Peshawar",
    qualification: "MSc Mathematics",
    experience: "3 Years",
    expectedSalary: "50000",
    coverLetter: "I am interested in this position.",
    cv: "/uploads/sample-cv.pdf",
    status: "pending",
  });

  console.log("✅ Jobs Created");

  await Alumni.insertMany([
    {
      fullName: "Usman Khan",
      fatherName: "Rahman Khan",
      admissionNo: "OLD-001",
      batch: "2018",
      passingYear: 2020,
      email: "usman@example.com",
      phone: "03001234567",
      cnic: "12345-7777777-7",
      profession: "Software Engineer",
      organization: "Tech Company",
      designation: "Developer",
      address: "Islamabad",
      city: "Islamabad",
      country: "Pakistan",
      linkedIn: "https://linkedin.com",
      status: "pending",
    },
  ]);

  console.log("✅ Alumni Created");

  console.log("\n══════════════════════════════");
  console.log("TEST LOGIN DETAILS");
  console.log("══════════════════════════════");
  console.log("Admin: admin@cennaschool.edu.pk / Admin@123");
  console.log("Teacher: teacher1@cenna.com / Teacher@123");
  console.log("Student: student1@cenna.com / Student@123");
  console.log("Parent: parent@cenna.com / Parent@123");
  console.log("Accountant: accountant@cenna.com / Account@123");
  console.log("══════════════════════════════\n");

  process.exit(0);
} catch (error) {
  console.error("❌ Seeder Error:", error);
  process.exit(1);
}