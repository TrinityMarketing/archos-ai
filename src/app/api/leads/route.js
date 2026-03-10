import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, company, phone, revenue, message, source, role, interest, timeline, score, priority, conversationMessages } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    if (!supabase) {
      console.warn('Supabase not configured — lead not saved');
      return NextResponse.json({ success: true, id: null, warning: 'Database not configured' });
    }

    // Insert lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        phone: phone || null,
        company: company || null,
        role: role || null,
        revenue: revenue || null,
        interest: interest || null,
        timeline: timeline || null,
        message: message || null,
        source: source === 'chatbot' ? 'chatbot' : 'form',
        score: score || 0,
        priority: priority || 'medium',
      })
      .select('id')
      .single();

    if (leadError) {
      console.error('Lead insert error:', leadError);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    // If chatbot conversation, save conversation too
    if (source === 'chatbot' && conversationMessages?.length) {
      const { error: convoError } = await supabase
        .from('conversations')
        .insert({
          lead_id: lead.id,
          visitor_name: name,
          visitor_email: email,
          status: 'completed',
          messages: conversationMessages,
          score: score || 0,
          ended_at: new Date().toISOString(),
        });

      if (convoError) {
        console.error('Conversation insert error:', convoError);
      }
    }

    return NextResponse.json({ success: true, id: lead.id });
  } catch (err) {
    console.error('Lead API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
