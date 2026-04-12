'use client';

import React from 'react';

export default function BudgetPage() {
  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <div className="avatar">
            {/* person icon */}
            <svg viewBox="0 0 24 24" fill="white"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="white"/></svg>
          </div>
          <span className="header-title">The Financial Architect</span>
        </div>
        <div className="bell">
          <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
      </div>

      {/* PAGE TITLE */}
      <div className="page-title-section">
        <div className="page-subtitle">Portfolio Management</div>
        <div className="page-title">Budget Control</div>
      </div>

      {/* TOTAL SPENT CARD */}
      <div className="total-card">
        <div className="total-label">Total Spent This Month</div>
        <div className="total-amount">$4,285<span style={{ fontSize: '32px' }}>.00</span></div>
        <div className="total-meta">
          <div className="meta-item">
            <div className="meta-label">Monthly Goal</div>
            <div className="meta-val">$5,000.00</div>
          </div>
          <div className="meta-item">
            <div className="meta-label">Remaining</div>
            <div className="meta-val remaining">$715.00</div>
          </div>
        </div>
      </div>

      {/* UTILIZATION CARD */}
      <div className="util-card">
        <div className="util-label">Utilization</div>
        <div className="donut-wrap">
          <svg viewBox="0 0 100 100">
            <circle className="donut-bg" cx="50" cy="50" r="45"/>
            <circle className="donut-fill" cx="50" cy="50" r="45"/>
          </svg>
          <div className="donut-text">85%</div>
        </div>
        <div className="util-desc">You have used 85.7% of your set limit for<br />September.</div>
      </div>

      {/* CATEGORY LIMITS */}
      <div className="section-header">
        <div className="section-title">Category Limits</div>
        <button className="filters-btn">
          <svg viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          Filters
        </button>
      </div>

      {/* FOOD & DINING */}
      <div className="category-card">
        <div className="cat-top">
          <div className="cat-icon food">
            <svg viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
          </div>
          <div className="cat-info">
            <div className="cat-name">Food &amp; Dining</div>
            <div className="cat-txn">12 transactions</div>
          </div>
        </div>
        <div className="cat-amounts">
          <div>
            <div className="spent-label">Spent</div>
            <div className="spent-val">$450.00</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="limit-label">Limit</div>
            <div className="limit-val">$800.00</div>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill green" style={{ width: '56%' }}></div>
        </div>
        <button className="cat-btn outline">Set Budget</button>
      </div>

      {/* TRANSPORT */}
      <div className="category-card">
        <div className="cat-top">
          <div className="cat-icon transport">
            <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div className="cat-info">
            <div className="cat-name">Transport</div>
            <div className="cat-txn">24 transactions</div>
          </div>
        </div>
        <div className="cat-amounts">
          <div>
            <div className="spent-label">Spent</div>
            <div className="spent-val">$320.00</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="limit-label">Limit</div>
            <div className="limit-val">$350.00</div>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill orange" style={{ width: '91%' }}></div>
        </div>
        <button className="cat-btn outline">Set Budget</button>
      </div>

      {/* BILLS & UTILITIES */}
      <div className="category-card">
        <div className="cat-top">
          <div className="cat-icon bills">
            <svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
          </div>
          <div className="cat-info">
            <div className="cat-name">Bills &amp; Utilities</div>
            <div className="cat-txn">3 transactions</div>
          </div>
        </div>
        <div className="cat-amounts">
          <div>
            <div className="spent-label">Spent</div>
            <div className="spent-val over">$1,250.00</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="limit-label">Limit</div>
            <div className="limit-val">$1,100.00</div>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill red" style={{ width: '100%' }}></div>
        </div>
        <button className="cat-btn danger">Adjust Budget</button>
      </div>

      {/* ENTERTAINMENT */}
      <div className="category-card">
        <div className="cat-top">
          <div className="cat-icon entertainment">
            <svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 2v4M12 18v4M8 2l1 4M16 2l-1 4"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div className="cat-info">
            <div className="cat-name">Entertainment</div>
            <div className="cat-txn">8 transactions</div>
          </div>
        </div>
        <div className="cat-amounts">
          <div>
            <div className="spent-label">Spent</div>
            <div className="spent-val">$120.00</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="limit-label">Limit</div>
            <div className="limit-val">$400.00</div>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill green" style={{ width: '30%' }}></div>
        </div>
        <button className="cat-btn outline">Set Budget</button>
      </div>

      {/* CREATE BUTTON */}
      <button className="create-btn">
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Create New Budget Category
      </button>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <div className="nav-item">
          <svg viewBox="0 0 24 24"><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/></svg>
          <span>Home</span>
        </div>
        <div className="nav-item active">
          <div className="nav-pill">
            <svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
            <span>Ledger</span>
          </div>
        </div>
        <div className="nav-item">
          <svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="3"/><rect x="11" y="5" width="2" height="3" rx="1"/><circle cx="12" cy="4" r="1.5"/></svg>
          <span>Assistant</span>
        </div>
        <div className="nav-item">
          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span>Charts</span>
        </div>
        <div className="nav-item">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          <span>Profile</span>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          font-family: 'DM Sans', sans-serif;
          background: #f2f3f7;
          min-height: 100vh;
          max-width: 430px;
          margin: 0 auto;
          padding-bottom: 80px;
          color: #111827;
        }

        /* ── HEADER ── */
        .header {
          background: #f2f3f7;
          padding: 18px 20px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .header-left { display: flex; align-items: center; gap: 10px; }
        .avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: #1a2f7a;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          border: 2.5px solid #1a2f7a;
        }
        .avatar svg { width: 26px; height: 26px; fill: white; }
        .header-title {
          font-family: 'Nunito', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #111827;
        }
        .bell {
          width: 38px; height: 38px;
          background: #ffffff;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 1px 6px rgba(0,0,0,0.08);
        }
        .bell svg { width: 18px; height: 18px; stroke: #111827; fill: none; stroke-width: 2; }

        /* ── PAGE TITLE ── */
        .page-title-section {
          padding: 10px 20px 18px;
        }
        .page-subtitle {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #1a2f7a;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .page-title {
          font-family: 'Nunito', sans-serif;
          font-size: 34px;
          font-weight: 900;
          color: #111827;
          line-height: 1.1;
        }

        /* ── TOTAL SPENT CARD ── */
        .total-card {
          background: #1a2f7a;
          border-radius: 20px;
          margin: 0 20px;
          padding: 22px 22px 20px;
          position: relative;
          overflow: hidden;
        }
        .total-card::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 140px; height: 140px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }
        .total-card::after {
          content: '';
          position: absolute;
          bottom: -30px; right: 40px;
          width: 90px; height: 90px;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
        }
        .total-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .total-amount {
          font-family: 'Nunito', sans-serif;
          font-size: 48px;
          font-weight: 900;
          color: white;
          line-height: 1;
          margin-bottom: 16px;
        }
        .total-meta {
          display: flex;
          gap: 28px;
        }
        .meta-item .meta-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 2px;
        }
        .meta-item .meta-val {
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          color: white;
        }
        .meta-item .meta-val.remaining { color: #4de89a; }

        /* ── UTILIZATION CARD ── */
        .util-card {
          background: #ffffff;
          border-radius: 20px;
          margin: 12px 20px;
          padding: 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .util-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8a92a6;
          align-self: flex-start;
          margin-bottom: 16px;
        }
        .donut-wrap {
          position: relative;
          width: 120px; height: 120px;
          margin-bottom: 14px;
        }
        .donut-wrap svg { width: 120px; height: 120px; transform: rotate(-90deg); }
        .donut-bg { fill: none; stroke: #e8ecf8; stroke-width: 10; }
        .donut-fill {
          fill: none;
          stroke: #1a2f7a;
          stroke-width: 10;
          stroke-linecap: round;
          stroke-dasharray: 283;
          stroke-dashoffset: 43;
          transition: stroke-dashoffset 1s ease;
        }
        .donut-text {
          position: absolute;
          inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Nunito', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: #1a2f7a;
        }
        .util-desc {
          font-size: 12.5px;
          color: #8a92a6;
          text-align: center;
          line-height: 1.5;
        }

        /* ── CATEGORY LIMITS HEADER ── */
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px 12px;
        }
        .section-title {
          font-family: 'Nunito', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #111827;
        }
        .filters-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #1a2f7a;
          text-transform: uppercase;
        }
        .filters-btn svg { width: 14px; height: 14px; stroke: #1a2f7a; fill: none; stroke-width: 2; }

        /* ── CATEGORY CARDS ── */
        .category-card {
          background: #ffffff;
          border-radius: 18px;
          margin: 0 20px 14px;
          padding: 16px 16px 14px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
        }
        .cat-top {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }
        .cat-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cat-icon svg { width: 22px; height: 22px; }
        .cat-icon.food  { background: #e6f9ee; }
        .cat-icon.food svg { stroke: #2fa05c; fill: none; stroke-width: 2; }
        .cat-icon.transport { background: #eaf0fb; }
        .cat-icon.transport svg { stroke: #1a2f7a; fill: none; stroke-width: 2; }
        .cat-icon.bills { background: #fdeaea; }
        .cat-icon.bills svg { stroke: #d62d2d; fill: none; stroke-width: 2; }
        .cat-icon.entertainment { background: #f0eaf8; }
        .cat-icon.entertainment svg { stroke: #7b5ea7; fill: none; stroke-width: 2; }

        .cat-info { flex: 1; }
        .cat-name {
          font-family: 'Nunito', sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 2px;
        }
        .cat-txn {
          font-size: 11.5px;
          color: #8a92a6;
          font-weight: 500;
        }

        .cat-amounts {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 8px;
        }
        .spent-label, .limit-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #8a92a6;
          margin-bottom: 1px;
        }
        .spent-val {
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          color: #111827;
        }
        .spent-val.over { color: #d62d2d; }
        .limit-val {
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #8a92a6;
          text-align: right;
        }

        /* PROGRESS BAR */
        .progress-track {
          width: 100%;
          height: 7px;
          background: #edf0f7;
          border-radius: 99px;
          overflow: visible;
          margin-bottom: 12px;
          position: relative;
        }
        .progress-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.8s ease;
        }
        .progress-fill.green  { background: #3dbf6e; }
        .progress-fill.orange { background: #f5a623; }
        .progress-fill.red    { background: #d62d2d; }

        /* BUTTON */
        .cat-btn {
          display: block;
          width: 100%;
          padding: 11px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          transition: opacity 0.15s, transform 0.1s;
        }
        .cat-btn:active { transform: scale(0.98); }
        .cat-btn.outline {
          background: #f2f3f7;
          color: #111827;
        }
        .cat-btn.danger {
          background: #d62d2d;
          color: white;
        }

        /* ── CREATE BUTTON ── */
        .create-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #3dbf6e;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 16px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          width: calc(100% - 40px);
          margin: 6px 20px 24px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(61,191,110,0.35);
          transition: opacity 0.15s, transform 0.1s;
        }
        .create-btn:active { transform: scale(0.98); opacity: 0.9; }
        .create-btn svg { width: 18px; height: 18px; stroke: white; fill: none; stroke-width: 2.5; }

        /* ── BOTTOM NAV ── */
        .bottom-nav {
          position: fixed;
          bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 430px;
          background: #ffffff;
          border-top: 1px solid #e4e7ef;
          padding: 8px 0 16px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 20;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          min-width: 56px;
        }
        .nav-item svg { width: 22px; height: 22px; stroke: #8a92a6; fill: none; stroke-width: 1.8; }
        .nav-item span {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #8a92a6;
        }
        .nav-item.active span { color: white; }
        .nav-item.active .nav-pill {
          background: #1a2f7a;
          border-radius: 16px;
          padding: 6px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .nav-item.active .nav-pill svg { stroke: white; }
        .nav-item.active .nav-pill span { color: white; }

        /* fade-in animation */
        .category-card {
          animation: fadeUp 0.4s ease both;
        }
        .category-card:nth-child(1) { animation-delay: 0.05s; }
        .category-card:nth-child(2) { animation-delay: 0.12s; }
        .category-card:nth-child(3) { animation-delay: 0.19s; }
        .category-card:nth-child(4) { animation-delay: 0.26s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .total-card { animation: fadeUp 0.4s ease both; }
        .util-card  { animation: fadeUp 0.4s ease 0.1s both; }
      `}</style>
    </div>
  );
}