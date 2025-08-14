const { useState } = require('react');
const Head = require('next/head').default;

function Home() {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testApiRoute = async (endpoint) => {
    setIsLoading(true);
    setTestResult('Testing...');
    
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Test prompt for Gemini API',
          nome: 'Test User',
          email: 'test@example.com',
          celular: '11999999999',
          cargo: 'Developer',
          tamanhoEmpresa: '11-50'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTestResult(`✅ Success! Response: ${JSON.stringify(data, null, 2)}`);
      } else {
        setTestResult(`❌ Error (${response.status}): ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setTestResult(`❌ Exception: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Head>
        <title>API Test Page</title>
        <meta name="description" content="Test page for API routes" />
      </Head>

      <h1>API Route Tester</h1>
      
      <div style={{ margin: '2rem 0' }}>
        <h2>Test Gemini API</h2>
        <button 
          onClick={() => testApiRoute('gemini')}
          disabled={isLoading}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isLoading ? 'Testing...' : 'Test /api/gemini'}
        </button>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <h2>Test RD Station API</h2>
        <button 
          onClick={() => testApiRoute('rd-station')}
          disabled={isLoading}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isLoading ? 'Testing...' : 'Test /api/rd-station'}
        </button>
      </div>

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        minHeight: '100px'
      }}>
        <h3>Test Results:</h3>
        {testResult || 'No test run yet. Click a button above to test an API route.'}
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        <h3>Environment Variables:</h3>
        <ul>
          <li>NODE_ENV: {process.env.NODE_ENV}</li>
          <li>GEMINI_API_KEY: {process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set'}</li>
          <li>RD_STATION_PUBLIC_TOKEN: {process.env.RD_STATION_PUBLIC_TOKEN ? '✅ Set' : '❌ Not set'}</li>
          <li>RD_STATION_PRIVATE_TOKEN: {process.env.RD_STATION_PRIVATE_TOKEN ? '✅ Set' : '❌ Not set'}</li>
          <li>RD_STATION_INSTANCE_TOKEN: {process.env.RD_STATION_INSTANCE_TOKEN ? '✅ Set' : '❌ Not set'}</li>
        </ul>
      </div>
    </div>
  );
}

module.exports = Home;
