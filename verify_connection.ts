
const SUPABASE_URL = "https://kyoxcpyrqlbsychviulm.supabase.co/functions/v1/generate-course-content";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5b3hjcHlycWxic3ljaHZpdWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MjU5NzYsImV4cCI6MjA3NzUwMTk3Nn0.dcBoQe3oyB8gUnUIf1ndz5NPgyV_YlLPq67A5SARlCQ";

async function verify() {
  console.log("Verifying connection to:", SUPABASE_URL);
  try {
    const res = await fetch(SUPABASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ANON_KEY}`
      },
      body: JSON.stringify({ action: "test_connection" })
    });

    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (e) {
    console.error("Error:", e);
  }
}

verify();
