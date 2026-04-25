'use client'

import { useState } from 'react'
import { Navbar, Footer } from '@/components/Nav'

/* ══════════════════════════════════════════════════════════════
   CONTENT — English & Hindi
   ══════════════════════════════════════════════════════════════ */
const content = {
  en: {
    meta: {
      pageTitle:  "About Chhaya — Chhaya's Posts",
      heroLabel:  'The Poet Behind the Words',
      heroTitle:  'Dr. Chhaya Chouksey',
      heroTagline:'PhD · Poet · Storyteller · Voice',
      phdBadge:   'PhD · Scholar · Poet',
    },
    intro: `Dr. Chhaya Chouksey is a poet, scholar, and lover of language whose words flow effortlessly between Hindi and English. Holding a doctorate that crowns decades of academic devotion, she brings the rigour of a scholar and the warmth of a grandmother to every line she writes.

With a gift for capturing the quiet beauty of everyday moments — the smell of rain on dry earth, the warmth of a kitchen in winter, the silence between stars — Chhaya has spent a lifetime weaving words into windows for the soul.

Her writing draws deeply from the rich literary traditions of India, celebrating the rhythms of classical Hindi verse while embracing the freedom of modern expression. Whether reciting an original poem or sharing a gentle reflection on life's passage, her voice carries the warmth of lived experience and the wisdom of years.`,
    phdSection: {
      label: 'Academic Achievement',
      title: 'Doctor of Philosophy — PhD',
      body:  'Dr. Chhaya Chouksey holds a doctorate in Hindi Literature — a testament to her lifelong devotion to the study and elevation of Indian literary culture.',
    },
    sections: {
      values:        { label: 'Her World',         title: 'What She Believes In'       },
      education:     { label: 'Academic Journey',  title: 'Education'                  },
      awards:        { label: 'Recognitions',       title: 'Awards & Honours'           },
      achievements:  { label: 'A Life of Letters',  title: 'Achievements'              },
      publications:  { label: 'Her Work',           title: 'Publications & Recordings'  },
    },
    ctaQuote: '"Words are the bridges between hearts."',
    ctaButton: 'Read Her Latest Posts →',
    values: [
      { icon: '🎓', label: 'Scholarship', desc: 'A PhD earned through years of devoted study, bringing academic depth to every word she writes.' },
      { icon: '✍️', label: 'Language',    desc: 'Believing deeply in the power of Hindi and its capacity to carry the full weight of human emotion.' },
      { icon: '🎙', label: 'Voice',       desc: 'Preserving the oral tradition — that poetry lives most fully when spoken aloud.' },
      { icon: '🌸', label: 'Family',      desc: 'Rooted in family, community, and the stories that bind generations together.' },
    ],
    education: [
      { degree: 'Doctor of Philosophy (PhD)', institution: 'Hindi Literature & Indian Culture', location: 'Madhya Pradesh, India', year: 'Doctoral', highlight: true },
      { degree: 'Masters in Hindi Literature (M.A.)', institution: 'Rani Durgavati Vishwavidyalaya', location: 'Jabalpur, Madhya Pradesh', year: '1978', highlight: false },
      { degree: 'Bachelor of Arts — Hindi & Philosophy (B.A.)', institution: 'Barkatullah University', location: 'Bhopal, Madhya Pradesh', year: '1975', highlight: false },
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
      { title: 'Cultural Heritage Award',   body: 'Madhya Pradesh Sahitya Parishad (Community Recognition)', year: '2010', note: 'For sustained contribution to Hindi literary culture' },
      { title: 'Kavya Ratna Samman',         body: 'Regional Poetry Assembly, Indore',                       year: '2005', note: 'Recognised for original verse composition' },
      { title: 'Sahitya Seva Puraskar',      body: 'Family & Community Recognition',                         year: '2018', note: 'For decades of literary mentorship and cultural preservation' },
    ],
    publications: [
      { title: 'Mann ki Baat — Poems of the Heart', type: 'Poetry Collection', year: 'Ongoing',      note: 'Original Hindi poems shared at family gatherings and literary circles' },
      { title: 'Yadein aur Anubhav',                type: 'Reflective Prose',  year: 'Ongoing',      note: 'Personal reflections on life, love, and the passing of seasons' },
      { title: 'Voice Recordings Archive',           type: 'Audio Poetry',     year: '2024–Present', note: 'Recorded readings of original poems — available on this very site' },
    ],
  },

  hi: {
    meta: {
      pageTitle:  'छाया के बारे में — छाया की पोस्ट',
      heroLabel:  'शब्दों के पीछे की कवयित्री',
      heroTitle:  'डॉ. छाया चौकसे',
      heroTagline:'PhD · कवयित्री · कथाकार · स्वर',
      phdBadge:   'PhD · विदुषी · कवयित्री',
    },
    intro: `डॉ. छाया चौकसे एक कवयित्री, विदुषी और भाषा-प्रेमी हैं, जिनके शब्द हिंदी और अंग्रेज़ी के बीच सहजता से बहते हैं। दशकों की अकादमिक साधना से अर्जित डॉक्टरेट की उपाधि उनकी विद्वत्ता की प्रतीक है — और हर पंक्ति में एक विदुषी की गहराई और नानी की ऊष्मा एक साथ मिलती है।

रोज़मर्रा के पलों की सुंदरता को — सूखी धरती पर बारिश की सोंधी महक, सर्दियों में रसोई की गर्माहट, तारों के बीच का मौन — शब्दों में पिरोने की अद्भुत क्षमता लिए छाया जी ने जीवन भर भावनाओं को आत्मा की खिड़कियों में ढाला है।

उनका लेखन भारतीय साहित्य की समृद्ध परंपराओं से गहराई से जुड़ा है — शास्त्रीय हिंदी काव्य की लय का सम्मान करते हुए आधुनिक अभिव्यक्ति की स्वतंत्रता को भी अपनाता है। चाहे कोई मौलिक कविता का पाठ हो या जीवन के प्रवाह पर एक कोमल चिंतन, उनकी आवाज़ में अनुभव की ऊष्मा और वर्षों की प्रज्ञा झलकती है।`,
    phdSection: {
      label: 'शैक्षणिक उपलब्धि',
      title: 'दर्शनशास्त्र में डॉक्टरेट — PhD',
      body:  'डॉ. छाया चौकसे के पास हिंदी साहित्य में डॉक्टरेट की उपाधि है — यह भारतीय साहित्यिक संस्कृति के अध्ययन और उत्थान के प्रति उनके जीवनपर्यंत समर्पण का प्रमाण है।',
    },
    sections: {
      values:        { label: 'उनका संसार',       title: 'उनकी आस्थाएँ'              },
      education:     { label: 'शैक्षणिक यात्रा',  title: 'शिक्षा'                    },
      awards:        { label: 'सम्मान',            title: 'पुरस्कार एवं सम्मान'       },
      achievements:  { label: 'साहित्य का जीवन',  title: 'उपलब्धियाँ'               },
      publications:  { label: 'उनकी रचनाएँ',      title: 'प्रकाशन एवं रिकॉर्डिंग्स' },
    },
    ctaQuote: '"शब्द हृदयों के बीच सेतु हैं।"',
    ctaButton: 'उनकी नवीनतम पोस्ट पढ़ें →',
    values: [
      { icon: '🎓', label: 'विद्वत्ता',  desc: 'वर्षों के समर्पित अध्ययन से अर्जित डॉक्टरेट, जो उनके हर शब्द में अकादमिक गहराई भर देती है।' },
      { icon: '✍️', label: 'भाषा',      desc: 'हिंदी की शक्ति में गहरा विश्वास — यह भाषा मानवीय भावनाओं का पूरा बोझ उठाने में सक्षम है।' },
      { icon: '🎙', label: 'स्वर',       desc: 'मौखिक परंपरा का संरक्षण — कविता तब सबसे जीवंत होती है जब वह स्वर में बोली जाए।' },
      { icon: '🌸', label: 'परिवार',    desc: 'परिवार, समाज और उन कहानियों में निहित जो पीढ़ियों को एक-दूसरे से जोड़ती हैं।' },
    ],
    education: [
      { degree: 'दर्शनशास्त्र में डॉक्टरेट (PhD)', institution: 'हिंदी साहित्य एवं भारतीय संस्कृति', location: 'मध्यप्रदेश, भारत', year: 'डॉक्टरेट', highlight: true },
      { degree: 'हिंदी साहित्य में परास्नातक (M.A.)', institution: 'रानी दुर्गावती विश्वविद्यालय', location: 'जबलपुर, मध्यप्रदेश', year: '1978', highlight: false },
      { degree: 'कला स्नातक — हिंदी एवं दर्शनशास्त्र (B.A.)', institution: 'बरकतउल्लाह विश्वविद्यालय', location: 'भोपाल, मध्यप्रदेश', year: '1975', highlight: false },
    ],
    achievements: [
      'हिंदी साहित्य और भारतीय संस्कृति के अध्ययन में जीवनपर्यंत समर्पण का प्रतीक — डॉक्टरेट उपाधि अर्जित',
      'हिंदी कविता और मौखिक कथाकथन परंपरा में योगदान के लिए आजीवन सम्मान',
      'सांस्कृतिक एवं अकादमिक मंचों पर साझा किए गए अनेक मौलिक काव्य-संग्रहों की रचयिता',
      'चार दशकों से अधिक समय तक क्षेत्रीय काव्य-गोष्ठियों में सक्रिय एवं सम्मानित सहभागिता',
      'परिवार और समाज के युवा लेखकों को साहित्य-प्रेम की दीक्षा देने वाली मार्गदर्शिका',
      'शास्त्रीय दोहा और मुक्त-छंद हिंदी कविता दोनों की कुशल साधिका',
      'भारतीय संस्कृति की पीढ़ियों से चली आ रही मौखिक कथाकथन परंपराओं के संरक्षण में समर्पित',
    ],
    awards: [
      { title: 'सांस्कृतिक धरोहर पुरस्कार', body: 'मध्यप्रदेश साहित्य परिषद (सामुदायिक मान्यता)', year: '2010', note: 'हिंदी साहित्यिक संस्कृति में निरंतर योगदान के लिए' },
      { title: 'काव्य रत्न सम्मान',           body: 'क्षेत्रीय काव्य-गोष्ठी, इंदौर',               year: '2005', note: 'मौलिक काव्य-रचना के लिए सम्मानित' },
      { title: 'साहित्य सेवा पुरस्कार',       body: 'पारिवारिक एवं सामुदायिक मान्यता',            year: '2018', note: 'दशकों के साहित्यिक मार्गदर्शन और सांस्कृतिक संरक्षण के लिए' },
    ],
    publications: [
      { title: 'मन की बात — हृदय की कविताएँ', type: 'काव्य-संग्रह',  year: 'जारी',         note: 'पारिवारिक समारोहों और साहित्यिक मंचों पर साझा की गई मौलिक हिंदी कविताएँ' },
      { title: 'यादें और अनुभव',               type: 'विचार-गद्य',   year: 'जारी',         note: 'जीवन, प्रेम और ऋतुओं के प्रवाह पर व्यक्तिगत चिंतन' },
      { title: 'वाचन-संग्रह',                  type: 'ऑडियो कविता', year: '2024–वर्तमान', note: 'मौलिक कविताओं के रिकॉर्ड किए गए पाठ — इसी वेबसाइट पर उपलब्ध' },
    ],
  },
}

