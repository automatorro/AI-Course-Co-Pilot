import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CourseStep, GenerationEnvironment } from '../types';
import { deleteCourseById } from '../services/courseService';

type LogEntry = { level: 'info' | 'warn' | 'error'; message: string };

const RlsTestPage: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [busy, setBusy] = useState(false);

  const log = (level: LogEntry['level'], message: string) => {
    setLogs(prev => [...prev, { level, message }]);
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    fn(`[RLS Test] ${message}`);
  };

  const clearLogs = () => setLogs([]);

  const verifyQueryCriteria = async () => {
    if (!user) return;
    setBusy(true);
    clearLogs();
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, user_id, title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) {
        log('error', `Eroare la interogarea cursurilor: ${error.message}`);
        return;
      }
      log('info', `Cursuri găsite pentru user ${user.id}: ${data?.length || 0}`);
      (data || []).forEach((c: any) => {
        log('info', `Course ${c.id} user_id=${c.user_id} title=${c.title}`);
      });
      if (data && data[0]) {
        const { data: byId, error: byIdError } = await supabase
          .from('courses')
          .select('id, user_id, title')
          .eq('id', data[0].id)
          .eq('user_id', user.id)
          .maybeSingle();
        if (byIdError) {
          log('error', `Verificare după id + user_id a eșuat: ${byIdError.message}`);
        } else {
          log('info', `Verificare id+user_id OK: ${byId ? byId.id : 'no record'}`);
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const testTransactionalDelete = async () => {
    if (!user) return;
    setBusy(true);
    clearLogs();
    try {
      // Creează curs de test
      const { data: newCourse, error: createErr } = await supabase
        .from('courses')
        .insert({
          user_id: user.id,
          title: 'TEST DELETE COURSE',
          subject: 'Testing',
          target_audience: 'QA',
          environment: GenerationEnvironment.Corporate,
          language: 'ro',
          progress: 0,
        })
        .select('*')
        .single();
      if (createErr || !newCourse) {
        log('error', `Eroare creare curs de test: ${createErr?.message}`);
        return;
      }
      log('info', `Curs de test creat: ${newCourse.id}`);

      // Creează pași
      const stepsPayload: Partial<CourseStep>[] = [
        { course_id: newCourse.id, user_id: user.id, title_key: 'course.steps.manual', content: '', is_completed: false, step_order: 0 },
        { course_id: newCourse.id, user_id: user.id, title_key: 'course.steps.tests', content: '', is_completed: false, step_order: 1 },
      ];
      const { error: stepsErr } = await supabase.from('course_steps').insert(stepsPayload);
      if (stepsErr) {
        log('warn', `Eroare creare pași (continui testul): ${stepsErr.message}`);
      } else {
        log('info', `Pașii de test au fost adăugați.`);
      }

      // Ștergere (RPC fallback)
      const res = await deleteCourseById(newCourse.id as string, user.id);
      if (!res.ok) {
        log('error', `Ștergerea cursului de test a eșuat: ${res.message}`);
        // Cleanup defensiv
        await supabase.from('course_steps').delete().eq('course_id', newCourse.id);
        await supabase.from('courses').delete().eq('id', newCourse.id);
        return;
      }
      log('info', `Ștergere curs de test reușită.`);

      // Confirmă dispariția
      const { data: check, error: checkErr } = await supabase
        .from('courses')
        .select('id')
        .eq('id', newCourse.id)
        .maybeSingle();
      if (checkErr) {
        log('error', `Eroare la verificarea dispariției cursului: ${checkErr.message}`);
      } else {
        log('info', `Post-ștergere, cursul există? ${check ? 'DA' : 'NU'}`);
      }
    } finally {
      setBusy(false);
    }
  };

  const verifyTablesStructure = async () => {
    setBusy(true);
    clearLogs();
    try {
      const { data: oneCourse, error: cErr } = await supabase.from('courses').select('*').limit(1);
      if (cErr) {
        log('error', `Tabela courses: eroare interogare: ${cErr.message}`);
      } else {
        log('info', `Tabela courses: exemplu: ${JSON.stringify(oneCourse?.[0] || {})}`);
      }
      const { data: oneStep, error: sErr } = await supabase.from('course_steps').select('*').limit(1);
      if (sErr) {
        log('error', `Tabela course_steps: eroare interogare: ${sErr.message}`);
      } else {
        log('info', `Tabela course_steps: exemplu: ${JSON.stringify(oneStep?.[0] || {})}`);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">RLS & DB Tests</h1>
      {!user && <p className="text-red-600">Trebuie să fii autentificat pentru a rula testele.</p>}
      <div className="flex flex-wrap gap-3 mb-6">
        <button disabled={busy || !user} onClick={verifyQueryCriteria} className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50">Verifică criteriile de căutare</button>
        <button disabled={busy || !user} onClick={testTransactionalDelete} className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50">Testează ștergerea tranzacțională</button>
        <button disabled={busy} onClick={verifyTablesStructure} className="px-3 py-2 rounded bg-gray-600 text-white disabled:opacity-50">Verifică structura tabelelor</button>
        <button disabled={busy} onClick={clearLogs} className="px-3 py-2 rounded border">Curăță logurile</button>
      </div>
      <div className="bg-white dark:bg-gray-900 border rounded p-3 max-h-[50vh] overflow-auto">
        {logs.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">Niciun log încă. Rulează un test.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {logs.map((l, idx) => (
              <li key={idx} className={l.level === 'error' ? 'text-red-600' : l.level === 'warn' ? 'text-yellow-600' : 'text-gray-800 dark:text-gray-200'}>
                {l.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RlsTestPage;