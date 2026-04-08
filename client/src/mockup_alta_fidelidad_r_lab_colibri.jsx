export default function RLabColibriMockup() {
  const pacs = [
    { id: 'T1-C1', title: 'Alineación fundacional', status: 'Validado', date: '12 Mar', risk: 'Humano', score: 82 },
    { id: 'T1-C2', title: 'Definición de problema', status: 'Validado', date: '21 Mar', risk: 'Irrelevancia', score: 76 },
    { id: 'T1-C3', title: 'Narrativa de valor', status: 'En revisión', date: '02 Abr', risk: 'Narrativo', score: 64 },
    { id: 'T1-C4', title: 'Coherencia operativa', status: 'Pendiente', date: '09 Abr', risk: 'Coordinación', score: 41 },
  ];

  const categories = [
    { label: 'C1 Equipo', value: 78, target: 85 },
    { label: 'C2 Problema', value: 71, target: 80 },
    { label: 'C3 Modelo', value: 63, target: 75 },
    { label: 'C4 Financiamiento', value: 48, target: 65 },
    { label: 'C5 Timing', value: 67, target: 72 },
    { label: 'C6 Exógenos', value: 54, target: 60 },
    { label: 'C7 Tracción', value: 39, target: 55 },
  ];

  const evidence = [
    { title: 'Mapa de roles explícitos', category: 'C1', mentor: 'Mentor PAC', date: '03 Abr', status: 'Aprobada' },
    { title: 'Entrevistas con usuarios', category: 'C2', mentor: 'Mentor PAC', date: '31 Mar', status: 'Aprobada' },
    { title: 'Reformulación propuesta de valor', category: 'C3', mentor: 'Coach', date: '01 Abr', status: 'Observada' },
  ];

  const trend = [38, 42, 44, 49, 53, 58, 61, 66, 69, 71, 74, 78];
  const icTrend = [31, 34, 36, 40, 43, 47, 51, 57, 59, 63, 67, 72];

  const linePath = (data, width = 320, height = 90) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const step = width / (data.length - 1);
    return data
      .map((v, i) => {
        const x = i * step;
        const y = height - ((v - min) / (max - min || 1)) * (height - 10) - 5;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const statusTone = {
    Validado: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    'En revisión': 'bg-amber-500/15 text-amber-300 border-amber-400/20',
    Pendiente: 'bg-slate-400/10 text-slate-300 border-slate-400/20',
    Aprobada: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    Observada: 'bg-amber-500/15 text-amber-300 border-amber-400/20',
  };

  return (
    <div className="min-h-screen w-full bg-[#09111D] text-[#F4F1EA] p-6 md:p-8">
      <div className="mx-auto max-w-390 rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,207,207,0.10),transparent_22%),radial-gradient(circle_at_24%_18%,rgba(255,209,102,0.10),transparent_18%),linear-gradient(180deg,#0B1422_0%,#09111D_100%)] shadow-2xl shadow-black/30 overflow-hidden">
        <div className="grid grid-cols-[88px_1.25fr_1.2fr_0.95fr] min-h-230">
          <aside className="border-r border-white/8 bg-white/2 p-4 flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#FFD166]/25 to-[#00CFCF]/20 border border-white/10 flex items-center justify-center text-lg font-semibold">C</div>
            <div className="mt-6 flex flex-col gap-3 w-full items-center">
              {['⌂', '◎', '↗', '◫', '✦', '≡'].map((i, idx) => (
                <div key={idx} className={`h-11 w-11 rounded-2xl flex items-center justify-center border ${idx === 1 ? 'bg-[#FFD166]/15 border-[#FFD166]/30 text-[#FFD166]' : 'bg-white/3 border-white/8 text-white/65'}`}>
                  <span className="text-sm">{i}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto w-full">
              <div className="mx-auto h-11 w-11 rounded-2xl bg-white/4 border border-white/10 flex items-center justify-center text-xs">JD</div>
            </div>
          </aside>

          <section className="border-r border-white/8 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">R-Lab · Panel de Vuelo</div>
                <h1 className="text-2xl font-semibold mt-2">Pantalla principal · Reputación longitudinal</h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5">Modo Mecenas</span>
                <span className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5">T1 · Fundacional</span>
              </div>
            </div>

            <div className="grid grid-cols-[1.05fr_0.95fr] gap-5">
              <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,209,102,0.16),transparent_34%)]" />
                <div className="relative">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Identidad reputacional</div>
                  <div className="mt-5 flex items-center gap-6">
                    <div className="relative h-52 w-52 shrink-0 rounded-full border border-[#FFD166]/25 bg-[radial-gradient(circle_at_center,rgba(255,248,242,0.95)_0%,rgba(255,209,102,0.28)_32%,rgba(0,0,0,0)_70%)] flex items-center justify-center shadow-[0_0_80px_rgba(255,209,102,0.12)]">
                      <div className="absolute h-44 w-44 rounded-full border border-[#FFD166]/30" />
                      <div className="absolute h-36 w-36 rounded-full border border-white/15" />
                      <div className="absolute top-10 right-9 h-4 w-4 rounded-full bg-[#FFD166] shadow-[0_0_20px_rgba(255,209,102,0.65)]" />
                      <div className="absolute left-10 bottom-10 h-3 w-3 rounded-full bg-[#00CFCF]/80 shadow-[0_0_20px_rgba(0,207,207,0.45)]" />
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-[0.28em] text-[#7E6841]">NFT</div>
                        <div className="text-[42px] leading-none mt-2">🕊</div>
                        <div className="mt-2 text-sm text-[#7E6841]">Colibrí evolutivo</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-white/55">Proyecto</div>
                        <div className="text-xl font-medium mt-1">Semilla Aurora</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <MetricCard label="Versión NFT" value="v1.3" />
                        <MetricCard label="Última evolución" value="02 Abr" />
                        <MetricCard label="Tramo actual" value="T1" />
                        <MetricCard label="Consistencia" value="Alta" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/3 p-5 flex flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Índice Colibrí</div>
                    <div className="mt-4 text-6xl font-semibold leading-none">72</div>
                    <div className="mt-2 text-sm text-emerald-300">↑ +11 pts en 30 días</div>
                  </div>
                  <div className="h-28 w-28 rounded-full border border-[#00CFCF]/20 flex items-center justify-center bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,207,207,0.7)_0_220deg,rgba(255,255,255,0.06)_220deg_360deg)]">
                    <div className="h-20 w-20 rounded-full bg-[#0C1524] border border-white/10 flex items-center justify-center text-sm text-white/70">72/100</div>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-white/8 bg-black/10 p-3">
                  <svg viewBox="0 0 320 90" className="w-full h-24">
                    <path d={linePath(icTrend)} fill="none" stroke="rgba(0,207,207,0.85)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <div className="flex justify-between text-[11px] text-white/35 -mt-1">
                    <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span>
                  </div>
                </div>
                <div className="mt-auto grid grid-cols-3 gap-3 pt-4">
                  <TinyMetric label="Avance tramo" value="61%" />
                  <TinyMetric label="PACs validados" value="2/4" />
                  <TinyMetric label="Estado" value="Sólido" />
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/3 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Reducción de incertidumbre</div>
                  <h2 className="text-xl font-medium mt-2">Transición estructural del tramo</h2>
                </div>
                <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300">Incertidumbre dominante: Identitaria</span>
              </div>

              <div className="mt-5 grid grid-cols-[0.95fr_1.05fr] gap-5">
                <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                  <div className="text-sm text-white/60">Antes → Ahora</div>
                  <div className="mt-5 space-y-5">
                    {[
                      ['Coherencia de equipo', 34, 78],
                      ['Claridad de problema', 29, 71],
                      ['Disciplina temporal', 41, 67],
                    ].map(([label, a, b]) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-2"><span>{label}</span><span className="text-white/50">{a} → {b}</span></div>
                        <div className="relative h-8">
                          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />
                          <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white/40" style={{ left: `${a}%` }} />
                          <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#FFD166] shadow-[0_0_15px_rgba(255,209,102,0.45)]" style={{ left: `${b}%` }} />
                          <div className="absolute top-1/2 h-px bg-[#FFD166]/60" style={{ left: `${a}%`, width: `${Math.max(b - a, 2)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <RiskBar title="Riesgo humano" value={24} tone="emerald" />
                  <RiskBar title="Riesgo de irrelevancia" value={42} tone="amber" />
                  <RiskBar title="Riesgo narrativo" value={57} tone="amber" />
                  <RiskBar title="Coachability" value={83} tone="cyan" invert />
                </div>
              </div>
            </div>
          </section>

          <section className="border-r border-white/8 p-6 space-y-6 bg-white/1.5">
            <div className="rounded-[26px] border border-white/10 bg-white/3 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Trayectoria longitudinal por PAC</div>
                  <h2 className="text-xl font-medium mt-2">Secuencia verificable de transformación</h2>
                </div>
                <span className="text-xs text-white/45">Fricción → decisión → resultado</span>
              </div>

              <div className="mt-6 space-y-4">
                {pacs.map((pac, idx) => (
                  <div key={pac.id} className="relative rounded-2xl border border-white/8 bg-black/10 p-4">
                    {idx !== pacs.length - 1 && <div className="absolute left-4.75 top-14 h-13.5 w-px bg-linear-to-b from-[#FFD166]/60 to-transparent" />}
                    <div className="flex gap-4">
                      <div className={`mt-1 h-5 w-5 rounded-full border ${pac.status === 'Validado' ? 'bg-emerald-400/70 border-emerald-300/40' : pac.status === 'En revisión' ? 'bg-amber-400/70 border-amber-300/40' : 'bg-white/25 border-white/20'}`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm text-white/45">{pac.id} · {pac.date}</div>
                            <div className="text-base font-medium mt-1">{pac.title}</div>
                          </div>
                          <span className={`rounded-full border px-2.5 py-1 text-[11px] ${statusTone[pac.status]}`}>{pac.status}</span>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                          <InfoPill label="Fricción" value={pac.risk} />
                          <InfoPill label="Decisión" value="Ajuste de hipótesis" />
                          <InfoPill label="Score" value={`${pac.score}/100`} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/3 p-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Tendencia longitudinal</div>
              <div className="mt-2 flex items-end justify-between">
                <h2 className="text-xl font-medium">Evolución de reputación y consistencia</h2>
                <div className="text-xs text-white/45">últimos 12 cortes</div>
              </div>
              <div className="mt-5 rounded-2xl border border-white/8 bg-black/10 p-4">
                <svg viewBox="0 0 320 100" className="w-full h-32">
                  <path d={linePath(trend, 320, 100)} fill="none" stroke="rgba(255,209,102,0.9)" strokeWidth="3" strokeLinecap="round" />
                  <path d={linePath(icTrend, 320, 100)} fill="none" stroke="rgba(0,207,207,0.72)" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="mt-2 flex items-center gap-4 text-xs text-white/50">
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#FFD166]" /> Reputación observable</div>
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#00CFCF]" /> Índice Colibrí</div>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 space-y-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]">
            <div className="rounded-[26px] border border-white/10 bg-white/3 p-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Contexto rápido</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <TinyMetric label="Última evidencia" value="03 Abr" />
                <TinyMetric label="Próximo hito" value="09 Abr" />
                <TinyMetric label="Mentor" value="PAC-01" />
                <TinyMetric label="Snapshot" value="v0.9" />
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/3 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Categorías troncales</div>
                  <h2 className="text-xl font-medium mt-2">Estado estructural por eje</h2>
                </div>
                <span className="text-xs text-white/45">actual vs umbral</span>
              </div>
              <div className="mt-5 space-y-4">
                {categories.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex justify-between text-sm"><span>{item.label}</span><span className="text-white/45">{item.value} / {item.target}</span></div>
                    <div className="relative h-3 rounded-full bg-white/8 overflow-hidden">
                      <div className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-[#00CFCF] to-[#FFD166]" style={{ width: `${item.value}%` }} />
                      <div className="absolute -inset-y-0.75 w-px bg-white/70" style={{ left: `${item.target}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/3 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Evidencia trazable</div>
                  <h2 className="text-xl font-medium mt-2">Prueba verificable reciente</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs text-white/60">3 visibles</span>
              </div>
              <div className="mt-4 space-y-3">
                {evidence.map((row) => (
                  <div key={row.title} className="rounded-2xl border border-white/8 bg-black/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium leading-snug">{row.title}</div>
                        <div className="mt-2 text-xs text-white/45">{row.category} · {row.mentor} · {row.date}</div>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] ${statusTone[row.status]}`}>{row.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,209,102,0.10),rgba(255,255,255,0.02))] p-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Lectura institucional</div>
              <div className="mt-3 text-lg font-medium leading-snug">La señal dominante es una reducción estructural visible de incertidumbre bajo fricción real.</div>
              <p className="mt-3 text-sm text-white/58 leading-6">El panel no comunica éxito decorativo. Comunica coherencia, decisión sostenida y evidencia acumulativa.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div className="mt-2 text-lg font-medium">{value}</div>
    </div>
  );
}

function TinyMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/10 px-3 py-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div className="mt-2 text-sm font-medium">{value}</div>
    </div>
  );
}

function RiskBar({ title, value, tone = 'amber', invert = false }) {
  const tones = {
    amber: 'from-amber-500 to-[#FFD166]',
    emerald: 'from-emerald-500 to-emerald-300',
    cyan: 'from-cyan-500 to-[#00CFCF]',
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
      <div className="flex items-center justify-between text-sm">
        <span>{title}</span>
        <span className="text-white/45">{value}%</span>
      </div>
      <div className="mt-3 h-3 rounded-full bg-white/8 overflow-hidden">
        <div className={`h-full rounded-full bg-linear-to-r ${tones[tone]}`} style={{ width: `${invert ? value : value}%` }} />
      </div>
      <div className="mt-2 text-xs text-white/45">{invert ? 'fortaleza observable' : 'riesgo residual'}</div>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/38">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}