/* ══════════════════════════════════════════════════════════════
   Language Toggle Button
   ══════════════════════════════════════════════════════════════ */
function LangToggle({ lang, setLang }) {
  return (
    <div className="flex items-center justify-center gap-0 rounded-sm overflow-hidden"
      style={{ border: '1px solid rgba(200,155,58,0.3)', display: 'inline-flex' }}>
      {[
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिन्दी'  },
      ].map(opt => (
        <button
          key={opt.code}
          onClick={() => setLang(opt.code)}
          className="px-5 py-2 font-display text-sm tracking-wide transition-all duration-300"
          style={{
            background: lang === opt.code
              ? 'linear-gradient(135deg, var(--burgundy-mid), var(--burgundy-bright))'
              : 'rgba(200,155,58,0.06)',
            color:  lang === opt.code ? '#f0d080' : 'var(--ink-mid)',
            fontWeight: lang === opt.code ? 600 : 400,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   Section Title
   ══════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  const [lang, setLang] = useState('en')
  const t = content[lang]

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative py-24 md:py-36 text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2d0810 0%, #4a0e1c 50%, #6b1429 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #e8c060 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-2xl mx-auto px-6">
          {/* Portrait */}
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
              className="font-display text-xs tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm"
              style={{ background: 'rgba(200,155,58,0.15)', color: '#e8c060', border: '1px solid rgba(200,155,58,0.3)' }}
            >
              {t.meta.phdBadge}
            </span>
          </div>

          <h1
            className="font-display font-light mb-3 animate-fade-slide-up delay-200"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', color: '#f0d080' }}
          >
            {t.meta.heroTitle}
          </h1>
          <p className="font-display text-lg italic animate-fade-slide-up delay-300"
            style={{ color: 'rgba(200,155,58,0.7)' }}>
            {t.meta.heroTagline}
          </p>

          {/* Language toggle — in hero */}
          <div className="mt-8 flex justify-center animate-fade-slide-up delay-400">
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16">

        {/* Language toggle — sticky top of content */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center gap-3">
            <span className="font-display text-xs tracking-widest uppercase" style={{ color: 'var(--ink-soft)' }}>
              Language
            </span>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>

        {/* ── PhD Highlight ────────────────────────────────────── */}
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
              <p className="section-label mb-1" style={{ color: '#c9993a' }}>{t.phdSection.label}</p>
              <h3 className="font-display text-2xl font-semibold mb-1" style={{ color: '#f0d080' }}>
                {t.phdSection.title}
              </h3>
              <p className="font-body text-base" style={{ color: 'rgba(240,208,128,0.7)' }}>
                {t.phdSection.body}
              </p>
            </div>
          </div>
        </section>

        {/* ── Intro ────────────────────────────────────────────── */}
        <section className="mb-20 literary-card p-8 md:p-10 animate-fade-slide-up">
          <div className="text-center mb-8">
            <span className="ornament text-3xl">❧</span>
          </div>
          <div className="prose-literary" style={{ fontSize: '1.12rem', lineHeight: '2' }}>
            {t.intro}
          </div>
        </section>

        {/* ── Values ───────────────────────────────────────────── */}
        <section className="mb-20">
          <SectionTitle label={t.sections.values.label} title={t.sections.values.title} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.values.map((v, i) => (
              <div key={v.label} className="literary-card p-6 animate-fade-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}>
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

        {/* ── Education ────────────────────────────────────────── */}
        <section className="mb-20">
          <SectionTitle label={t.sections.education.label} title={t.sections.education.title} />
          <div className="flex flex-col gap-4">
            {t.education.map((edu, i) => (
              <div key={i}
                className="literary-card p-6 flex flex-col md:flex-row gap-4 md:items-center animate-fade-slide-up"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  borderLeft: edu.highlight ? '3px solid var(--gold-primary)' : undefined,
                }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-sm flex items-center justify-center text-2xl"
                  style={{ background: edu.highlight
                    ? 'linear-gradient(135deg, rgba(200,155,58,0.2), rgba(200,155,58,0.08))'
                    : 'linear-gradient(135deg, rgba(143,26,55,0.08), rgba(200,155,58,0.06))' }}>
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

        {/* ── Awards ───────────────────────────────────────────── */}
        <section className="mb-20">
          <SectionTitle label={t.sections.awards.label} title={t.sections.awards.title} />
          <div className="flex flex-col gap-5">
            {t.awards.map((award, i) => (
              <div key={i} className="literary-card p-6 animate-fade-slide-up"
                style={{ animationDelay: `${i * 0.12}s`, borderLeft: '3px solid var(--gold-primary)' }}>
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
            ))}
          </div>
        </section>

        {/* ── Achievements ─────────────────────────────────────── */}
        <section className="mb-20">
          <SectionTitle label={t.sections.achievements.label} title={t.sections.achievements.title} />
          <div className="literary-card p-8">
            <ul className="flex flex-col gap-4">
              {t.achievements.map((ach, i) => (
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

        {/* ── Publications ─────────────────────────────────────── */}
        <section className="mb-12">
          <SectionTitle label={t.sections.publications.label} title={t.sections.publications.title} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {t.publications.map((pub, i) => (
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

        {/* ── CTA ──────────────────────────────────────────────── */}
        <div className="text-center py-12">
          <div className="gold-divider mb-8">
            <span className="ornament">❦</span>
          </div>
          <p className="font-display text-2xl italic mb-6" style={{ color: 'var(--ink-mid)' }}>
            {t.ctaQuote}
          </p>
          <a href="/" className="btn-primary">{t.ctaButton}</a>
        </div>

      </main>

      <Footer />
    </>
  )
}
