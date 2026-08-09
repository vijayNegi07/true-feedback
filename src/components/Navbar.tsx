"use client"
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { User } from 'better-auth'
import { Button } from './ui/button'
import { signOut } from '@/app/actions/auth'

export default function Navbar() {
  const pathname  = usePathname()
  const [open, setOpen] = useState(false)

  const {data:session} = authClient.useSession();

  const user : User = session?.user as User;

  

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <Link href={'/'} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.3px' }}>Pulse</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
          {[ { to: '/', label: 'Home' },{ to: '/dashboard', label: 'Explore' }].map(l => (
            <Link key={l.to} href={l.to} style={{
              padding: '5px 12px', borderRadius: 7, fontSize: 14, fontWeight: 500,
                color: pathname === l.to ? 'var(--accent)' :'var(--text-secondary)',
                 background: pathname === l.to ? 'var(--accent-subtle)': 'transparent',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (pathname !== l.to) (e.target as HTMLElement).style.background = 'var(--bg-subtle)' }}
            onMouseLeave={e => { if (pathname !== l.to) (e.target as HTMLElement).style.background = 'transparent' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden-mobile">
          {!session && !user ? (
            <>
            <Link href="/signIn" style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 13.5, fontWeight: 500,
            color: 'var(--text-secondary)', border: '1px solid var(--border)',
            background: 'var(--surface)', boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s',
          }}>
            Log in
          </Link>
          <Link href="/signUp" style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 13.5, fontWeight: 500,
            color: '#fff', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 1px 3px rgba(99,102,241,0.4)',
            transition: 'all 0.15s',
          }}>
            Sign up
          </Link>
            </>
          ):(<Button
          onClick={signOut}
          style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 13.5, fontWeight: 500,
            color: '#fff', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 1px 3px rgba(99,102,241,0.4)',
            transition: 'all 0.15s',
          }}
          
          >Log Out</Button>)}
        </div>

        <button onClick={() => setOpen(!open)} style={{ display: 'none', padding: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} className="show-mobile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            {open ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 24px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link href="/feed" onClick={() => setOpen(false)} style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', padding: '6px 0' }}>Explore</Link>
          <Link href="/post" onClick={() => setOpen(false)} style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', padding: '6px 0' }}>Share feedback</Link>
          <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <Link href="/login" onClick={() => setOpen(false)} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 7 }}>Log in</Link>
            <Link href="/signup" onClick={() => setOpen(false)} style={{ fontSize: 13, color: '#fff', padding: '6px 12px', borderRadius: 7, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>Sign up</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  )
}

