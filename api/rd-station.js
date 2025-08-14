export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nome, email, celular, cargo, tamanhoEmpresa } = req.body;
    
    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome and email are required' });
    }

    // Simulate successful response for now
    res.status(200).json({
      success: true,
      message: 'Lead received successfully',
      data: { nome, email, celular, cargo, tamanhoEmpresa }
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
