export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { 
      id, name, phone, apartmentName, dong, ho, pyeong, bookingDate, bookingTime, memo, createdAt 
    } = await req.json();

    const adminEmail = process.env.ADMIN_RECEIVER_EMAIL || "dwa5040@gmail.com";
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "이메일 전송 API 키가 설정되지 않았습니다 (Netlify 환경 변수 RESEND_API_KEY 누락)." 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const formattedDate = createdAt 
      ? new Date(createdAt).toLocaleString('ko-KR', { hour12: false }) 
      : new Date().toLocaleString('ko-KR', { hour12: false });

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
      return new Response(JSON.stringify({ 
        success: true, 
        message: "이메일 알림 전송이 성공적으로 완료되었습니다." 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      const errData = await response.json();
      return new Response(JSON.stringify({ 
        success: false, 
        message: "이메일 API 전송에 실패하였습니다.", 
        reason: JSON.stringify(errData) 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: err.message || "서버 내부 오류" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
