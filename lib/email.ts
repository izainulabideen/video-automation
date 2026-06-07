import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM = `Veank Content OS <${process.env.SMTP_USER}>`
const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${BASE}/auth/reset-password?token=${token}`
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Reset your Veank Content OS password',
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${url}">Click here to reset your password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    `,
  })
}

export async function sendInviteEmail(email: string, token: string, inviterName: string) {
  const url = `${BASE}/auth/accept-invite?token=${token}`
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `${inviterName} invited you to Veank Content OS`,
    html: `
      <p>${inviterName} has invited you to join Veank Content OS.</p>
      <p><a href="${url}">Accept invitation and set your password</a></p>
      <p>This link expires in 48 hours.</p>
    `,
  })
}
