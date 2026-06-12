import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Fix for Node container environments
dns.setDefaultResultOrder && dns.setDefaultResultOrder("ipv4first");

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // API Route: Send Email Notification
  app.post("/api/send-email", async (req, res) => {
    const { 
      id, name, phone, apartmentName, dong, ho, pyeong, bookingDate, bookingTime, memo, createdAt 
    } = req.body;

    const adminEmail = process.env.ADMIN_RECEIVER_EMAIL || "dwa5040@gmail.com";
    const resendApiKey = process.env.RESEND_API_KEY;

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const formattedDate = createdAt ? new Date(createdAt).toLocaleString('ko-KR', { hour12: false }) : new Date().toLocaleString('ko-KR', { hour12: false });

    // HTML Email Template matching IS마이홈 Design Language
    const emailHtml = `
      <div style="font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 800; tracking-tight;">🏠 [IS마이홈] 신규 사전점검 예약 신청</h2>
          <p style="color: #64748b; margin: 6px 0 0; font-size: 13px; font-weight: 500;">새로운 온라인 실시간 예약 신청이 접수되었습니다.</p>
        </div>

        <!-- Summary Statistics Card -->
        <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold; width: 120px;">예약번호</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #011627; font-weight: bold; font-family: monospace;">${id || "미지정"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">신청고객</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 800; font-size: 15px;">${name || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">연락처</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #d97706; font-weight: bold;">
                <a href="tel:${phone}" style="color: #d97706; text-decoration: none;">${phone || "-"}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">대상 아파트</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: bold;">${apartmentName || "-"} (${dong || "-"}동 ${ho || "-"}호)</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">공급 평형</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0284c7; font-weight: bold;">${pyeong || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">희망 미팅 시간</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #10b981; font-weight: 800;">📅 ${bookingDate || "-"} / ⏰ ${bookingTime || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-weight: bold; vertical-align: top;">고객 요청사항</td>
              <td style="padding: 10px 0; color: #334155; line-height: 1.5; font-style: italic;">${memo || "특이사항 없음"}</td>
            </tr>
          </table>
        </div>

        <!-- Footer Info -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">예약 접수 일시: ${formattedDate}</p>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0;">본 메일은 IS마이홈 온라인 실시간 통합 시스템에서 자동 발송되는 알림입니다.</p>
        </div>
      </div>
    `;

    console.log(`[Email Service] Attempting to send notification email for Booking ${id || "new"}`);

    // Track state to respond intelligently to UI
    let emailSent = false;
    let methodUsed = "";
    let systemError = "";

    try {
      if (resendApiKey && resendApiKey !== "MY_RESEND_API_KEY") {
        // Method 1: Send via Resend REST API (No packages needed)
        methodUsed = "Resend API";
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "IS마이홈 <onboarding@resend.dev>",
            to: adminEmail,
            subject: `[IS마이홈] ${name || "고객"}님의 사전점검 온라인 예약이 접수되었습니다!`,
            html: emailHtml
          })
        });

        if (response.ok) {
          emailSent = true;
        } else {
          const errData = await response.json();
          systemError = `Resend Error: ${JSON.stringify(errData)}`;
          console.error(`[Email Service] Resend API failure:`, errData);
        }
      } else if (smtpHost && smtpUser && smtpPass) {
        // Method 2: Send via Nodemailer (SMTP)
        methodUsed = "SMTP Transport";
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        await transporter.sendMail({
          from: `"IS마이홈" <${smtpUser}>`,
          to: adminEmail,
          subject: `[IS마이홈] ${name || "고객"}님의 사전점검 온라인 예약이 접수되었습니다!`,
          html: emailHtml
        });

        emailSent = true;
      } else {
        // No configuration - Fallback to mock/log mode
        methodUsed = "Console Logging fallback";
        console.warn(`[Email Service] Warning: email config keys not setup! See .env.example.`);
        console.log(`===============================================`);
        console.log(`[EMAIL NOTIFICATION TO: ${adminEmail}]`);
        console.log(`- 예약자명: ${name}`);
        console.log(`- 전화번호: ${phone}`);
        console.log(`- 주소: ${apartmentName} ${dong}동 ${ho}호`);
        console.log(`- 일시: ${bookingDate} ${bookingTime}`);
        console.log(`===============================================`);
        emailSent = false;
      }
    } catch (err: any) {
      systemError = err.message || JSON.stringify(err);
      console.error(`[Email Service] Critical send failure via ${methodUsed}:`, err);
    }

    if (emailSent) {
      console.log(`[Email Service] Success! Notification email sent to ${adminEmail} using ${methodUsed}`);
      return res.json({ 
        success: true, 
        message: "이메일 알림 전송이 성공적으로 완료되었습니다.", 
        method: methodUsed 
      });
    } else {
      return res.json({
        success: false,
        message: "예약은 성공하였으나 이메일 알림 발송은 대기 중입니다. 관리자 대시보드에서 환경 설정(RESEND_API_KEY 또는 SMTP)을 적용해주세요.",
        method: methodUsed || "None (unconfigured)",
        reason: systemError || "인증 키 누락"
      });
    }
  });

  // Serve static assets / Vite files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
