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

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    if (!email) {
        throw new Error('عنوان البريد الإلكتروني مطلوب');
    }

    try {
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM'),
            to: email,
            subject: 'رمز التحقق الخاص بك',
            text: `رمز التحقق الخاص بك هو: ${otp}`,
            html: `
                <div dir="rtl">
                    <h2>رمز التحقق</h2>
                    <p>رمز التحقق الخاص بك هو: <strong>${otp}</strong></p>
                    <p>صلاحية الرمز: 10 دقائق</p>
                </div>
            `
        };

        await this.transporter.sendMail(mailOptions);
    } catch (error) {
        this.logger.error('فشل إرسال البريد:', error);
        throw new Error('فشل إرسال رمز التحقق عبر البريد');
    }
}
}