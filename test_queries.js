const { createClient } = require('./node_modules/@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
    // 1. Replicate getTodayIST()
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + istOffset);
    const todayStr = istDate.toISOString().split('T')[0];

    console.log('[DEBUG] Calculated todayStr:', todayStr);

    // 2. Replicate the Timeline Query exactly (from getAppointmentsForDateAction)
    const { data: timelineData, error: timelineErr } = await supabase
        .from('appointments')
        .select(`
            id, appointment_time, status, service_type, visit_type,
            patients ( full_name, phone )
        `)
        .eq('appointment_date', todayStr)
        .not('status', 'eq', 'CANCELLED')
        .order('appointment_time', { ascending: true });

    console.log('[DEBUG] Timeline returned count:', timelineData?.length, 'Error:', timelineErr);

    // 3. Replicate the Data Table Query exactly (from appointments/page.tsx)
    const { data: tableData, error: tableErr } = await supabase
        .from('appointments')
        .select(`
            id, appointment_date, appointment_time, status, service_type, visit_type,
            patients!inner ( full_name, phone )
        `)
        .gte('appointment_date', todayStr)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(50);

    console.log('[DEBUG] Data Table returned count:', tableData?.length, 'Error:', tableErr);

    // Print the first row if available
    if (tableData?.length) console.log('[DEBUG] First Row:', JSON.stringify(tableData[0], null, 2));
}

testFetch();
