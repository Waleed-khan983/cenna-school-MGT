import nodemailer from 'nodemailer';

// ── Send Success Response ────────────────────────────
export const sendResponse = (res, statusCode, message, data = {}, meta = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...data,
    ...meta
  });
};

// ── Send Token Response (Login) ──────────────────────
export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar
    }
  });
};

// ── Calculate Grade ──────────────────────────────────
export const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

// ── Pagination Helper ────────────────────────────────
export const getPagination = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// ── Send Email ───────────────────────────────────────
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD }
    });
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to, subject, html, text
    });
    return true;
  } catch (err) {
    console.error('Email error:', err.message);
    return false;
  }
};

// ── Send SMS (stub — integrate your SMS gateway) ─────
export const sendSMS = async (phone, message) => {
  try {
    // Replace with your actual SMS API (e.g. SMSAPI.pk, Twilio)
    // Example for SMSAPI.pk:
    // const axios = require('axios');
    // await axios.post('https://api.smsapi.pk/send', {
    //   to: phone, message,
    //   api_key: process.env.SMS_API_KEY,
    //   sender_id: process.env.SMS_SENDER_ID
    // });
    console.log(`[SMS] To: ${phone} | Msg: ${message}`);
    return true;
  } catch (err) {
    console.error('SMS error:', err.message);
    return false;
  }
};

// ── Fee Due Alert ────────────────────────────────────
export const sendFeeAlert = async (parent, student, fee) => {
  const msg = `Dear Parent, this is a reminder that fee of Rs.${fee.totalAmount} for ${student.user?.name || 'your child'} is due on ${new Date(fee.dueDate).toDateString()}. Please pay on time. CENNA School Pabbi.`;
  if (parent.smsAlerts?.fees) {
    await sendSMS(parent.whatsapp || parent.user?.phone, msg);
  }
  if (parent.user?.email) {
    await sendEmail({
      to: parent.user.email,
      subject: 'Fee Reminder — CENNA School',
      html: `<p>${msg}</p>`
    });
  }
};

// ── Attendance Alert ─────────────────────────────────
export const sendAttendanceAlert = async (parent, student, date, status) => {
  if (!parent.smsAlerts?.attendance) return;
  const msg = `Dear Parent, ${student.user?.name || 'your child'} was marked ${status} on ${new Date(date).toDateString()}. CENNA School Pabbi.`;
  await sendSMS(parent.whatsapp || parent.user?.phone, msg);
};

// ── Generate Challan Number ───────────────────────────
export const generateChallanNo = () => {
  return `CHN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// ── Generate Receipt Number ───────────────────────────
export const generateReceiptNo = () => {
  return `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// ── Format Date ──────────────────────────────────────
export const formatDate = (date) => new Date(date).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });

// ── Get Month Name ────────────────────────────────────
export const getMonthName = (monthNum, year) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[monthNum - 1]} ${year}`;
};
