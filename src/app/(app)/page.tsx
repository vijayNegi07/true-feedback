"use client"
import  Link  from 'next/link'
import Navbar from '@/components/Navbar'

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: 'Anonymous mode',
    body: 'Let your team speak honestly without fear. Anonymous submissions surface the feedback that matters most.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    title: 'Smart tagging',
    body: 'Categorize every entry with structured tags. Patterns emerge automatically — no manual sorting required.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Close the loop',
    body: 'Reply, resolve, and let contributors see their feedback in action. Trust compounds over time.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: 'Embed anywhere',
    body: 'Drop a widget into your product or share a public link. Works in minutes, not sprints.',
  },
]

const testimonials = [
  {
    quote: "Pulse replaced three separate tools. Our team now reviews everything in one place.",
    name: 'Meredith Calloway',
    role: 'Head of Product, Novato',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
  },
  {
    quote: "The anonymous mode was the feature that finally got our quieter engineers to open up.",
    name: 'James Okonkwo',
    role: 'Engineering Manager, Relay',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
  },
  {
    quote: "We launched a public feedback board for our beta users. Signups went up 40%.",
    name: 'Suki Tanaka',
    role: 'Co-founder, Fieldwork',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format',
  },
]

const logos = ['Vercel', 'Stripe', 'Linear', 'Notion', 'Loom', 'Figma']

export default function Landing() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 72px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px 4px 6px',
          borderRadius: 99, border: '1px solid var(--border)', background: 'var(--bg-subtle)',
          marginBottom: 28, fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)',
        }}>
          <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>
            New
          </span>
          Anonymous feedback mode is now live
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 700, letterSpacing: '-1.5px',
          lineHeight: 1.05, color: 'var(--text)', marginBottom: 20,
        }}>
          Feedback that actually<br />
          <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            drives change
          </span>
        </h1>

        <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
          Give your team a structured, beautiful place to collect and act on feedback — from users, peers, and anyone who matters.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signUp" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
            borderRadius: 10, fontWeight: 600, fontSize: 14, color: '#fff',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
          }}>
            Get started free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
          <Link href="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
            borderRadius: 10, fontWeight: 500, fontSize: 14, color: 'var(--text-secondary)',
            border: '1px solid var(--border)', background: 'var(--surface)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            Browse feedback
          </Link>
        </div>

        {/* Social proof */}
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 28, marginBottom: 10 }}>
          Trusted by teams at
        </p>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          {logos.map(l => (
            <span key={l} style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '-0.2px' }}>{l}</span>
          ))}
        </div>
      </section>

      {/* App screenshot mockup */}
      <section style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{
          borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
          background: 'var(--bg-subtle)',
        }}>
          {/* Fake browser bar */}
          <div style={{ padding: '12px 16px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ef4444', '#f59e0b', '#22c55e'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ flex: 1, background: 'var(--bg-subtle)', borderRadius: 6, height: 26, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
              <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>pulse.app/feed</span>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop&auto=format"
            alt="Product preview"
            style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }}
          />
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { value: '12,480', label: 'Feedbacks shared' },
            { value: '340+', label: 'Active teams' },
            { value: '94%', label: 'Response rate' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', color: 'var(--text)', marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Features</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.8px', lineHeight: 1.1, color: 'var(--text)', marginBottom: 14 }}>
            Everything your team needs
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto' }}>
            Four principles guide every feature we ship — and every one we don't.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {features.map(f => (
            <div key={f.title} style={{
              padding: '24px', borderRadius: 14, border: '1px solid var(--border)',
              background: 'var(--surface)', boxShadow: 'var(--shadow-sm)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 9, background: 'var(--accent-subtle)',
                color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Testimonials</p>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.6px', color: 'var(--text)' }}>
              Loved by product teams
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{
                padding: '24px', borderRadius: 14, border: '1px solid var(--border)',
                background: 'var(--surface)', boxShadow: 'var(--shadow-sm)',
                display: 'flex', flexDirection: 'column', gap: 20,
              }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.65, flex: 1 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', background: 'var(--bg-muted)' }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{
          borderRadius: 20, padding: '64px 40px', textAlign: 'center',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
          boxShadow: '0 20px 60px rgba(99,102,241,0.25)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.8px', color: '#fff', marginBottom: 12, lineHeight: 1.1 }}>
              Start collecting feedback today
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 32 }}>
              Free for individuals and small teams. No credit card required.
            </p>
            <Link href="/signUp" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 26px',
              borderRadius: 10, fontWeight: 600, fontSize: 14,
              background: '#fff', color: 'var(--accent)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              Create free account
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Pulse</span>
          <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>© 2026 Pulse. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <a key={item} href="#" style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
