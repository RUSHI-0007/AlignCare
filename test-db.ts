import { createServerClient } from '@supabase/ssr';
const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {} }
);
async function run() {
    const { data: appts, error: apptErr } = await supabase.from('appointments').select('*');
    console.log('Appointments:', appts, apptErr);
    const { data: patients, error: patErr } = await supabase.from('patients').select('*');
    console.log('Patients:', patients, patErr);
}
run();
