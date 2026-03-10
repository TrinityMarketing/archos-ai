export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, company, phone, revenue, message, source } = req.body;

    if (!name || !email || !company) {
      return res.status(400).json({ error: 'Name, email, and company are required' });
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

    return res.status(200).json({ success: true, id: lead.id });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
