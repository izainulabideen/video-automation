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

const FROM = `Veank Studio <${process.env.SMTP_USER}>`
const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${BASE}/auth/reset-password?token=${token}`
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Reset your Veank Studio password',
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${url}">Click here to reset your password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    `,
  })
}

export async function sendCommentNotification(
  toEmail: string,
  commenterName: string,
  scenarioTitle: string,
  scenarioId: string,
  commentBody: string
) {
  const url = `${BASE}/scenarios/${scenarioId}`
  await transporter.sendMail({
    from: FROM,
    to: toEmail,
    subject: `${commenterName} commented on "${scenarioTitle}"`,
    html: `
      <p><strong>${commenterName}</strong> left a comment on <strong>${scenarioTitle}</strong>:</p>
      <blockquote style="border-left:3px solid #C8922A;padding-left:12px;color:#666;">${commentBody}</blockquote>
      <p><a href="${url}">View scenario →</a></p>
    `,
  }).catch(() => {/* silent — notifications are best-effort */})
}

export async function sendAssignmentNotification(
  toEmail: string,
  assignerName: string,
  scenarioTitle: string,
  scenarioId: string
) {
  const url = `${BASE}/scenarios/${scenarioId}`
  await transporter.sendMail({
    from: FROM,
    to: toEmail,
    subject: `You've been assigned to "${scenarioTitle}"`,
    html: `
      <p><strong>${assignerName}</strong> assigned you to <strong>${scenarioTitle}</strong>.</p>
      <p><a href="${url}">Open scenario →</a></p>
    `,
  }).catch(() => {/* silent */})
}

export async function sendPublishNotification(toEmails: string[], scenarioTitle: string, scenarioId: string) {
  const url = `${BASE}/watch/${scenarioId}`
  for (const email of toEmails) {
    await transporter.sendMail({
      from: FROM, to: email,
      subject: `"${scenarioTitle}" is now live`,
      html: `<p>Your story <strong>${scenarioTitle}</strong> has been published and is now live.</p><p><a href="${url}">Watch it →</a></p>`,
    }).catch(() => {})
  }
}

export async function sendInviteEmail(email: string, token: string, inviterName: string) {
  const url = `${BASE}/auth/accept-invite?token=${token}`
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `${inviterName} invited you to Veank Studio`,
    html: `
      <p>${inviterName} has invited you to join Veank Studio.</p>
      <p><a href="${url}">Accept invitation and set your password</a></p>
      <p>This link expires in 48 hours.</p>
    `,
  })
}
