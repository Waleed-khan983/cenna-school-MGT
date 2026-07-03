// This file re-exports all route modules from _academicRoutes.js
// Each is already imported in server.js individually

import { teacherRouter, parentRouter, classRouter, subjectRouter, attendanceRouter, resultRouter, feeRouter } from './_academicRoutes';

export default { teacherRouter, parentRouter, classRouter, subjectRouter, attendanceRouter, resultRouter, feeRouter };
