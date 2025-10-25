import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.RESEND_API){
    console.log("Provide RESEND_API in side the .env file")
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async({sendTo, subject, html })=>{
    const isDev = process.env.NODE_ENV !== 'production'
    const fromAddress = process.env.RESEND_FROM || 'onboarding@resend.dev'
    const allowedTestEmail = process.env.ALLOWED_TEST_EMAIL || 'rethuarts@gmail.com'
    const emailDisabled = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true'
    const enforceTestOnly = String(process.env.RESEND_ENFORCE_TEST || '').toLowerCase() === 'true'

    try {
        // In development: optionally skip emails entirely or restrict to a single allowed recipient
        if (isDev) {
            if (emailDisabled) {
                console.warn(`[email] Skipped (EMAIL_DISABLED=true): to=${sendTo}, subject="${subject}"`)
                return { id: 'mock-dev-disabled' }
            }
            if (enforceTestOnly && Array.isArray(sendTo)) {
                const allAllowed = sendTo.every(r => String(r).toLowerCase() === String(allowedTestEmail).toLowerCase())
                if (!allAllowed) {
                    console.warn(`[email] Skipped (dev enforce test): to=${sendTo}, allowed=${allowedTestEmail}`)
                    return { id: 'mock-dev-enforced' }
                }
            }
            if (enforceTestOnly && typeof sendTo === 'string') {
                const allowed = String(sendTo).toLowerCase() === String(allowedTestEmail).toLowerCase()
                if (!allowed) {
                    console.warn(`[email] Skipped (dev enforce test): to=${sendTo}, allowed=${allowedTestEmail}`)
                    return { id: 'mock-dev-enforced' }
                }
            }
        }

        const { data, error } = await resend.emails.send({
            from: `CampusBites <${fromAddress}>`,
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            // In dev, do not block flows — log and return mock
            if (isDev) {
                console.warn(`[email] Dev soft-fail: ${error?.message || error}`)
                return { id: 'mock-dev-softfail' }
            }
            // In prod, bubble up
            throw new Error(error?.message || 'Email send failed')
        }

        return data
    } catch (error) {
        // In dev, never block registration/flows due to email errors
        if (isDev) {
            console.warn(`[email] Dev exception soft-fail: ${error?.message || error}`)
            return { id: 'mock-dev-exception' }
        }
        // Re-throw to let the caller handle in production
        throw error
    }
}

export default sendEmail

