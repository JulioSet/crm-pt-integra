import nodemailer from "nodemailer";

export const sendEmail = async (to: string, text: string) => {
   try {
      const transporter = nodemailer.createTransport({
         host: "smtp.gmail.com",
         port: 587,
         secure: false, // true for port 465, false for other ports
         auth: {
            user: process.env.NODEMAIL_EMAIL, // Your Gmail
            pass: process.env.NODEMAIL_PW, // Your Gmail App Password
         },
      });

      await transporter.sendMail({
         from: `"Integra" <your@email.com>`,
         to,
         subject: "Reminder Notification",
         text,
      });

      return { success: true, message: "Email sent!" };
   } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, message: "Failed to send email." };
   }
};
