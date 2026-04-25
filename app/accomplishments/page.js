'use client'

import { useState } from 'react'
import { Navbar, Footer } from '@/components/Nav'

/* ══════════════════════════════════════════════════════════════
   CONTENT — English & Hindi
   ══════════════════════════════════════════════════════════════ */
const content = {
  en: {
    hero: {
      label:    'A Life in Words',
      title:    'Accomplishments',
      subtitle: 'Seven decades of poetry, mentorship, and literary devotion.',
    },
    stats: [
      { num: '40+', label: 'Years of Writing' },
      { num: '∞',  label: 'Poems Composed'   },
      { num: '3',  label: 'Major Awards'      },
      { num: '2',  label: 'Degrees Earned'    },
    ],
    timeline: {
      sectionLabel: 'The Journey',
      sectionTitle: 'A Literary Timeline',
      items: [
        { year: '1955',  era: 'Early Years',         title: 'The First Poem',                       desc: 'Chhaya discovers her love for language as a young girl, reciting dohas (couplets) from memory and composing her first original verses — a natural gift that would define her life.',                                                                           icon: '✨' },
        { year: '1975',  era: 'Academic Foundation', title: 'Bachelor of Arts — Hindi & Philosophy', desc: 'Completes undergraduate studies at Barkatullah University, Bhopal, laying a rigorous academic foundation in Hindi literature and Indian philosophy.',                                                                                                       icon: '🎓' },
        { year: '1978',  era: 'Scholarly Achievement',title: 'Masters in Hindi Literature',          desc: 'Earns a post-graduate degree in Hindi Literature from Rani Durgavati Vishwavidyalaya, Jabalpur — deepening her understanding of classical and modern Hindi literary forms.',                                                                              icon: '📜' },
        { year: '1980s', era: 'Literary Voice',       title: 'Active in Kavya Goshthi Circles',      desc: 'Becomes a regular and celebrated voice at regional kavya goshthi (poetry assemblies) across Madhya Pradesh, earning recognition for her lyrical mastery and emotive delivery.',                                                                            icon: '🎙' },
        { year: '1990s', era: 'Community Builder',    title: 'Literary Mentorship Begins',           desc: 'Chhaya dedicates herself to mentoring younger writers within her family and community, fostering a love of Hindi literature and oral tradition in the next generation.',                                                                                    icon: '🌱' },
        { year: '2005',  era: 'Recognition',          title: 'Kavya Ratna Samman',                   desc: 'Awarded the Kavya Ratna Samman by a regional poetry assembly in Indore in recognition of her original verse composition and lifelong devotion to the craft.',                                                                                             icon: '🏆' },
        { year: '2010',  era: 'Cultural Heritage',    title: 'Cultural Heritage Award',              desc: 'Recognised by the Madhya Pradesh Sahitya Parishad for sustained contribution to Hindi literary culture and the preservation of oral storytelling traditions.',                                                                                            icon: '🌺' },
        { year: '2018',  era: 'A Life of Service',    title: 'Sahitya Seva Puraskar',                desc: 'Honoured with the Sahitya Seva Puraskar for decades of literary mentorship, cultural stewardship, and bringing the beauty of Hindi poetry to every corner of her world.',                                                                                icon: '🌟' },
        { year: '2024',  era: 'Digital Chapter',      title: "Chhaya's Posts Launches",              desc: "Chhaya's words find a new home online — this very website — so that her poems, reflections, and voice recordings can reach hearts far beyond her living room.",                                                                                          icon: '💻' },
      ],
    },
    philosophy: {
      label: 'Her Craft',
      title: 'Literary Philosophy',
      items: [
        { title: 'Classical Roots',    desc: 'Grounded in the doha tradition of Kabir and Rahim, Chhaya honours the discipline and beauty of classical Hindi verse forms.' },
        { title: 'Modern Expression',  desc: 'She embraces free verse and modern idiom, believing that tradition lives best when it breathes and grows.' },
        { title: 'Bilingual Grace',    desc: 'Moving fluidly between Hindi and English, her poetry bridges generations and reaches diverse audiences.' },
        { title: 'Oral Heritage',      desc: "She insists that a poem lives most fully in the spoken voice — hence this site's audio recording feature." },
      ],
    },
    quote: {
      text:   'Poetry is not written with ink. It is written with heartbeats.',
      author: 'Chhaya Chouksey',
    },
    cta: {
      posts: 'Read Her Posts →',
      about: 'About Chhaya',
    },
  },

  hi: {
    hero: {
      label:    'शब्दों में एक जीवन',
      title:    'उपलब्धियाँ',
      subtitle: 'कविता, मार्गदर्शन और साहित्यिक समर्पण के सात दशक।',
    },
    stats: [
      { num: '40+', label: 'लेखन के वर्ष'    },
      { num: '∞',  label: 'रचित कविताएँ'    },
      { num: '3',  label: 'प्रमुख पुरस्कार' },
      { num: '2',  label: 'उपाधियाँ'        },
    ],
    timeline: {
      sectionLabel: 'यह यात्रा',
      sectionTitle: 'एक साहित्यिक कालरेखा',
      items: [
        { year: '1955',  era: 'बचपन',              title: 'पहली कविता',                          desc: 'छाया जी बचपन में ही भाषा के प्रति अपने प्रेम की खोज करती हैं — स्मृति से दोहे सुनाते हुए और अपनी पहली मौलिक रचनाएँ लिखते हुए। यह सहज प्रतिभा उनके जीवन की परिभाषा बन गई।',                                                                        icon: '✨' },
        { year: '1975',  era: 'शैक्षणिक नींव',     title: 'कला स्नातक — हिंदी एवं दर्शनशास्त्र', desc: 'बरकतउल्लाह विश्वविद्यालय, भोपाल से स्नातक की पढ़ाई पूरी कर हिंदी साहित्य और भारतीय दर्शनशास्त्र में एक सुदृढ़ अकादमिक नींव रखी।',                                                                                                                icon: '🎓' },
        { year: '1978',  era: 'विद्वत्ता की उपलब्धि',title: 'हिंदी साहित्य में परास्नातक',        desc: 'रानी दुर्गावती विश्वविद्यालय, जबलपुर से हिंदी साहित्य में परास्नातक की उपाधि अर्जित की — शास्त्रीय और आधुनिक हिंदी साहित्यिक रूपों की समझ को और गहरा किया।',                                                                                      icon: '📜' },
        { year: '1980s', era: 'साहित्यिक स्वर',     title: 'काव्य-गोष्ठी मंचों पर सक्रिय भागीदारी', desc: 'मध्यप्रदेश भर की क्षेत्रीय काव्य-गोष्ठियों में एक नियमित और सम्मानित आवाज़ बनीं — अपनी लयात्मक प्रतिभा और भावनात्मक प्रस्तुति के लिए पहचान अर्जित की।',                                                                                    icon: '🎙' },
        { year: '1990s', era: 'समाज-निर्माण',       title: 'साहित्यिक मार्गदर्शन का आरंभ',        desc: 'छाया जी ने परिवार और समाज के युवा लेखकों के मार्गदर्शन में खुद को समर्पित किया — अगली पीढ़ी में हिंदी साहित्य और मौखिक परंपरा के प्रति प्रेम जगाया।',                                                                                            icon: '🌱' },
        { year: '2005',  era: 'सम्मान',             title: 'काव्य रत्न सम्मान',                  desc: 'इंदौर की एक क्षेत्रीय काव्य-गोष्ठी द्वारा उनकी मौलिक काव्य-रचना और इस कला के प्रति जीवनपर्यंत समर्पण के लिए काव्य रत्न सम्मान से सम्मानित किया गया।',                                                                                            icon: '🏆' },
        { year: '2010',  era: 'सांस्कृतिक धरोहर',  title: 'सांस्कृतिक धरोहर पुरस्कार',          desc: 'मध्यप्रदेश साहित्य परिषद द्वारा हिंदी साहित्यिक संस्कृति में निरंतर योगदान और मौखिक कथाकथन परंपराओं के संरक्षण के लिए सम्मानित।',                                                                                                              icon: '🌺' },
        { year: '2018',  era: 'सेवा का जीवन',       title: 'साहित्य सेवा पुरस्कार',              desc: 'दशकों के साहित्यिक मार्गदर्शन, सांस्कृतिक संरक्षण और हिंदी कविता की सुंदरता को अपने संसार के हर कोने तक पहुँचाने के लिए साहित्य सेवा पुरस्कार से सम्मानित।',                                                                                    icon: '🌟' },
        { year: '2024',  era: 'डिजिटल अध्याय',      title: 'छाया\'s Posts का शुभारंभ',            desc: 'छाया जी के शब्दों को एक नया डिजिटल घर मिला — यह वेबसाइट — ताकि उनकी कविताएँ, चिंतन और वाचन उनके बैठक से परे अनगिनत हृदयों तक पहुँच सकें।',                                                                                                  icon: '💻' },
      ],
    },
    philosophy: {
      label: 'उनकी कला',
      title: 'साहित्यिक दर्शन',
      items: [
        { title: 'शास्त्रीय जड़ें',     desc: 'कबीर और रहीम की दोहा परंपरा में रचीबसी, छाया जी शास्त्रीय हिंदी काव्य रूपों के अनुशासन और सौंदर्य का सम्मान करती हैं।' },
        { title: 'आधुनिक अभिव्यक्ति', desc: 'वे मुक्त-छंद और आधुनिक मुहावरे को अपनाती हैं — मानती हैं कि परंपरा तब सबसे जीवंत होती है जब वह साँस लेती और बढ़ती है।' },
        { title: 'द्विभाषी सौम्यता',  desc: 'हिंदी और अंग्रेज़ी के बीच सहजता से आवाजाही करते हुए उनकी कविता पीढ़ियों को जोड़ती और विविध श्रोताओं तक पहुँचती है।' },
        { title: 'मौखिक विरासत',      desc: 'वे मानती हैं कि कविता स्वर में बोले जाने पर ही सबसे पूर्ण होती है — इसीलिए इस वेबसाइट पर ऑडियो रिकॉर्डिंग की सुविधा है।' },
      ],
    },
    quote: {
      text:   'कविता स्याही से नहीं, धड़कनों से लिखी जाती है।',
      author: 'छाया चौकसे',
    },
    cta: {
      posts: 'उनकी पोस्ट पढ़ें →',
      about: 'छाया के बारे में',
    },
  },
}

