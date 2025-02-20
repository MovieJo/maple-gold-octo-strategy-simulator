import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_URL = "https://hueurevwlzphqyxgtqnx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1ZXVyZXZ3bHpwaHF5eGd0cW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNjI4OTUsImV4cCI6MjA1NTYzODg5NX0.lzwfS_bMSXPSHbY1U5Laaap4Y-C_wdcY-iL4dKj7KNM";

const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);

function App() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    getStats();
  }, []);

  async function getStats() {
    const { data } = await supabase.from("stats").select();
    setStats(data);
  }

  return (
    <div>
      <ul>
        {stats.map((stat) => (
          <li key={stat.id}>stat</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
