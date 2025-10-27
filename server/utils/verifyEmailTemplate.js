const verifyEmailTemplate = ({ name, otp }) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb; text-align: center;">Welcome to CampusBites!</h2>
        
        <p>Dear ${name},</p>
        
        <p>Thank you for registering with CampusBites.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #1f2937; margin-bottom: 10px;">Verify Your Email</h3>
            <p style="font-size: 18px; margin-bottom: 15px;">Your verification code is:</p>
            <h1 style="font-size: 36px; color: #059669; letter-spacing: 8px; margin: 0; font-weight: bold;">
                ${otp}
            </h1>
        </div>
        
        <p>This code will expire in 24 hours.</p>
        <p>If you didn't create an account with CampusBites, please ignore this email.</p>
        
        <hr style="margin: 30px 0; border: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Best regards,<br>
            CampusBites Team
        </p>
    </div>
    `
}

export default verifyEmailTemplate