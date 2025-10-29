import { NextResponse } from 'next/server';

type Body = {
  name: string;
  email: string;
  message: string;
};

export async function POST(request: Request) {
  try {
    const body: Body = await request.json();
    const sendgridKey = process.env.SENDGRID_API_KEY;
    
    if (!sendgridKey) {
      return NextResponse.json({ 
        ok: false, 
        error: 'SendGrid API key not configured' 
      }, { status: 500 });
    }

    const to = process.env.TO_EMAIL || 'technosoftlogiclabs@gmail.com';
    const from = process.env.FROM_EMAIL || 'no-reply@example.com';

    const payload = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from },
      subject: `Website contact from ${body.name}`,
      content: [
        {
          type: 'text/plain',
          value: `Name: ${body.name}\nEmail: ${body.email}\n\n${body.message}`,
        },
        {
          type: 'text/html',
          value: `<p><strong>Name:</strong> ${body.name}</p><p><strong>Email:</strong> ${body.email}</p><p>${body.message}</p>`,
        },
      ],
    };

    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sendgridKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('SendGrid error', res.status, text);
      return NextResponse.json({ 
        ok: false, 
        error: `Failed to send email: ${text}` 
      }, { status: 502 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Email sent successfully' 
    });
  } catch (err: any) {
    console.error('Mail send error:', err);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to send email' 
    }, { status: 500 });
  }
}