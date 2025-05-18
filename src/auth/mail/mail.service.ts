import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

 async sendOtpEmail(email: string, otp: string | number): Promise<void> {
  if (!email) {
    throw new Error('عنوان البريد الإلكتروني مطلوب');
  }

  const otpStr = String(otp);

  const htmlContent = `
  <div dir="ltr" style="font-family: 'Arial', sans-serif; background-color: #f7f7f7; padding: 0; margin: 0;">
    <div style="background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%); padding: 20px 0; text-align: center;">
      <h2 style="color: white; margin: 0;">Account Verification</h2>
    </div>

    <div style="padding: 30px; background-color: white; max-width: 600px; margin: auto; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); animation: fadeIn 0.8s ease-in-out;">
      <p style="font-size: 16px;">Hello,</p>
      <p style="font-size: 15px; color: #555;">
        We received a request to verify your account. Please use the following code to complete the process:
      </p>

      <div style="display: flex; justify-content: center; gap: 10px; margin: 30px 0;">
        ${otpStr.split('').map(char => `
          <div style=" width: 50px; height: 50px; background: #f2f2f2; border: 2px solid #ccc; border-radius: 8px; font-size: 24px; line-height: 50px; text-align: center; font-weight: bold; color: #333;">
            ${char}
          </div>
        `).join('')}
      </div>

      <div style="background-color: #fff3cd; color: #856404; padding: 10px 15px; border-radius: 6px; font-size: 14px; text-align: center;">
        This code will expire in 10 minutes
      </div>

      <p style="font-size: 13px; color: #777; margin-top: 20px;">
        If you did not request this code, please ignore this email or contact technical support.
      </p>
    </div>

    <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
      © 2025 All rights reserved
    </p>

    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  </div>
`;


  try {
    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'رمز التحقق الخاص بك',
      html: htmlContent,
    });
  } catch (error) {
    this.logger.error('فشل إرسال البريد:', error);
    throw new Error('فشل إرسال رمز التحقق عبر البريد');
  }
}

}