/* ══════════════════════════════════════════════════════════════
   Language Toggle
   ══════════════════════════════════════════════════════════════ */
function LangToggle({ lang, setLang }) {
  return (
    <div style={{ display: 'inline-flex', border: '1px solid rgba(200,155,58,0.3)', borderRadius: '2px', overflow: 'hidden' }}>
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
            color:      lang === opt.code ? '#f0d080' : 'var(--ink-mid)',
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
   Page
   ══════════════════════════════════════════════════════════════ */
export default function AccomplishmentsPage() {
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
          <div className="absolute -top-20 right-1/4 w-72 h-72 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #e8c060 0%, transparent 70%)' }} />
          <div className="absolute -bottom-20 left-1/4 w-56 h-56 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #e8c060 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-2xl mx-auto px-6">
          <p className="section-label mb-3 animate-fade-slide-up" style={{ color: '#c9993a' }}>
            {t.hero.label}
          </p>
          <h1
            className="font-display font-light mb-4 animate-fade-slide-up delay-100"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#f0d080' }}
          >
            {t.hero.title}
          </h1>
          <p className="font-body text-lg italic animate-fade-slide-up delay-200"
            style={{ color: 'rgba(200,155,58,0.75)' }}>
            {t.hero.subtitle}
          </p>

          {/* Language toggle — in hero */}
          <div className="mt-8 flex justify-center animate-fade-slide-up delay-300">
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </section>

      {/* ── Stat Pillars ─────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 -mt-8">
        <div
          className="grid grid-cols-2 md:grid-cols-4 rounded-sm overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fdfaf4, #faf3e0)',
            border: '1px solid rgba(200,155,58,0.25)',
            boxShadow: '0 8px 40px -8px rgba(45,8,16,0.2)',
          }}
        >
          {t.stats.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-8 px-4"
              style={{ borderRight: i < 3 ? '1px solid rgba(200,155,58,0.15)' : 'none' }}
            >
              <span className="font-display text-4xl md:text-5xl font-light" style={{ color: 'var(--burgundy-deep)' }}>
                {s.num}
              </span>
              <span className="font-display text-xs tracking-widest uppercase mt-1 text-center"
                style={{ color: 'var(--gold-primary)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-20">

        {/* Language toggle — top of content */}
        <div className="flex justify-end mb-10">
          <div className="flex items-center gap-3">
            <span className="font-display text-xs tracking-widest uppercase" style={{ color: 'var(--ink-soft)' }}>
              {lang === 'en' ? 'Language' : 'भाषा'}
            </span>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>

        {/* ── Timeline ─────────────────────────────────────────── */}
        <section className="mb-24">
          <div className="text-center mb-14">
            <p className="section-label mb-2">{t.timeline.sectionLabel}</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--burgundy-deep)' }}>
              {t.timeline.sectionTitle}
            </h2>
            <div className="gold-divider mt-4">
              <span className="ornament">✦</span>
            </div>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(200,155,58,0.4) 10%, rgba(200,155,58,0.4) 90%, transparent)' }}
            />

            <div className="flex flex-col gap-8">
              {t.timeline.items.map((item, i) => (
                <div
                  key={i}
                  className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} animate-fade-slide-up`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {/* Card */}
                  <div className="pl-14 md:pl-0 md:w-1/2 flex flex-col md:px-8">
                    <div className={`literary-card p-5 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <p className="section-label mb-1" style={{ textAlign: 'inherit' }}>{item.era}</p>
                      <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--burgundy-deep)' }}>
                        {item.title}
                      </h3>
                      <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--ink-mid)' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Desktop center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 flex-col items-center gap-1 z-10">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{
                        background: 'linear-gradient(135deg, var(--burgundy-mid), var(--burgundy-bright))',
                        border: '2px solid rgba(200,155,58,0.4)',
                        boxShadow: '0 0 12px rgba(200,155,58,0.2)',
                      }}
                    >
                      {item.icon}
                    </div>
                    <span className="font-display text-xs font-semibold" style={{ color: 'var(--gold-primary)' }}>
                      {item.year}
                    </span>
                  </div>

                  {/* Mobile left dot */}
                  <div className="flex md:hidden absolute left-0 flex-col items-center gap-0.5 z-10">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
                      style={{
                        background: 'linear-gradient(135deg, var(--burgundy-mid), var(--burgundy-bright))',
                        border: '2px solid rgba(200,155,58,0.4)',
                      }}
                    >
                      {item.icon}
                    </div>
                    <span className="font-display text-[10px]" style={{ color: 'var(--gold-primary)' }}>
                      {item.year}
                    </span>
                  </div>

                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Literary Philosophy ───────────────────────────────── */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <p className="section-label mb-2">{t.philosophy.label}</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--burgundy-deep)' }}>
              {t.philosophy.title}
            </h2>
            <div className="gold-divider mt-4"><span className="ornament">✦</span></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.philosophy.items.map((v, i) => (
              <div key={v.title} className="literary-card p-7 animate-fade-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--burgundy-mid)' }}>
                  {v.title}
                </h3>
                <p className="font-body text-base leading-relaxed" style={{ color: 'var(--ink-mid)' }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quote ────────────────────────────────────────────── */}
        <section
          className="rounded-sm p-10 md:p-14 text-center animate-fade-slide-up"
          style={{ background: 'linear-gradient(135deg, rgba(45,8,16,0.96), rgba(107,20,41,0.96))' }}
        >
          <span className="text-5xl mb-6 block" style={{ color: 'rgba(200,155,58,0.3)' }}>"</span>
          <p
            className="font-display text-2xl md:text-3xl italic leading-relaxed mb-8"
            style={{ color: '#f0d080' }}
          >
            {t.quote.text}
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12" style={{ background: 'rgba(200,155,58,0.4)' }} />
            <span className="font-display text-base" style={{ color: 'rgba(200,155,58,0.7)' }}>
              {t.quote.author}
            </span>
            <div className="h-px w-12" style={{ background: 'rgba(200,155,58,0.4)' }} />
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <div className="text-center mt-16 flex items-center justify-center gap-4 flex-wrap">
          <a href="/" className="btn-primary">{t.cta.posts}</a>
          <a href="/about" className="btn-secondary">{t.cta.about}</a>
        </div>

      </main>

      <Footer />
    </>
  )
}
