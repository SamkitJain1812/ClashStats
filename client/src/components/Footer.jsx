import React from 'react';
import { Shield, Swords, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="coc-footer">
      <div className="coc-footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <Swords size={20} className="text-gold-gradient" />
            <span className="font-game text-gold-gradient">CLASHSTAT</span>
          </div>
          <p className="footer-disclaimer">
            This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see Supercell’s Fan Content Policy.
          </p>
        </div>

        <div className="footer-links">
          <a href="https://developer.clashofclans.com/" target="_blank" rel="noreferrer" className="footer-link">
            <span>CoC API Portal</span>
            <ExternalLink size={14} />
          </a>
          <a href="https://store.supercell.com/" target="_blank" rel="noreferrer" className="footer-link">
            <span>Supercell Store</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <style>{`
        .coc-footer {
          margin-top: 60px;
          background: #070a0e;
          border-top: 1px solid var(--border-dark);
          padding: 32px 24px;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .coc-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .footer-brand {
          max-width: 600px;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.2rem;
          margin-bottom: 8px;
        }
        .footer-disclaimer {
          line-height: 1.6;
          opacity: 0.7;
        }
        .footer-links {
          display: flex;
          gap: 16px;
        }
        .footer-link {
          color: var(--gold-light);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          transition: opacity 0.2s;
        }
        .footer-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }
      `}</style>
    </footer>
  );
}
