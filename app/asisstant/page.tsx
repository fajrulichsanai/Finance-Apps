'use client';

import React, { useState } from 'react';

export default function AssistantPage() {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message logic
      console.log('Sending:', message);
      setMessage('');
    }
  };

  return (
    <>
    <div className="main-container">

      {/* HEADER */}
      <div className="header">
          <div className="header-left">
            <div className="avatar-icon">
              {/* robot/AI icon */}
              <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="8" width="16" height="12" rx="3"/>
                <rect x="9" y="11" width="2.5" height="2.5" rx="1" fill="#12205e"/>
                <rect x="12.5" y="11" width="2.5" height="2.5" rx="1" fill="#12205e"/>
                <rect x="9.5" y="15" width="5" height="1.5" rx=".75" fill="#12205e"/>
                <rect x="11" y="5" width="2" height="3" rx="1"/>
                <circle cx="12" cy="4.5" r="1.5"/>
                <rect x="2" y="11" width="2" height="5" rx="1"/>
                <rect x="20" y="11" width="2" height="5" rx="1"/>
              </svg>
            </div>
            <h1>AI Assistant</h1>
          </div>
          <div className="bell-btn">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="chat-area">
          {/* AI Message 1 */}
          <div className="ai-message-wrap">
            <div className="sender-label">
              <div className="dot">
                <svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="3"/><rect x="9" y="11" width="2.5" height="2.5" rx="1" fill="#12205e"/><rect x="12.5" y="11" width="2.5" height="2.5" rx="1" fill="#12205e"/><rect x="11" y="5" width="2" height="3" rx="1"/><circle cx="12" cy="4.5" r="1.5"/></svg>
              </div>
              STITCH AI
            </div>
            <div className="ai-bubble">
              Hello! I&apos;m Stitch, your personal Financial Architect. I&apos;ve analyzed your accounts. Your net worth grew by <span className="highlight">4.2%</span> this month. How can I help you optimize your wealth today?
            </div>
          </div>

          {/* User Message */}
          <div className="user-message-wrap">
            <div className="user-label">USER</div>
            <div className="user-bubble">
              Why is my spending higher than last month?
            </div>
          </div>

          {/* AI Message 2 */}
          <div className="ai-message-wrap">
            <div className="sender-label">
              <div className="dot">
                <svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="3"/><rect x="9" y="11" width="2.5" height="2.5" rx="1" fill="#12205e"/><rect x="12.5" y="11" width="2.5" height="2.5" rx="1" fill="#12205e"/><rect x="11" y="5" width="2" height="3" rx="1"/><circle cx="12" cy="4.5" r="1.5"/></svg>
              </div>
              STITCH AI
            </div>
            <div className="ai-bubble">
              Your spending increased primarily due to &quot;Uncategorized Lifestyle&quot; purchases. Here is a breakdown of the key drivers:
            </div>
          </div>

          {/* Spending Anomaly Card */}
          <div className="spending-card">
            <div className="tag">Spending Anomaly</div>
            <div className="category">Dining &amp;<br />Entertainment</div>
            <div className="amount-row">
              <div className="amount">+$450.00</div>
              <div className="vs-avg">vs average</div>
            </div>
            {/* Bar Chart */}
            <div className="bar-chart">
              <div className="bar low" style={{ height: '30%' }}></div>
              <div className="bar low" style={{ height: '38%' }}></div>
              <div className="bar mid" style={{ height: '45%' }}></div>
              <div className="bar low" style={{ height: '35%' }}></div>
              <div className="bar mid" style={{ height: '55%' }}></div>
              <div className="bar low" style={{ height: '40%' }}></div>
              <div className="bar high" style={{ height: '100%' }}></div>
            </div>
          </div>

          {/* Follow-up bubble */}
          <div className="ai-message-wrap">
            <div className="followup-bubble">
              Would you like me to set a strict dining budget for next month or find subscriptions you can cancel to offset this?
            </div>
          </div>
        </div>

        {/* QUICK REPLIES */}
        <div className="quick-replies">
          <button className="qr-btn">Why is my spending high?</button>
          <button className="qr-btn">How can I save more?</button>
          <button className="qr-btn">Set a budget</button>
        </div>

        {/* INPUT BAR */}
        <div className="input-bar">
          <input 
            type="text" 
            placeholder="Ask Stitch anything…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <div className="send-btn" onClick={handleSendMessage}>
            <svg viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          {/* Home */}
          <div className="nav-item">
            <svg viewBox="0 0 24 24"><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/><path d="M3 12v9h5v-6h8v6h5v-9"/></svg>
            <span>Home</span>
          </div>
          {/* History */}
          <div className="nav-item">
            <svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
            <span>History</span>
          </div>
          {/* Center AI button */}
          <div className="nav-item" style={{ position: 'relative' }}>
            <div className="nav-center-btn">
              <svg viewBox="0 0 24 24" fill="white"><rect x="4" y="8" width="16" height="12" rx="3"/><rect x="9" y="11" width="2.5" height="2.5" rx="1" fill="#12205e"/><rect x="12.5" y="11" width="2.5" height="2.5" rx="1" fill="#12205e"/><rect x="11" y="5" width="2" height="3" rx="1" fill="white"/><circle cx="12" cy="4.5" r="1.5" fill="white"/></svg>
            </div>
          </div>
          {/* Stats */}
          <div className="nav-item">
            <svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
            <span>Stats</span>
          </div>
          {/* Profile */}
          <div className="nav-item">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            <span>Profile</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .main-container {
          font-family: 'DM Sans', sans-serif;
          background: #f0f2f5;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* HEADER */
        .header {
          background: #f0f2f5;
          padding: 8px 20px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .header-left { display: flex; align-items: center; gap: 10px; }
        .avatar-icon {
          width: 40px; height: 40px;
          background: #12205e;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .avatar-icon svg { width: 22px; height: 22px; fill: white; }
        .header h1 {
          font-family: 'Nunito', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #1a1a2e;
        }
        .bell-btn {
          width: 38px; height: 38px;
          background: #ffffff;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 1px 6px rgba(0,0,0,0.08);
          cursor: pointer;
        }
        .bell-btn svg { width: 18px; height: 18px; stroke: #1a1a2e; }

        /* CHAT SCROLL AREA */
        .chat-area {
          flex: 1;
          overflow-y: auto;
          padding: 10px 16px 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scrollbar-width: none;
        }
        .chat-area::-webkit-scrollbar { display: none; }

        /* SENDER LABEL */
        .sender-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #888;
          text-transform: uppercase;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sender-label .dot {
          width: 20px; height: 20px;
          background: #12205e;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .sender-label .dot svg { width: 11px; height: 11px; fill: white; }

        /* AI MESSAGE BUBBLE */
        .ai-message-wrap { display: flex; flex-direction: column; }
        .ai-bubble {
          background: #ffffff;
          border-radius: 4px 18px 18px 18px;
          padding: 14px 16px;
          font-size: 14px;
          line-height: 1.6;
          color: #444;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          max-width: 90%;
        }
        .ai-bubble .highlight { color: #3dbfa0; font-weight: 700; }

        /* USER MESSAGE BUBBLE */
        .user-message-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .user-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #888;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .user-bubble {
          background: #1a2f7a;
          color: white;
          border-radius: 18px 4px 18px 18px;
          padding: 14px 18px;
          font-size: 14px;
          line-height: 1.6;
          max-width: 82%;
          box-shadow: 0 4px 16px rgba(26,47,122,0.3);
        }

        /* SPENDING CARD */
        .spending-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          margin: 4px 0;
        }
        .spending-card .tag {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #888;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .spending-card .category {
          font-family: 'Nunito', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #12205e;
          line-height: 1.15;
          margin-bottom: 6px;
        }
        .spending-card .amount-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 14px;
        }
        .spending-card .amount {
          font-family: 'Nunito', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #d62d2d;
        }
        .spending-card .vs-avg {
          font-size: 11px;
          color: #888;
          font-weight: 500;
        }

        /* BAR CHART */
        .bar-chart {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 56px;
          padding-top: 4px;
        }
        .bar {
          flex: 1;
          border-radius: 4px 4px 0 0;
        }
        .bar.low  { background: #dde2ef; }
        .bar.mid  { background: #c2cade; }
        .bar.high { background: #d62d2d; }

        /* FOLLOW-UP BUBBLE */
        .followup-bubble {
          background: #ffffff;
          border-radius: 4px 18px 18px 18px;
          padding: 14px 16px;
          font-size: 13.5px;
          line-height: 1.65;
          color: #444;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          max-width: 90%;
        }

        /* QUICK REPLIES */
        .quick-replies {
          display: flex;
          gap: 8px;
          padding: 6px 16px 10px;
          overflow-x: auto;
          scrollbar-width: none;
          flex-shrink: 0;
        }
        .quick-replies::-webkit-scrollbar { display: none; }
        .qr-btn {
          white-space: nowrap;
          background: #ffffff;
          border: 1.5px solid #e0e3ea;
          border-radius: 20px;
          padding: 8px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          color: #1a1a2e;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .qr-btn:hover { background: #12205e; color: white; border-color: #12205e; }

        /* INPUT BAR */
        .input-bar {
          background: #ffffff;
          border-top: 1px solid #e0e3ea;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .input-bar input {
          flex: 1;
          border: none;
          outline: none;
          background: #f0f2f5;
          border-radius: 20px;
          padding: 10px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #1a1a2e;
        }
        .send-btn {
          width: 40px; height: 40px;
          background: #12205e;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: opacity 0.15s;
        }
        .send-btn:hover { opacity: 0.85; }
        .send-btn svg { width: 18px; height: 18px; fill: white; }

        /* BOTTOM NAV */
        .bottom-nav {
          background: #ffffff;
          border-top: 1px solid #e0e3ea;
          padding: 10px 0 16px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-shrink: 0;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          flex: 1;
        }
        .nav-item svg { width: 22px; height: 22px; }
        .nav-item span {
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.03em;
          color: #888;
          text-transform: uppercase;
        }
        .nav-item.active span { color: #12205e; }
        .nav-item.active svg { stroke: #12205e; }
        .nav-item svg { stroke: #888; fill: none; stroke-width: 1.8; }

        /* CENTER NAV BUTTON */
        .nav-center-btn {
          width: 52px; height: 52px;
          background: #12205e;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-top: -22px;
          box-shadow: 0 4px 16px rgba(26,47,122,0.35);
          cursor: pointer;
        }
        .nav-center-btn svg { width: 24px; height: 24px; fill: white; stroke: none; }

        /* Scroll animation */
        .ai-message-wrap, .user-message-wrap, .spending-card, .followup-bubble {
          animation: fadeUp 0.35s ease both;
        }
        .ai-message-wrap:nth-child(2) { animation-delay: 0.1s; }
        .user-message-wrap           { animation-delay: 0.2s; }
        .ai-message-wrap:nth-child(4) { animation-delay: 0.3s; }
        .spending-card               { animation-delay: 0.45s; }
        .followup-bubble             { animation-delay: 0.55s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}