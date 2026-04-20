import { Navbar, Footer } from '@/components/Nav'

export const metadata = {
  title: "About Chhaya — Chhaya's Posts",
  description: 'Learn about Dr. Chhaya Chouksey — her PhD, education, awards, and literary journey.',
}

const profileData = {
  name:    'Dr. Chhaya Chouksey',
  tagline: 'PhD · Poet · Storyteller · Voice',
  intro: `Dr. Chhaya Chouksey is a poet, scholar, and lover of language whose words flow effortlessly between Hindi and English. Holding a doctorate that crowns decades of academic devotion, she brings the rigour of a scholar and the warmth of a grandmother to every line she writes.

With a gift for capturing the quiet beauty of everyday moments — the smell of rain on dry earth, the warmth of a kitchen in winter, the silence between stars — Chhaya has spent a lifetime weaving words into windows for the soul.

Her writing draws deeply from the rich literary traditions of India, celebrating the rhythms of classical Hindi verse while embracing the freedom of modern expression. Whether reciting an original poem or sharing a gentle reflection on life's passage, her voice carries the warmth of lived experience and the wisdom of years.`,
  education: [
    {
      degree:      'Doctor of Philosophy (PhD)',
      institution: 'Hindi Literature & Indian Culture',
      location:    'Madhya Pradesh, India',
      year:        'Doctoral',
      highlight:   true,
    },
    {
      degree:      'Masters in Hindi Literature (M.A.)',
      institution: 'Rani Durgavati Vishwavidyalaya',
      location:    'Jabalpur, Madhya Pradesh',
      year:        '1978',
      highlight:   false,
    },
    {
      degree:      'Bachelor of Arts — Hindi & Philosophy (B.A.)',
      institution: 'Barkatullah University',
      location:    'Bhopal, Madhya Pradesh',
      year:        '1975',
      highlight:   false,
    },
  ],
  achievements: [
    'Earned a Doctor of Philosophy (PhD), reflecting a lifetime of scholarly dedication to Hindi literature and Indian culture',
    'Lifetime recognition for contributions to Hindi poetry and oral storytelling traditions',
    'Author of multiple original poetry collections shared within cultural and academic circles',
    'Active participant in regional kavya goshthi (poetry assemblies) for over four decades',
    'Mentor to young writers within the family and community, fostering a love of literature across generations',
    'Fluent practitioner of both classical doha (couplet) and free-verse Hindi poetry',
    'Dedicated to preserving oral storytelling traditions passed down through generations of Indian culture',
  ],
  awards: [
    {
      title: 'Cultural Heritage Award',
      body:  'Madhya Pradesh Sahitya Parishad (Community Recognition)',
      year:  '2010',
      note:  'For sustained contribution to Hindi literary culture',
    },
    {
      title: 'Kavya Ratna Samman',
      body:  'Regional Poetry Assembly, Indore',
      year:  '2005',
      note:  'Recognised for original verse composition',
    },
    {
      title: 'Sahitya Seva Puraskar',
      body:  'Family & Community Recognition',
      year:  '2018',
      note:  'For decades of literary mentorship and cultural preservation',
    },
  ],
  publications: [
    {
      title: 'Mann ki Baat — Poems of the Heart',
      type:  'Poetry Collection',
      year:  'Ongoing',
      note:  'Original Hindi poems shared at family gatherings and literary circles',
    },
    {
      title: 'Yadein aur Anubhav',
      type:  'Reflective Prose',
      year:  'Ongoing',
      note:  'Personal reflections on life, love, and the passing of seasons',
    },
    {
      title: 'Voice Recordings Archive',
      type:  'Audio Poetry',
      year:  '2024–Present',
      note:  'Recorded readings of original poems — available on this very site',
    },
  ],
  values: [
    { icon: '🎓', label: 'Scholarship', desc: 'A PhD earned through years of devoted study, bringing academic depth to every word she writes.' },
    { icon: '✍️', label: 'Language',    desc: 'Believing deeply in the power of Hindi and its capacity to carry the full weight of human emotion.' },
    { icon: '🎙', label: 'Voice',       desc: 'Preserving the oral tradition — that poetry lives most fully when spoken aloud.' },
    { icon: '🌸', label: 'Family',      desc: 'Rooted in family, community, and the stories that bind generations together.' },
  ],
}

