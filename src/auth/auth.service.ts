import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(email: string, password: string, companyCode: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    if (user.companyCode !== companyCode) {
      throw new BadRequestException('Invalid email, password, or company code');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password');
    }
    await this.sendMfa(user.id, email)

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        companyCode: user.companyCode,
      },
    };
  }

  async sendMfa(userId : string, email : string){
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString()
    try {
      await this.prisma.twoFactor.create({
        data: {
          User : {
            connect : { id : userId}
          },
          twoFactorCode,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
  
      const sendmfa = await resend.emails.send({
        from: 'Fvlcon <info@fvlcon.co>',
        to: [email],
        subject: 'Your 2FA Code',
        html: `<p>Your 2FA code is: <strong>${twoFactorCode}</strong></p>`,
      });
      console.log({twoFactorCode})
    } catch (err) {
      console.error('Error in MFA flow:', err);
      throw new Error('Error generating or sending 2FA code');
    }
  }
}
