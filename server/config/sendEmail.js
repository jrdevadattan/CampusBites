import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.RESEND_API){
    console.log("Provide RESEND_API in side the .env file")
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async({sendTo, subject, html })=>{
    try {
        const fromAddress = process.env.RESEND_FROM || 'onboarding@resend.dev'
        const { data, error } = await resend.emails.send({
            from: `CampusBites <${fromAddress}>`,
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            // Bubble up so controllers can act on it
            throw new Error(error?.message || 'Email send failed')
        }

        return data
    } catch (error) {
        // Re-throw to let the caller handle
        throw error
    }
}

export default sendEmail

