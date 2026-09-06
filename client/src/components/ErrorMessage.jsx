import React from 'react';
import { AlertTriangle, ShieldAlert, RefreshCw, Key, Globe } from 'lucide-react';

export default function ErrorMessage({ error, onRetry }) {
  const status = error?.response?.status || error?.status || 500;
  const is403 = status === 403;
  const is404 = status === 404;
  const is503 = status === 503;

  const errorMessage = error?.response?.data?.message || error?.message || 'An unexpected error occurred while communicating with the server.';

  return (
    <div className="error-card-wrapper coc-card">
      <div className="error-card-header">
        <div className="error-icon-box">
          {is403 ? <ShieldAlert size={32} /> : <AlertTriangle size={32} />}
        </div>
        <div>
          <h2 className="font-game error-title">
            {is403 ? '403 ACCESS FORBIDDEN (IP WHITELIST ISSUE)' : is404 ? '404 RESOURCE NOT FOUND' : is503 ? '503 COC MAINTENANCE BREAK' : 'TELEMETRY FETCH ERROR'}
          </h2>
          <p className="error-status">HTTP Status Code: {status}</p>
        </div>
      </div>

      <div className="error-card-body">
        <p className="error-message-text">{errorMessage}</p>

        {is403 && (
          <div className="troubleshoot-box">
            {(() => {
              const ipMatch = errorMessage.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
              const detectedIp = ipMatch ? ipMatch[0] : null;
              return detectedIp ? (
                <div style={{ background: 'rgba(255, 199, 44, 0.15)', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Globe size={22} style={{ color: 'var(--gold-main)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted-beige)', fontWeight: 600 }}>Your Public IP Detected by Clash of Clans API:</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-main)', fontFamily: 'monospace', letterSpacing: '1px' }}>{detectedIp}</div>
                  </div>
                </div>
              ) : null;
            })()}
            <h4 className="troubleshoot-heading">
              <Key size={16} />
              <span>How to fix your API Key IP Whitelist:</span>
            </h4>
            <ol className="troubleshoot-steps">
              <li>
                Log in to the official <a href="https://developer.clashofclans.com/" target="_blank" rel="noreferrer">Clash of Clans Developer Portal</a>.
              </li>
              <li>
                Edit your API Key (or create a new one) and add your public IP address to the <strong>Allowed IP Addresses</strong> whitelist.
              </li>
              <li>
                Copy the key token and paste it inside <code>server/.env</code>:
                <br />
                <code>COC_API_TOKEN=your_jwt_token_here</code>
              </li>
              <li>
                Save the file and click <strong>RETRY REQUEST</strong> below.
              </li>
            </ol>
          </div>
        )}

        {is404 && (
          <div className="troubleshoot-box">
            <p>Please double-check the Player Tag or Clan Tag in the search bar. Clash of Clans tags consist of numbers and uppercase letters (e.g., <code>#Y8YLP9RR2</code> or <code>#2GP20YPVP</code>).</p>
          </div>
        )}
      </div>

      {onRetry && (
        <div className="error-card-footer">
          <button onClick={onRetry} className="coc-btn coc-btn-gold">
            <RefreshCw size={16} />
            <span>RETRY REQUEST</span>
          </button>
        </div>
      )}

      <style>{`
        .error-card-wrapper {
          max-width: 800px;
          margin: 40px auto;
          padding: 32px;
          border: 2px solid var(--red-loss);
          background: linear-gradient(180deg, #1c1417 0%, #120b0e 100%);
        }
        .error-card-header {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 59, 48, 0.2);
          padding-bottom: 16px;
        }
        .error-icon-box {
          width: 56px;
          height: 56px;
          background: rgba(255, 59, 48, 0.2);
          color: var(--red-loss);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--red-loss);
        }
        .error-title {
          font-size: 1.4rem;
          color: var(--red-loss);
          margin-bottom: 4px;
        }
        .error-status {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .error-message-text {
          font-size: 1rem;
          color: #fce8e6;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .troubleshoot-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 199, 44, 0.3);
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .troubleshoot-heading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gold-main);
          font-size: 0.95rem;
          margin-bottom: 12px;
          font-family: var(--font-heading);
        }
        .troubleshoot-steps {
          padding-left: 20px;
          color: var(--text-main);
          font-size: 0.9rem;
          line-height: 1.7;
        }
        .troubleshoot-steps a {
          color: var(--gold-light);
          text-decoration: underline;
        }
        .troubleshoot-steps code {
          background: #000;
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--gold-main);
          font-family: monospace;
        }
        .error-card-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 12px;
        }
      `}</style>
    </div>
  );
}