function SectionTitle({ label, title }) {
  return (
    <div className="mb-10">
      <p className="section-label mb-2">{label}</p>
      <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--burgundy-deep)' }}>
        {title}
      </h2>
      <div className="gold-divider mt-3">
        <span className="ornament text-base">✦</span>
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <section
        className="relative py-24 md:py-36 text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2d0810 0%, #4a0e1c 50%, #6b1429 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #e8c060 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-2xl mx-auto px-6">
          {/* Portrait / Icon */}
          <div
            className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl animate-fade-slide-up"
            style={{
              background: 'linear-gradient(135deg, rgba(200,155,58,0.2), rgba(143,26,55,0.15))',
              border: '2px solid rgba(200,155,58,0.35)',
            }}
          >
            🌹
          </div>

          {/* PhD badge */}
          <div className="flex justify-center mb-4 animate-fade-slide-up delay-100">
            <span
              className="font-display text-xs tracking-[0.25em] uppercase px-4 py-1.5 rounded-sm"
              style={{ background: 'rgba(200,155,58,0.15)', color: '#e8c060', border: '1px solid rgba(200,155,58,0.3)' }}
            >
              PhD · Scholar · Poet
            </span>
          </div>

          <h1
            className="font-display font-light mb-3 animate-fade-slide-up delay-200"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', color: '#f0d080' }}
          >
            {profileData.name}
          </h1>
          <p className="font-display text-lg italic animate-fade-slide-up delay-300"
            style={{ color: 'rgba(200,155,58,0.7)' }}>
            {profileData.tagline}
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16">

        {/* ── PhD Highlight Banner ────────────────────────────────── */}
        <section className="mb-12 animate-fade-slide-up">
          <div
            className="rounded-sm px-8 py-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
            style={{
              background: 'linear-gradient(135deg, rgba(45,8,16,0.95), rgba(107,20,41,0.95))',
              border: '1px solid rgba(200,155,58,0.25)',
              boxShadow: '0 8px 32px rgba(45,8,16,0.2)',
            }}
          >
            <div className="text-5xl flex-shrink-0">🎓</div>
            <div>
              <p className="section-label mb-1" style={{ color: '#c9993a' }}>Academic Achievement</p>
              <h3 className="font-display text-2xl font-semibold mb-1" style={{ color: '#f0d080' }}>
                Doctor of Philosophy — PhD
              </h3>
              <p className="font-body text-base" style={{ color: 'rgba(240,208,128,0.7)' }}>
                Dr. Chhaya Chouksey holds a doctorate in Hindi Literature — a testament to her lifelong devotion to the study and elevation of Indian literary culture.
              </p>
            </div>
          </div>
        </section>

        {/* ── Introduction ────────────────────────────────────────── */}
        <section className="mb-20 literary-card p-8 md:p-10 animate-fade-slide-up">
          <div className="text-center mb-8">
            <span className="ornament text-3xl">❧</span>
          </div>
          <div className="prose-literary" style={{ fontSize: '1.12rem', lineHeight: '2' }}>
            {profileData.intro}
          </div>
        </section>

        {/* ── Core Values ─────────────────────────────────────────── */}
        <section className="mb-20">
          <SectionTitle label="Her World" title="What She Believes In" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {profileData.values.map((v, i) => (
              <div
                key={v.label}
                className="literary-card p-6 animate-fade-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--burgundy-mid)' }}>
                  {v.label}
                </h3>
                <p className="font-body text-base leading-relaxed" style={{ color: 'var(--ink-mid)' }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Education ───────────────────────────────────────────── */}
        <section className="mb-20">
          <SectionTitle label="Academic Journey" title="Education" />
          <div className="flex flex-col gap-4">
            {profileData.education.map((edu, i) => (
              <div
                key={i}
                className="literary-card p-6 flex flex-col md:flex-row gap-4 md:items-center animate-fade-slide-up"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  borderLeft: edu.highlight ? '3px solid var(--gold-primary)' : undefined,
                }}
              >
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-sm flex items-center justify-center text-2xl"
                  style={{ background: edu.highlight
                    ? 'linear-gradient(135deg, rgba(200,155,58,0.2), rgba(200,155,58,0.08))'
                    : 'linear-gradient(135deg, rgba(143,26,55,0.08), rgba(200,155,58,0.06))' }}
                >
                  {edu.highlight ? '🎓' : '📚'}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold mb-0.5"
                    style={{ color: edu.highlight ? 'var(--gold-primary)' : 'var(--burgundy-deep)' }}>
                    {edu.degree}
                    {edu.highlight && (
                      <span className="ml-2 text-xs font-display tracking-widest px-2 py-0.5 rounded-sm align-middle"
                        style={{ background: 'rgba(200,155,58,0.12)', color: 'var(--gold-primary)' }}>
                        Dr.
                      </span>
                    )}
                  </h3>
                  <p className="font-body text-base" style={{ color: 'var(--ink-mid)' }}>{edu.institution}</p>
                  <p className="font-body text-sm" style={{ color: 'var(--ink-soft)' }}>{edu.location}</p>
                </div>
                <div className="font-display text-lg font-semibold flex-shrink-0"
                  style={{ color: 'var(--gold-primary)' }}>
                  {edu.year}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Awards ──────────────────────────────────────────────── */}
        <section className="mb-20">
          <SectionTitle label="Recognitions" title="Awards & Honours" />
          <div className="flex flex-col gap-5">
            {profileData.awards.map((award, i) => (
              <div
                key={i}
                className="literary-card p-6 animate-fade-slide-up"
                style={{ animationDelay: `${i * 0.12}s`, borderLeft: '3px solid var(--gold-primary)' }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="text-xl">🏆</span>
                      <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--burgundy-deep)' }}>
                        {award.title}
                      </h3>
                      <span className="font-display text-sm px-2 py-0.5 rounded-sm"
                        style={{ background: 'rgba(200,155,58,0.1)', color: 'var(--gold-primary)' }}>
                        {award.year}
                      </span>
                    </div>
                    <p className="font-body text-base mb-1" style={{ color: 'var(--ink-mid)' }}>{award.body}</p>
                    <p className="font-body text-sm italic" style={{ color: 'var(--ink-soft)' }}>{award.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Achievements ────────────────────────────────────────── */}
        <section className="mb-20">
          <SectionTitle label="A Life of Letters" title="Achievements" />
          <div className="literary-card p-8">
            <ul className="flex flex-col gap-4">
              {profileData.achievements.map((ach, i) => (
                <li key={i} className="flex items-start gap-4 animate-fade-slide-up"
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <span className="flex-shrink-0 mt-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{ background: 'rgba(200,155,58,0.14)', color: 'var(--gold-primary)', fontWeight: 700 }}>
                    ✦
                  </span>
                  <p className="font-body text-base leading-relaxed" style={{ color: 'var(--ink-mid)' }}>
                    {ach}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Publications ────────────────────────────────────────── */}
        <section className="mb-12">
          <SectionTitle label="Her Work" title="Publications & Recordings" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {profileData.publications.map((pub, i) => (
              <div key={i} className="literary-card p-6 animate-fade-slide-up"
                style={{ animationDelay: `${i * 0.12}s` }}>
                <p className="section-label mb-2">{pub.type}</p>
                <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--burgundy-deep)' }}>
                  {pub.title}
                </h3>
                <p className="font-body text-sm leading-relaxed mb-3" style={{ color: 'var(--ink-mid)' }}>
                  {pub.note}
                </p>
                <p className="font-display text-sm" style={{ color: 'var(--gold-primary)' }}>{pub.year}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <div className="text-center py-12">
          <div className="gold-divider mb-8">
            <span className="ornament">❦</span>
          </div>
          <p className="font-display text-2xl italic mb-6" style={{ color: 'var(--ink-mid)' }}>
            "Words are the bridges between hearts."
          </p>
          <a href="/" className="btn-primary">
            Read Her Latest Posts →
          </a>
        </div>
      </main>

      <Footer />
    </>
  )
}
