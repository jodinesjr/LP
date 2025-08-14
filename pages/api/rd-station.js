// Import fetch for Node.js environment
const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  // Configurar CORS
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'https://lp-jodinesjr.vercel.app',
    'https://lp-git-main-jodinesjr.vercel.app',
    'https://lp.vercel.app',
    'https://calculadora-eta-umber.vercel.app'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nome, email, celular, cargo, tamanhoEmpresa } = req.body;

    // Basic validation
    if (!nome || !email || !celular) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['nome', 'email', 'celular']
      });
    }

    // Get RD Station tokens from environment variables
    const RD_PUBLIC_TOKEN = process.env.RD_STATION_PUBLIC_TOKEN;
    const RD_PRIVATE_TOKEN = process.env.RD_STATION_PRIVATE_TOKEN;
    const RD_INSTANCE_TOKEN = process.env.RD_STATION_INSTANCE_TOKEN;

    if (!RD_PUBLIC_TOKEN || !RD_PRIVATE_TOKEN || !RD_INSTANCE_TOKEN) {
      console.error('RD Station tokens not configured');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'RD Station tokens not configured'
      });
    }

    // Prepare the lead data for RD Station
    const leadData = {
      event_type: 'CONVERSION',
      event_family: 'CDP',
      payload: {
        conversion_identifier: 'formulario-calculadora',
        name: nome,
        email: email,
        personal_phone: celular,
        job_title: cargo || '',
        company_size: tamanhoEmpresa || '',
        cf_utm_source: 'calculadora-harpia',
        cf_utm_medium: 'landing-page',
        cf_utm_campaign: 'harpia-calculator',
        cf_landing_page: 'https://calculadora-eta-umber.vercel.app',
        cf_form_origin: 'harpia-calculator',
        traffic_source: 'direct',
        traffic_medium: 'form',
        traffic_campaign: 'harpia-calculator',
        traffic_value: 'calculadora-harpia',
        tags: ['calculadora-harpia', 'lead-calculator']
      }
    };

    console.log('Sending to RD Station:', leadData);

    // Send to RD Station
    const response = await fetch('https://api.rd.services/platform/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RD_PUBLIC_TOKEN}`,
        'x-instance-id': RD_INSTANCE_TOKEN
      },
      body: JSON.stringify(leadData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('RD Station API error:', result);
      return res.status(response.status).json({
        error: 'Error sending to RD Station',
        details: result
      });
    }

    // Success
    res.status(200).json({
      success: true,
      message: 'Lead sent to RD Station successfully',
      data: result
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}
