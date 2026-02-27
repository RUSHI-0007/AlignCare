require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    console.log("Checking patients...");
    const { data: patients, error: pErr } = await supabase.from('patients').select('*');
    if (pErr) console.error("Patients Error:", pErr);
    else console.log("Patients:", patients);

    console.log("Checking appointments...");
    const { data: appts, error: aErr } = await supabase.from('appointments').select('*');
    if (aErr) console.error("Appts Error:", aErr);
    else console.log("Appointments:", appts);

    console.log("Attempting a test insertion...");
    const { data: p, error: p_e } = await supabase.from('patients').upsert(
        { phone: '123-ui-test-456', full_name: 'Console Test' },
        { onConflict: 'phone', ignoreDuplicates: false }
    ).select('id').single();

    console.log('Patient insert:', p, p_e);

    if (p) {
        const { data: a, error: a_e } = await supabase.from('appointments').insert({
            patient_id: p.id,
            service_type: 'PHYSIOTHERAPY',
            visit_type: 'CLINIC',
            appointment_date: '2026-03-01',
            appointment_time: '15:00',
            shift: 'EVENING',
            status: 'CONFIRMED',
            created_by: 'PATIENT'
        }).select('id').single();
        console.log('Appt insert:', a, a_e);
    }
}
run();
