import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Class from "../models/class.js";
import Subject from "../models/subject.js";
import Student from "../models/Student.js";
import Teacher from "../models/teacher.js";
import Parent from "../models/parent.js";
import Fee from "../models/fee.js";
import Attendance from "../models/attendance.js";
import Result from "../models/result.js";
import Timetable from "../models/timetable.js";
import Datesheet from "../models/datesheet.js";
import News from "../models/news.js";
import Gallery from "../models/gallery.js";
import Notification from "../models/notification.js";
import JobVacancy from "../models/jobVacancy.js";
import JobApplication from "../models/jobApplication.js";
import Alumni from "../models/alumini.js";
import EvaluationTemplate from "../models/evaluationTemplate.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB Connected");

try {
  // console.log("🗑 Clearing old data...");

  // await Promise.all([
  //   User.deleteMany(),
  //   Class.deleteMany(),
  //   Subject.deleteMany(),
  //   Student.deleteMany(),
  //   Teacher.deleteMany(),
  //   Parent.deleteMany(),
  //   Fee.deleteMany(),
  //   Attendance.deleteMany(),
  //   Result.deleteMany(),
  //   Timetable.deleteMany(),
  //   Datesheet.deleteMany(),
  //   News.deleteMany(),
  //   Gallery.deleteMany(),
  //   Notification.deleteMany(),
  //   JobVacancy.deleteMany(),
  //   JobApplication.deleteMany(),
  //   Alumni.deleteMany(),
  //   EvaluationTemplate.deleteMany(),
  // ]);

  // console.log("✅ Database cleared");

  // const admin = await User.create({
  //   name: "System Administrator",
  //   email: "admin@cennaschool.edu.pk",
  //   password: "Admin@123",
  //   role: "admin",
  //   phone: "03000000000",
  //   isActive: true,
  // });

  // const teacherUser1 = await User.create({
  //   name: "Sir Ahmad Khan",
  //   email: "teacher1@cenna.com",
  //   password: "Teacher@123",
  //   role: "teacher",
  //   phone: "03111111111",
  //   isActive: true,
  // });

  // const teacherUser2 = await User.create({
  //   name: "Miss Ayesha Noor",
  //   email: "teacher2@cenna.com",
  //   password: "Teacher@123",
  //   role: "teacher",
  //   phone: "03222222222",
  //   isActive: true,
  // });

  // const parentUser = await User.create({
  //   name: "Muhammad Rahim",
  //   email: "parent@cenna.com",
  //   password: "Parent@123",
  //   role: "parent",
  //   phone: "03333333333",
  //   isActive: true,
  // });

  // const studentUser1 = await User.create({
  //   name: "Ali Rahim",
  //   email: "student1@cenna.com",
  //   password: "Student@123",
  //   role: "student",
  //   phone: "03444444444",
  //   isActive: true,
  // });

  // const studentUser2 = await User.create({
  //   name: "Hamza Khan",
  //   email: "student2@cenna.com",
  //   password: "Student@123",
  //   role: "student",
  //   phone: "03555555555",
  //   isActive: true,
  // });

  // const accountantUser = await User.create({
  //   name: "Account Officer",
  //   email: "accountant@cenna.com",
  //   password: "Account@123",
  //   role: "accountant",
  //   phone: "03666666666",
  //   isActive: true,
  // });

  // console.log("✅ Users Created");

  // const subjects = await Subject.insertMany([
  //   { name: "English", code: "ENG-01", maxMarks: 100, passMark: 40 },
  //   { name: "Urdu", code: "URD-01", maxMarks: 100, passMark: 40 },
  //   { name: "Mathematics", code: "MATH-01", maxMarks: 100, passMark: 40 },
  //   { name: "Islamiyat", code: "ISL-01", maxMarks: 100, passMark: 40 },
  //   { name: "Pakistan Studies", code: "PST-01", maxMarks: 100, passMark: 40 },
  //   { name: "General Science", code: "SCI-01", maxMarks: 100, passMark: 40 },
  //   { name: "Computer Science", code: "CS-01", maxMarks: 100, passMark: 40 },
  //   { name: "Physics", code: "PHY-01", maxMarks: 100, passMark: 40 },
  //   { name: "Chemistry", code: "CHE-01", maxMarks: 100, passMark: 40 },
  //   { name: "Biology", code: "BIO-01", maxMarks: 100, passMark: 40 },
  // ]);

  // const [english, urdu, math, isl, pst, sci, cs, phy, chem, bio] = subjects;

  // console.log("✅ Subjects Created");

  // const teacher1 = await Teacher.create({
  //   user: teacherUser1._id,
  //   qualification: "MSc Mathematics",
  //   subjects: [math._id, phy._id],
  //   designation: "Senior Teacher",
  //   salary: 45000,
  //   cnic: "12345-1111111-1",
  //   address: "Pabbi",
  //   isActive: true,
  // });

  // const teacher2 = await Teacher.create({
  //   user: teacherUser2._id,
  //   qualification: "MSc Biology",
  //   subjects: [bio._id, chem._id, sci._id],
  //   designation: "Science Teacher",
  //   salary: 42000,
  //   cnic: "12345-2222222-2",
  //   address: "Nowshera",
  //   isActive: true,
  // });

  // console.log("✅ Teachers Created");

  // const classes = await Class.insertMany([
  //   {
  //     name: "Nursery",
  //     section: "A",
  //     room: "101",
  //     capacity: 30,
  //     subjects: [english._id, urdu._id, isl._id],
  //     classTeacher: teacher1._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "KG",
  //     section: "A",
  //     room: "102",
  //     capacity: 30,
  //     subjects: [english._id, urdu._id, isl._id],
  //     classTeacher: teacher2._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "Grade 1",
  //     section: "A",
  //     room: "103",
  //     capacity: 40,
  //     subjects: [english._id, urdu._id, math._id, isl._id],
  //     classTeacher: teacher1._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "Grade 2",
  //     section: "A",
  //     room: "104",
  //     capacity: 40,
  //     subjects: [english._id, urdu._id, math._id, isl._id],
  //     classTeacher: teacher2._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "Grade 3",
  //     section: "A",
  //     room: "105",
  //     capacity: 40,
  //     subjects: [english._id, urdu._id, math._id, sci._id],
  //     classTeacher: teacher1._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "Grade 4",
  //     section: "A",
  //     room: "106",
  //     capacity: 40,
  //     subjects: [english._id, urdu._id, math._id, sci._id],
  //     classTeacher: teacher2._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "Grade 5",
  //     section: "A",
  //     room: "107",
  //     capacity: 40,
  //     subjects: [english._id, urdu._id, math._id, sci._id],
  //     classTeacher: teacher1._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "Grade 6",
  //     section: "A",
  //     room: "201",
  //     capacity: 45,
  //     subjects: [english._id, urdu._id, math._id, sci._id, isl._id, pst._id, cs._id],
  //     classTeacher: teacher2._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "Grade 7",
  //     section: "A",
  //     room: "202",
  //     capacity: 45,
  //     subjects: [english._id, urdu._id, math._id, sci._id, isl._id, pst._id, cs._id],
  //     classTeacher: teacher1._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "Grade 8",
  //     section: "A",
  //     room: "203",
  //     capacity: 45,
  //     subjects: [english._id, urdu._id, math._id, sci._id, isl._id, pst._id, cs._id],
  //     classTeacher: teacher2._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "Grade 9",
  //     section: "A",
  //     room: "301",
  //     capacity: 50,
  //     subjects: [english._id, urdu._id, math._id, phy._id, chem._id, bio._id, pst._id, isl._id, cs._id],
  //     classTeacher: teacher1._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "Grade 10",
  //     section: "A",
  //     room: "302",
  //     capacity: 50,
  //     subjects: [english._id, urdu._id, math._id, phy._id, chem._id, bio._id, pst._id, isl._id],
  //     classTeacher: teacher2._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "F.Sc Part 1",
  //     section: "A",
  //     room: "401",
  //     capacity: 55,
  //     subjects: [english._id, urdu._id, math._id, phy._id, chem._id, bio._id],
  //     classTeacher: teacher1._id,
  //     isActive: true,
  //   },
  //   {
  //     name: "F.Sc Part 2",
  //     section: "A",
  //     room: "402",
  //     capacity: 55,
  //     subjects: [english._id, urdu._id, math._id, phy._id, chem._id, bio._id],
  //     classTeacher: teacher2._id,
  //     isActive: true,
  //   },
  // ]);

  // const grade9 = classes.find((c) => c.name === "Grade 9");
  // const grade10 = classes.find((c) => c.name === "Grade 10");

  // console.log("✅ Classes Created");

  // const parent = await Parent.create({
  //   user: parentUser._id,
  //   occupation: "Businessman",
  //   cnic: "12345-3333333-3",
  //   address: "Pabbi, Nowshera",
  //   isActive: true,
  // });

  // console.log("✅ Parent Created");

  // const student1 = await Student.create({
  //   user: studentUser1._id,
  //   rollNumber: "09-A-01",
  //   admissionNo: "ADM-001",
  //   class: grade9._id,
  //   section: "A",
  //   fatherName: "Muhammad Rahim",
  //   motherName: "Fatima",
  //   dob: new Date("2010-05-10"),
  //   gender: "Male",
  //   religion: "Islam",
  //   nationality: "Pakistani",
  //   bForm: "12345-4444444-4",
  //   address: "Pabbi, Nowshera",
  //   parent: parent._id,
  //   bloodGroup: "B+",
  //   prevSchool: "CENNA Junior School",
  //   prevMarks: "85%",
  //   isActive: true,
  // });

  // const student2 = await Student.create({
  //   user: studentUser2._id,
  //   rollNumber: "10-A-01",
  //   admissionNo: "ADM-002",
  //   class: grade10._id,
  //   section: "A",
  //   fatherName: "Sajjad Khan",
  //   motherName: "Zainab",
  //   dob: new Date("2009-03-15"),
  //   gender: "Male",
  //   religion: "Islam",
  //   nationality: "Pakistani",
  //   bForm: "12345-5555555-5",
  //   address: "Nowshera",
  //   bloodGroup: "O+",
  //   prevSchool: "CENNA School",
  //   prevMarks: "88%",
  //   isActive: true,
  // });

  // console.log("✅ Students Created");

  // await Attendance.insertMany([
  //   {
  //     student: student1._id,
  //     class: grade9._id,
  //     date: new Date(),
  //     status: "present",
  //     markedBy: teacher1._id,
  //   },
  //   {
  //     student: student2._id,
  //     class: grade10._id,
  //     date: new Date(),
  //     status: "absent",
  //     markedBy: teacher2._id,
  //   },
  // ]);

  // console.log("✅ Attendance Created");

  // await Fee.insertMany([
  //   {
  //     student: student1._id,
  //     class: grade9._id,
  //     challanNo: "CH-001",
  //     month: "June",
  //     year: 2026,
  //     monthNum: 6,
  //     monthlyFee: 4500,
  //     admissionFee: 0,
  //     examFee: 500,
  //     lateFine: 0,
  //     discount: 0,
  //     totalAmount: 5000,
  //     paidAmount: 5000,
  //     status: "Paid",
  //     dueDate: new Date("2026-06-20"),
  //     paymentMethod: "Cash",
  //   },
  //   {
  //     student: student2._id,
  //     class: grade10._id,
  //     challanNo: "CH-002",
  //     month: "June",
  //     year: 2026,
  //     monthNum: 6,
  //     monthlyFee: 5000,
  //     admissionFee: 0,
  //     examFee: 500,
  //     lateFine: 200,
  //     discount: 0,
  //     totalAmount: 5700,
  //     paidAmount: 2000,
  //     status: "Partial",
  //     dueDate: new Date("2026-06-20"),
  //     paymentMethod: "Cash",
  //   },
  // ]);

  // console.log("✅ Fees Created");

  // await Result.insertMany([
  //   {
  //     student: student1._id,
  //     class: grade9._id,
  //     examType: "Monthly",
  //     session: "2026",
  //     examMonth: "June",
  //     marks: [
  //       {
  //         subject: math._id,
  //         maxMarks: 100,
  //         obtained: 86,
  //         grade: "A",
  //         isPassed: true,
  //       },
  //       {
  //         subject: english._id,
  //         maxMarks: 100,
  //         obtained: 78,
  //         grade: "B",
  //         isPassed: true,
  //       },
  //     ],
  //     totalMarks: 200,
  //     totalObtained: 164,
  //     percentage: 82,
  //     grade: "A",
  //     isPassed: true,
  //     position: 1,
  //     remarks: "Excellent performance.",
  //     enteredBy: teacher1._id,
  //   },
  //   {
  //     student: student2._id,
  //     class: grade10._id,
  //     examType: "Monthly",
  //     session: "2026",
  //     examMonth: "June",
  //     marks: [
  //       {
  //         subject: math._id,
  //         maxMarks: 100,
  //         obtained: 70,
  //         grade: "B",
  //         isPassed: true,
  //       },
  //       {
  //         subject: english._id,
  //         maxMarks: 100,
  //         obtained: 65,
  //         grade: "C",
  //         isPassed: true,
  //       },
  //     ],
  //     totalMarks: 200,
  //     totalObtained: 135,
  //     percentage: 67.5,
  //     grade: "B",
  //     isPassed: true,
  //     position: 2,
  //     remarks: "Good. Needs improvement.",
  //     enteredBy: teacher2._id,
  //   },
  // ]);

  // console.log("✅ Results Created");

  // await Timetable.insertMany([
  //   {
  //     classId: grade9._id,
  //     subjectId: math._id,
  //     teacherId: teacher1._id,
  //     day: "Monday",
  //     startTime: "08:00",
  //     endTime: "08:45",
  //     room: "301",
  //   },
  //   {
  //     classId: grade10._id,
  //     subjectId: english._id,
  //     teacherId: teacher2._id,
  //     day: "Tuesday",
  //     startTime: "09:00",
  //     endTime: "09:45",
  //     room: "302",
  //   },
  // ]);

  // console.log("✅ Timetable Created");

  // await Datesheet.insertMany([
  //   {
  //     classId: grade9._id,
  //     subjectId: math._id,
  //     examDate: new Date("2026-07-10"),
  //     startTime: "09:00",
  //     endTime: "12:00",
  //     room: "Hall A",
  //   },
  //   {
  //     classId: grade10._id,
  //     subjectId: english._id,
  //     examDate: new Date("2026-07-12"),
  //     startTime: "09:00",
  //     endTime: "12:00",
  //     room: "Hall B",
  //   },
  // ]);

  // console.log("✅ Datesheets Created");

  // await Notification.insertMany([
  //   {
  //     title: "School Reopening",
  //     message: "School will reopen from Monday.",
  //     audience: "all",
  //     createdBy: admin._id,
  //   },
  //   {
  //     title: "Fee Reminder",
  //     message: "Please submit pending fees before due date.",
  //     audience: "parents",
  //     createdBy: admin._id,
  //   },
  // ]);

  // console.log("✅ Notifications Created");

  // await News.insertMany([
  //   {
  //     title: "Annual Result Ceremony",
  //     content:
  //       "CENNA School successfully conducted its annual result ceremony. Outstanding students were awarded certificates and prizes for their excellent academic performance.",

  //     image: "/images/logo.jpg",
  //     isActive: true,
  //   },

  //   {
  //     title: "Sports Day Announcement",
  //     content:
  //       "The annual sports day will be held next month. Students are encouraged to participate in different sports competitions and activities.",

  //     image: "/images/logo.jpg",
  //     isActive: true,
  //   },

  //   {
  //     title: "New Computer Lab Inauguration",
  //     content:
  //       "A new state-of-the-art computer laboratory has been inaugurated to improve digital learning opportunities for students.",

  //     image: "/images/logo.jpg",
  //     isActive: true,
  //   },
  // ]);

  // console.log("✅ News Created");

  // await Gallery.insertMany([
  //   {
  //     title: "School Building",
  //     image: "/images/logo.jpg",
  //     category: "sports",
  //     isActive: true,
  //   },
  //   {
  //     title: "Students Activity",
  //     image: "/images/logo.jpg",
  //     category: "events",
  //     isActive: true,
  //   },
  // ]);

  // console.log("✅ Gallery Created");

  // const vacancy = await JobVacancy.create({
  //   title: "Mathematics Teacher",
  //   department: "Science",
  //   jobType: "Full-Time",
  //   seats: 2,
  //   qualification: "MSc Mathematics",
  //   experience: "2 Years",
  //   salary: "40000-60000",
  //   lastDate: new Date("2026-07-30"),
  //   description: "CENNA School requires an experienced Mathematics Teacher.",
  //   status: "active",
  //   createdBy: admin._id,
  // });

  // await JobApplication.create({
  //   vacancy: vacancy._id,
  //   position: "Mathematics Teacher",
  //   fullName: "Bilal Ahmad",
  //   fatherName: "Sardar Ahmad",
  //   cnic: "12345-9999999-9",
  //   phone: "03009999999",
  //   email: "bilal@example.com",
  //   address: "Peshawar",
  //   qualification: "MSc Mathematics",
  //   experience: "3 Years",
  //   expectedSalary: "50000",
  //   coverLetter: "I am interested in this position.",
  //   cv: "/uploads/sample-cv.pdf",
  //   status: "pending",
  // });

  // console.log("✅ Jobs Created");

  // await Alumni.insertMany([
  //   {
  //     fullName: "Usman Khan",
  //     fatherName: "Rahman Khan",
  //     admissionNo: "OLD-001",
  //     batch: "2018",
  //     passingYear: 2020,
  //     email: "usman@example.com",
  //     phone: "03001234567",
  //     cnic: "12345-7777777-7",
  //     profession: "Software Engineer",
  //     organization: "Tech Company",
  //     designation: "Developer",
  //     address: "Islamabad",
  //     city: "Islamabad",
  //     country: "Pakistan",
  //     linkedIn: "https://linkedin.com",
  //     status: "pending",
  //   },
  // ]);

  // console.log("✅ Alumni Created");

  const evaluationTemplateAuthor = await User.findOne({ role: "admin" });

  if (!evaluationTemplateAuthor) {
    throw new Error(
      "No admin user found in the database. Evaluation templates require an existing admin as createdBy."
    );
  }

  await EvaluationTemplate.create([
    {
      title: "Teacher Observation Form",

      description: "Teacher Classroom Observation Form",

      templateType: "teacher-observation",

      targetRoles: ["coordinator"],

      createdBy: evaluationTemplateAuthor._id,

      observerFields: [
        "Teacher Name",
        "Subject",
        "Topic",
        "Class",
        "Section",
        "Date"
      ],

      sections: [
        {
          title: "Professional Appearance & Personal Attributes",

          questions: [
            {
              question: "The teacher is neatly dressed and well-groomed.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher communicates politely and respectfully.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher uses an appropriate tone, pitch, and pace of voice.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher greets students warmly and creates a welcoming classroom atmosphere.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher demonstrates confident and positive body language.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher appears enthusiastic, energetic, and confident.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher maintains friendly and approachable relationships with students.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher demonstrates proficiency in Urdu and communicates clearly.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            }
          ]
        },

        {
          title: "Lesson Planning & Preparation",

          questions: [
            {
              question: "A written lesson plan is available.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The lesson plan includes clear learning objectives aligned with Student Learning Outcomes (SLOs).",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The lesson plan includes an introduction, lesson development, and conclusion.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Assessment activities/questions are included in the lesson plan.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher follows the lesson plan during instruction.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher prepares appropriate teaching and learning materials.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            }
          ]
        },

        {
          title: "Subject Knowledge & Instructional Delivery",

          questions: [
            {
              question: "The teacher demonstrates strong command of the subject matter.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The lesson begins with an engaging introduction.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher activates students' prior knowledge before introducing new concepts.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Learning objectives are clearly communicated to students.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Key concepts are explained clearly and accurately.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Real-life examples are used to enhance understanding.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Diagrams, charts, models, or visual aids are used appropriately.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher uses more than one instructional strategy during the lesson.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "English is used as the primary medium of instruction with supportive use of Urdu/local language when necessary.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher uses the writing board effectively.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Handwriting on the board is clear, legible, and well-organized.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher remains engaged with students while writing on the board.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher effectively links textbook content with classroom learning.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            }
          ]
        },
        {
          title: "Classroom Management & Learning Environment",
          questions: [
            {
              question: "Classroom rules and expectations are clearly maintained.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Student behaviour is managed positively and respectfully.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Classroom disruptions are handled effectively.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The lesson starts and ends on time.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The classroom is clean, organized, and conducive to learning.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Student attendance is checked regularly.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Student dress code is monitored appropriately.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Incomplete work and absentee follow-up are maintained.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Seating arrangements support effective learning.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Relevant teaching aids, charts, posters, or models are displayed.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Current students' work is displayed where appropriate.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            }
          ]
        },

        {
          title: "Student Engagement & Learning Support",
          questions: [
            {
              question: "The teacher encourages active participation from all students.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher knows students by name and interacts personally.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher maintains eye contact and monitors student engagement.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher asks higher-order and thought-provoking questions.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Students are encouraged to ask questions freely.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher responds to students' questions effectively.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Individual attention is provided to students when required.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Additional support is provided to struggling learners.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher promotes equal participation and inclusion.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher demonstrates respect, patience, and tolerance.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher moves around the classroom to monitor learning.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Appropriate energizers or engaging activities are used when needed.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            }
          ]
        },

        {
          title: "Teaching Strategies & Learning Activities",
          questions: [
            {
              question: "The lesson topic is clearly written on the board.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Learning activities are interesting, purposeful, and aligned with objectives.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher assigns challenging yet achievable tasks.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Multiple instructional strategies are used for classroom activities.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Students are engaged through activity-based learning rather than relying solely on traditional methods.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Additional teaching resources are used effectively where appropriate.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Students' notebooks/classwork are checked during the lesson.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            }
          ]
        },
        {
          title: "Assessment & Feedback",
          questions: [
            {
              question: "Questions are asked throughout the lesson to assess understanding.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Assessment techniques are aligned with lesson objectives.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Students receive immediate and constructive feedback.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher checks whether all students have achieved the lesson objectives.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Homework/classwork is meaningful and reinforces learning.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Students are encouraged to reflect on their own learning.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            }
          ]
        },

        {
          title: "Digital Integration (If Applicable)",
          questions: [
            {
              question: "Digital tools are used effectively to support learning.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Multimedia resources enhance student understanding.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "Students are appropriately engaged with educational technology.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            }
          ]
        },

        {
          title: "Professional Responsibilities",
          questions: [
            {
              question: "The teacher demonstrates professionalism throughout the lesson.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher follows school policies and procedures.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher maintains accurate classroom records where required.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            },
            {
              question: "The teacher demonstrates commitment to continuous professional development.",
              type: "mcq",
              options: [
                { text: "1" },
                { text: "2" },
                { text: "3" },
                { text: "4" }
              ]
            }
          ]
        }
      ],

      summary: [
        "Professional Appearance & Personal Attributes",
        "Lesson Planning & Preparation",
        "Subject Knowledge & Instructional Delivery",
        "Classroom Management & Learning Environment",
        "Student Engagement & Learning Support",
        "Teaching Strategies & Learning Activities",
        "Assessment & Feedback",
        "Digital Integration (If Applicable)",
        "Professional Responsibilities"
      ],

      ratingScale: [
        {
          level: "Needs Attention",
          percentage: "Below 50%",
          rating: "Needs Immediate Improvement"
        },
        {
          level: "Satisfactory",
          percentage: "51% - 65%",
          rating: "Needs Improvement"
        },
        {
          level: "Good",
          percentage: "66% - 80%",
          rating: "Good Practice"
        },
        {
          level: "Excellent",
          percentage: "Above 80%",
          rating: "Exemplary Practice"
        }
      ],

      signatures: [
        "Observer's Signature",
        "Teacher's Signature",
        "Date"
      ],

      pdf: {
        showTeacherInfo: true,
        showSerialNo: true,
        showRemarks: true,
        showSectionHeaders: true,
        showScoreColumns: true,
        scoreColumns: ["1", "2", "3", "4"],
        remarksColumn: true,
        showScoringSummary: true,
        showRatingTable: true,
        showSignatures: true
      }
    },
    // Teacher Evaluation by Student
    {
      title: "Teacher Evaluation by Student",
      description: "Teacher Evaluation Form Completed by Students",

      templateType: "student-observation",

      targetRoles: ["student"],

      createdBy: evaluationTemplateAuthor._id,

      observerFields: [
        "Student Name",
        "Admission No",
        "Class",
        "Section",
        "Teacher Name",
        "Subject",
        "Date"
      ],

      sections: [
        {
          title: "Professionalism & Punctuality",
          questions: [
            {
              question: "The teacher comes to class on time.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher is well-prepared for every lesson.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher completes the lesson within the allocated time.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher uses class time effectively.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher remains enthusiastic throughout the lesson.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            }
          ]
        },

        {
          title: "Teaching & Explanation",
          questions: [
            {
              question: "The teacher explains concepts clearly.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher gives examples that help me understand the lesson.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher relates lessons to everyday life.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher uses different teaching methods to make learning interesting.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher uses the whiteboard, charts, models, or multimedia effectively.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher's voice is clear and easy to understand.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher encourages me to think instead of memorizing only.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            }
          ]
        },

        {
          title: "Student Engagement",
          questions: [
            {
              question: "The teacher encourages all students to participate.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher asks interesting and thoughtful questions.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher gives every student an equal chance to answer.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher listens carefully to student opinions.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher encourages students to ask questions freely.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The classroom activities make learning enjoyable.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            }
          ]
        },
        {
          title: "Classroom Environment",
          questions: [
            {
              question: "The teacher maintains discipline respectfully.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "I feel comfortable expressing my ideas in this class.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher treats every student fairly.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher is respectful and polite towards students.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The classroom atmosphere is friendly and positive.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher motivates me to learn.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            }
          ]
        },

        {
          title: "Student Support",
          questions: [
            {
              question: "The teacher helps me when I have difficulty understanding.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher answers my questions patiently.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher encourages me to improve my performance.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher appreciates my efforts and achievements.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher gives me useful feedback on classwork and homework.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            }
          ]
        },

        {
          title: "Assessment & Homework",
          questions: [
            {
              question: "The teacher checks my homework regularly.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher develops tests and quizzes based on what she/he has taught.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher explains mistakes after assessments.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher checks notebooks regularly.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            }
          ]
        },
        {
          title: "Technology & Innovation",
          questions: [
            {
              question: "The teacher uses appropriate educational videos or digital resources.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "Technology helps me understand the lesson better.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "The teacher uses interesting activities instead of only lecturing.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            }
          ]
        },

        {
          title: "Overall Impression",
          questions: [
            {
              question: "I enjoy attending this teacher's class.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "I understand the lessons taught by this teacher.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "This teacher inspires me to learn more.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            },
            {
              question: "I would like this teacher to continue teaching my class.",
              type: "mcq",
              options: [{ text: "0" }, { text: "1" }, { text: "2" }]
            }
          ]
        },

        {
          title: "Open Ended Questions",
          questions: [
            {
              question: "What do you like most about this teacher?",
              type: "short-answer"
            },
            {
              question: "What should the teacher improve?",
              type: "short-answer"
            },
            {
              question: "Which teaching activity helps you learn the most?",
              type: "short-answer"
            },
            {
              question: "Any other suggestions?",
              type: "short-answer"
            }
          ]
        }
      ],

      summary: [
        "Professionalism & Punctuality",
        "Teaching & Explanation",
        "Student Engagement",
        "Classroom Environment",
        "Student Support",
        "Assessment & Homework",
        "Technology & Innovation",
        "Overall Impression"
      ],

      signatures: [
        "Student Signature",
        "Date"
      ],

      pdf: {
        showTeacherInfo: true,
        showStudentInfo: true,
        showSerialNo: true,
        showRemarks: false,
        showSectionHeaders: true,
        showScoreColumns: true,
        scoreColumns: ["0", "1", "2"],
        remarksColumn: false,
        showScoringSummary: true,
        showRatingTable: false,
        showSignatures: true
      }
    },
    // Teacher demo observation rubric
    {
      title: "Teacher Demo Observation Rubric",
      description: "Teacher Demo Observation Rubric (For Recruitment)",

      templateType: "teacher-demo",

      targetRoles: ["coordinator"],

      createdBy: evaluationTemplateAuthor._id,

      observerFields: [
        "Academic Qualification",
        "Name",
        "Subject in Master",
        "Professional Qualification",
        "Teaching Experience",
        "School Where He/She Taught",
        "Address & Phone No"
      ],

      sections: [
        {
          title: "Personality & Professional Presence",
          questions: [
            {
              question: "Well-groomed and professionally dressed.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Confident and enthusiastic.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Maintains positive body language.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Makes appropriate eye contact.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Greets students politely.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Shows a positive and friendly attitude.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            }
          ]
        },

        {
          title: "Communication Skills",
          questions: [
            {
              question: "Speaks clearly and confidently.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Uses correct language.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Pronunciation is clear.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Voice is audible and pleasant.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Gives clear instructions.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Communicates effectively with students.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            }
          ]
        },

        {
          title: "Subject Knowledge",
          questions: [
            {
              question: "Demonstrates sound subject knowledge.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Explains concepts accurately.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Uses relevant examples.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Answers students' questions confidently.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Relates the topic to daily life.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            }
          ]
        },
        {
          title: "Lesson Planning & Organization",
          questions: [
            {
              question: "Starts the lesson effectively.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "States the lesson objective clearly.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Presents ideas in a logical order.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Manages lesson time well.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Concludes the lesson effectively.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            }
          ]
        },

        {
          title: "Teaching Methodology",
          questions: [
            {
              question: "Explains concepts clearly.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Uses simple language.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Uses different teaching methods.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Uses examples and illustrations.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Encourages student participation.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Asks meaningful questions.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Checks students' understanding.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Connects new learning with prior knowledge.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            }
          ]
        },

        {
          title: "Classroom Management",
          questions: [
            {
              question: "Maintains classroom discipline.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Keeps students engaged.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Moves around the classroom.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Uses respectful behaviour.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Handles disruptions calmly.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            }
          ]
        },
        {
          title: "Student Engagement",
          questions: [
            {
              question: "Encourages all students to participate.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Invites students' questions.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Listens carefully to students.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Responds positively to answers.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Motivates students to learn.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            }
          ]
        },

        {
          title: "Assessment Skills",
          questions: [
            {
              question: "Asks questions during the lesson.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Checks students' understanding.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Provides constructive feedback.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Summarizes the lesson effectively.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            }
          ]
        },

        {
          title: "Use of Teaching Aids",
          questions: [
            {
              question: "Uses the board effectively.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Handwriting is clear and neat.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Uses teaching aids appropriately.",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            },
            {
              question: "Uses technology effectively (if available).",
              type: "mcq",
              options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }]
            }
          ]
        }
      ],

      summary: [
        "Personality & Professional Presence",
        "Communication Skills",
        "Subject Knowledge",
        "Lesson Planning & Organization",
        "Teaching Methodology",
        "Classroom Management",
        "Student Engagement",
        "Assessment Skills",
        "Use of Teaching Aids"
      ],

      finalDecision: true,

      signatures: [
        "Observer's Name & Signature",
        "Teacher's Signature",
        "Date"
      ],

      pdf: {
        showTeacherInfo: false,
        showObserverFields: true,
        showSerialNo: true,
        showRemarks: true,
        showSectionHeaders: true,
        showScoreColumns: true,
        scoreColumns: ["1", "2", "3", "4"],
        remarksColumn: true,
        showScoringSummary: true,
        showFinalDecision: true,
        showRatingTable: false,
        showSignatures: true
      }
    },
  ]);

  console.log("✅ Evaluation Templates Created");

  // console.log("\n══════════════════════════════");
  // console.log("TEST LOGIN DETAILS");
  // console.log("══════════════════════════════");
  // console.log("Admin: admin@cennaschool.edu.pk / Admin@123");
  // console.log("Teacher: teacher1@cenna.com / Teacher@123");
  // console.log("Student: student1@cenna.com / Student@123");
  // console.log("Parent: parent@cenna.com / Parent@123");
  // console.log("Accountant: accountant@cenna.com / Account@123");
  // console.log("══════════════════════════════\n");

  process.exit(0);
} catch (error) {
  console.error("❌ Seeder Error:", error);
  process.exit(1);
}