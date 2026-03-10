import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, company, phone, revenue, message, source } = body;

    if (!name || !email || !company) {
      return NextResponse.json({ error: 'Name, email, and company are required' }, { status: 400 });
    }

    const lead = {
      id: `l_${Date.now()}`,
      name,
      email,
      phone: phone || '',
      company,
      source: source === 'chatbot' ? 'chatbot' : 'form',
      status: 'new',
      revenue: revenue || '',
      notes: message || '',
      createdAt: new Date().toISOString(),
    };

    // TODO: Store in Supabase when connected
    console.log(`--- NEW ${lead.source.toUpperCase()} LEAD ---`);
    console.log(JSON.stringify(lead, null, 2));

    return NextResponse.json({ success: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
