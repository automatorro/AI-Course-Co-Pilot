
const SUPABASE_URL = 'https://kyoxcpyrqlbsychviulm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5b3hjcHlycWxic3ljaHZpdWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MjU5NzYsImV4cCI6MjA3NzUwMTk3Nn0.dcBoQe3oyB8gUnUIf1ndz5NPgyV_YlLPq67A5SARlCQ';

async function testConnection() {
  console.log('Testing connection to Edge Function...');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-course-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ action: 'test_connection' })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Error: ${response.status} ${response.statusText}`);
      console.error(text);
      return;
    }

    const data = await response.json();
    console.log('Connection Result:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testConnection();
