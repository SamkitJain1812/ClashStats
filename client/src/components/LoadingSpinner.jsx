import React from 'react';
import { Swords } from 'lucide-react';

export default function LoadingSpinner({ message = 'FETCHING TELEMETRY FROM CLASH OF CLANS API...' }) {
  return (
    <div className="loader-container">
      <div className="loader-icon-box">
        <Swords size={32} className="loader-swords" />
      </div>
      <p className="font-game text-gold-gradient loader-text">{message}</p>

      <style>{`
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          text-align: center;
        }
        .loader-icon-box {
          width: 72px;
          height: 72px;
          background: var(--gold-gradient);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #121a24;
          box-shadow: var(--gold-shadow);
          animation: pulseGlow 1.5s infinite alternate ease-in-out;
          margin-bottom: 20px;
        }
        .loader-swords {
          animation: spinSwords 2s infinite linear;
        }
        .loader-text {
          font-size: 1.1rem;
          letter-spacing: 1px;
        }

        @keyframes pulseGlow {
          0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 199, 44, 0.2); }
          100% { transform: scale(1.08); box-shadow: 0 0 25px rgba(255, 199, 44, 0.6); }
        }
        @keyframes spinSwords {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
