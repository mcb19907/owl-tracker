import type { ReactNode } from 'react'
import { tokens, SHELL_W, SHELL_H } from '../tokens'

const STARFIELD = `radial-gradient(1px 1px at 23px 47px, white, transparent),
  radial-gradient(1px 1px at 89px 132px, white, transparent),
  radial-gradient(1px 1px at 230px 78px, white, transparent),
  radial-gradient(1px 1px at 312px 200px, white, transparent),
  radial-gradient(1px 1px at 56px 340px, white, transparent),
  radial-gradient(1px 1px at 280px 410px, white, transparent),
  radial-gradient(1px 1px at 132px 530px, white, transparent),
  radial-gradient(1px 1px at 200px 620px, white, transparent),
  radial-gradient(0.5px 0.5px at 73px 220px, white, transparent),
  radial-gradient(0.5px 0.5px at 184px 89px, white, transparent),
  radial-gradient(0.5px 0.5px at 320px 290px, white, transparent),
  radial-gradient(circle at 50% 0%, rgba(155,180,255,0.12), transparent 50%)`

export function NocturnalShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: SHELL_W,
        height: SHELL_H,
        background: tokens.bg,
        color: tokens.text,
        fontFamily: tokens.sans,
        fontSize: 14,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.55,
          backgroundImage: STARFIELD,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  )
}
