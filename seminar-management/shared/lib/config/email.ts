import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false,
});

// export const sendEmail = async ({ to, subject, text }) => {
//   await transporter.sendMail({
//     from: '"Test" <test@example.com>',
//     to,
//     subject,
//     text,
//   });
//   console.log('Email sent to:', to);
// };

export const sendAssignmentEmail = async (trainerEmail: string, courseDetails: any) => {
  const { name, date, location, subject } = courseDetails;

  const mailOptions = {
    from: '"Training Management" <noreply@example.com>',
    to: trainerEmail,
    subject: 'You have been assigned to a course',
    text: `Hello,\n\nYou have been assigned to the following course:\n\nName: ${name}\nDate: ${date}\nLocation: ${location}\nSubject: ${subject}\n\nThank you.`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${trainerEmail}`);
};