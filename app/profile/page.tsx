'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/shared/BottomNav';

export default function ProfilePage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const handleExportExcel = () => {
    console.log('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    console.log('Exporting to PDF...');
  };

  const handleSignOut = () => {
    console.log('Signing out...');
    // Add sign out logic here
  };

  return (
    <>
      <style jsx>{`
        .container {
          font-family: 'DM Sans', sans-serif;
          background: #f0f2f6;
          min-height: 100vh;
          padding-bottom: 90px;
          color: #111827;
        }

        /* ── HEADER ── */
        .header {
          background: #f0f2f6;
          padding: 18px 20px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .h-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #1a2f7a;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .h-avatar svg {
          width: 22px;
          height: 22px;
          fill: white;
        }
        .header-title {
          font-family: 'Nunito', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #111827;
        }
        .bell {
          width: 36px;
          height: 36px;
          background: #ffffff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 6px rgba(0,0,0,0.08);
        }
        .bell svg {
          width: 18px;
          height: 18px;
          stroke: #111827;
          fill: none;
          stroke-width: 2;
        }

        /* ── PAGE TITLE ── */
        .page-title {
          font-family: 'Nunito', sans-serif;
          font-size: 30px;
          font-weight: 900;
          color: #c8ccd8;
          padding: 2px 20px 18px;
          line-height: 1.1;
        }

        /* ── PROFILE BLOCK ── */
        .profile-block {
          padding: 0 20px 22px;
        }
        .avatar-wrap {
          position: relative;
          width: 88px;
          height: 88px;
          margin-bottom: 14px;
        }
        .avatar-img {
          width: 88px;
          height: 88px;
          border-radius: 20px;
          background: linear-gradient(145deg, #2a3f8f, #1a2f7a);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .avatar-img svg {
          width: 80px;
          height: 80px;
        }
        .edit-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #1a2f7a;
          border: 2.5px solid #f0f2f6;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .edit-badge svg {
          width: 12px;
          height: 12px;
          stroke: white;
          fill: none;
          stroke-width: 2.5;
        }
        .profile-name {
          font-family: 'Nunito', sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 3px;
        }
        .profile-email {
          font-size: 13px;
          color: #9399ad;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .badge {
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .badge.elite {
          border: 1.5px solid #3dbf6e;
          color: #3dbf6e;
        }
        .badge.sync {
          border: 1.5px solid #9399ad;
          color: #9399ad;
        }

        /* ── SECTION ── */
        .section {
          margin: 0 20px 16px;
        }
        .section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9399ad;
          margin-bottom: 10px;
        }
        .section-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 4px 0;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        /* ── MENU ROW ── */
        .menu-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          cursor: pointer;
          transition: background 0.12s;
        }
        .menu-row:hover {
          background: #f7f8fb;
        }
        .menu-row + .menu-row {
          border-top: 1px solid #e2e5ee;
        }
        .menu-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #f7f8fb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .menu-icon svg {
          width: 20px;
          height: 20px;
          stroke: #1a2f7a;
          fill: none;
          stroke-width: 1.8;
        }
        .menu-text {
          flex: 1;
        }
        .menu-title {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 2px;
        }
        .menu-sub {
          font-size: 11.5px;
          color: #9399ad;
          font-weight: 500;
          line-height: 1.4;
        }
        .menu-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .menu-right svg {
          width: 16px;
          height: 16px;
          stroke: #9399ad;
          fill: none;
          stroke-width: 2.5;
          flex-shrink: 0;
        }
        .active-badge {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #3dbf6e;
          text-transform: uppercase;
        }

        /* ── EXPORT BUTTONS ── */
        .export-btns {
          display: flex;
          gap: 12px;
          margin-bottom: 10px;
        }
        .export-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #f7f8fb;
          border: 1.5px solid #e2e5ee;
          border-radius: 12px;
          padding: 12px;
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          cursor: pointer;
          transition: background 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .export-btn:hover {
          background: #e2e5ee;
        }
        .export-btn svg {
          width: 20px;
          height: 20px;
        }
        .export-btn.excel svg {
          stroke: #1e7e34;
          fill: none;
          stroke-width: 1.8;
        }
        .export-btn.pdf svg {
          stroke: #d62d2d;
          fill: none;
          stroke-width: 1.8;
        }
        .export-note {
          font-size: 11.5px;
          color: #9399ad;
          text-align: center;
          padding: 4px 0 6px;
        }

        /* ── PRO CARD ── */
        .pro-card {
          background: #1a2f7a;
          border-radius: 20px;
          margin: 0 20px 16px;
          padding: 22px 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 28px rgba(26,47,122,0.3);
        }
        .pro-card::before {
          content: '★';
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 80px;
          color: rgba(255,255,255,0.07);
          line-height: 1;
          pointer-events: none;
        }
        .pro-title {
          font-family: 'Nunito', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: white;
          margin-bottom: 6px;
        }
        .pro-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 18px;
          line-height: 1.5;
        }
        .pro-btn {
          background: #3dbf6e;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 12px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(61,191,110,0.35);
          transition: opacity 0.15s;
        }
        .pro-btn:active {
          opacity: 0.9;
        }

        /* ── DARK MODE TOGGLE ── */
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
        }
        .toggle-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .toggle-left .menu-icon {
          background: #f7f8fb;
        }
        .toggle-left .menu-icon svg {
          stroke: #4b5470;
        }
        .toggle {
          width: 46px;
          height: 26px;
          border-radius: 50px;
          background: #e2e5ee;
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
        }
        .toggle.on {
          background: #1a2f7a;
        }
        .toggle::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          transition: transform 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .toggle.on::after {
          transform: translateX(20px);
        }

        /* ── FOOTER ── */
        .footer {
          padding: 6px 20px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .version-txt {
          font-size: 11.5px;
          color: #9399ad;
        }
        .signout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: #d62d2d;
        }
        .signout-btn svg {
          width: 16px;
          height: 16px;
          stroke: #d62d2d;
          fill: none;
          stroke-width: 2;
        }

        /* animations */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f0f2f6;
    --white: #ffffff;
    --navy: #1a2f7a;
    --navy-dark: #131f5c;
    --green: #3dbf6e;
    --red: #d62d2d;
    --text-dark: #111827;
    --text-mid: #4b5470;
    --text-light: #9399ad;
    --border: #e2e5ee;
    --card-bg: #f7f8fb;
    --shadow: 0 2px 12px rgba(0,0,0,0.06);
    --section-label: #9399ad;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    padding-bottom: 90px;
    color: var(--text-dark);
  }

  /* ── HEADER ── */
  .header {
    background: var(--bg);
    padding: 18px 20px 10px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 10;
  }
  .header-left { display: flex; align-items: center; gap: 10px; }
  .h-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--navy);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .h-avatar svg { width: 22px; height: 22px; fill: white; }
  .header-title {
    font-family: 'Nunito', sans-serif;
    font-size: 17px; font-weight: 800; color: var(--text-dark);
  }
  .bell { width: 36px; height: 36px; background: var(--white); border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 1px 6px rgba(0,0,0,0.08); }
  .bell svg { width: 18px; height: 18px; stroke: var(--text-dark); fill: none; stroke-width: 2; }

  /* ── PAGE TITLE ── */
  .page-title {
    font-family: 'Nunito', sans-serif;
    font-size: 30px; font-weight: 900;
    color: #c8ccd8;
    padding: 2px 20px 18px;
    line-height: 1.1;
  }

  /* ── PROFILE BLOCK ── */
  .profile-block { padding: 0 20px 22px; }
  .avatar-wrap {
    position: relative; width: 88px; height: 88px; margin-bottom: 14px;
  }
  .avatar-img {
    width: 88px; height: 88px; border-radius: 20px;
    background: linear-gradient(145deg, #2a3f8f, #1a2f7a);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  /* illustrated character via CSS/SVG */
  .avatar-img svg { width: 80px; height: 80px; }
  .edit-badge {
    position: absolute; bottom: -4px; right: -4px;
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--navy);
    border: 2.5px solid var(--bg);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  }
  .edit-badge svg { width: 12px; height: 12px; stroke: white; fill: none; stroke-width: 2.5; }
  .profile-name {
    font-family: 'Nunito', sans-serif;
    font-size: 26px; font-weight: 900; color: var(--text-dark);
    margin-bottom: 3px;
  }
  .profile-email {
    font-size: 13px; color: var(--text-light); font-weight: 500; margin-bottom: 12px;
  }
  .badges { display: flex; gap: 8px; flex-wrap: wrap; }
  .badge {
    padding: 4px 12px; border-radius: 50px;
    font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
  }
  .badge.elite { border: 1.5px solid var(--green); color: var(--green); }
  .badge.sync  { border: 1.5px solid var(--text-light); color: var(--text-light); }

  /* ── SECTION ── */
  .section { margin: 0 20px 16px; }
  .section-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--section-label);
    margin-bottom: 10px;
  }
  .section-card {
    background: var(--white); border-radius: 18px;
    padding: 4px 0; box-shadow: var(--shadow);
    overflow: hidden;
  }

  /* ── MENU ROW ── */
  .menu-row {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px; cursor: pointer;
    transition: background 0.12s;
  }
  .menu-row:hover { background: #f7f8fb; }
  .menu-row + .menu-row { border-top: 1px solid var(--border); }
  .menu-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: var(--card-bg);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .menu-icon svg { width: 20px; height: 20px; stroke: var(--navy); fill: none; stroke-width: 1.8; }
  .menu-text { flex: 1; }
  .menu-title { font-size: 14px; font-weight: 700; color: var(--text-dark); margin-bottom: 2px; }
  .menu-sub   { font-size: 11.5px; color: var(--text-light); font-weight: 500; line-height: 1.4; }
  .menu-right { display: flex; align-items: center; gap: 6px; }
  .menu-right svg { width: 16px; height: 16px; stroke: var(--text-light); fill: none; stroke-width: 2.5; flex-shrink: 0; }
  .active-badge {
    font-size: 10px; font-weight: 800; letter-spacing: 0.06em;
    color: var(--green); text-transform: uppercase;
  }

  /* ── EXPORT BUTTONS ── */
  .export-btns { display: flex; gap: 12px; margin-bottom: 10px; }
  .export-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--card-bg); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 12px;
    font-size: 13px; font-weight: 700; color: var(--text-dark);
    cursor: pointer; transition: background 0.15s;
  }
  .export-btn:hover { background: var(--border); }
  .export-btn svg { width: 20px; height: 20px; }
  .export-btn.excel svg { stroke: #1e7e34; fill: none; stroke-width: 1.8; }
  .export-btn.pdf svg { stroke: var(--red); fill: none; stroke-width: 1.8; }
  .export-note { font-size: 11.5px; color: var(--text-light); text-align: center; padding: 4px 0 6px; }

  /* ── PRO CARD ── */
  .pro-card {
    background: var(--navy);
    border-radius: 20px; margin: 0 20px 16px;
    padding: 22px 20px;
    position: relative; overflow: hidden;
    box-shadow: 0 8px 28px rgba(26,47,122,0.3);
  }
  .pro-card::before {
    content: '★';
    position: absolute; right: 18px; top: 50%; transform: translateY(-50%);
    font-size: 80px; color: rgba(255,255,255,0.07); line-height: 1;
    pointer-events: none;
  }
  .pro-title {
    font-family: 'Nunito', sans-serif;
    font-size: 22px; font-weight: 900; color: white; margin-bottom: 6px;
  }
  .pro-desc { font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 18px; line-height: 1.5; }
  .pro-btn {
    background: var(--green); color: white;
    border: none; border-radius: 50px;
    padding: 12px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(61,191,110,0.35);
    transition: opacity 0.15s;
  }
  .pro-btn:active { opacity: 0.9; }

  /* ── DARK MODE TOGGLE ── */
  .toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px;
  }
  .toggle-left { display: flex; align-items: center; gap: 12px; }
  .toggle-left .menu-icon { background: var(--card-bg); }
  .toggle-left .menu-icon svg { stroke: var(--text-mid); }
  .toggle {
    width: 46px; height: 26px; border-radius: 50px;
    background: var(--border); position: relative; cursor: pointer;
    transition: background 0.2s;
  }
  .toggle.on { background: var(--navy); }
  .toggle::after {
    content: ''; position: absolute;
    top: 3px; left: 3px;
    width: 20px; height: 20px; border-radius: 50%;
    background: white; transition: transform 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }
  .toggle.on::after { transform: translateX(20px); }

  /* ── FOOTER ── */
  .footer {
    padding: 6px 20px 20px;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .version-txt { font-size: 11.5px; color: var(--text-light); }
  .signout-btn {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 700; color: var(--red);
  }
  .signout-btn svg { width: 16px; height: 16px; stroke: var(--red); fill: none; stroke-width: 2; }

  /* ── BOTTOM NAV ── */
  .bottom-nav {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 430px;
    background: var(--white); border-top: 1px solid var(--border);
    padding: 8px 0 16px;
    display: flex; justify-content: space-around; align-items: center;
    z-index: 20;
  }
  .nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    cursor: pointer; min-width: 56px;
  }
  .nav-item svg { width: 22px; height: 22px; stroke: var(--text-light); fill: none; stroke-width: 1.8; }
  .nav-item span { font-size: 9px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-light); }
  .nav-item.active .nav-pill {
    background: var(--navy); border-radius: 16px;
    padding: 6px 14px;
    display: flex; flex-direction: column; align-items: center; gap: 2px;
  }
  .nav-item.active .nav-pill svg { stroke: white; }
  .nav-item.active .nav-pill span { color: white; }

  /* animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .profile-block { animation: fadeUp 0.3s ease both; }
  .section       { animation: fadeUp 0.35s ease both; }
  .section:nth-of-type(2) { animation-delay: 0.05s; }
  .section:nth-of-type(3) { animation-delay: 0.1s; }
  .section:nth-of-type(4) { animation-delay: 0.15s; }
  .pro-card { animation: fadeUp 0.4s ease 0.18s both; }
      `}</style>

      <div className="container">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <div className="h-avatar">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <span className="header-title">The Financial Architect</span>
          </div>
          <div className="bell">
            <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
        </div>

        {/* PAGE TITLE */}
        <div className="page-title">Profile &amp; Settings v2</div>

        {/* PROFILE BLOCK */}
        <div className="profile-block">
          <div className="avatar-wrap">
            <div className="avatar-img">
              {/* Illustrated avatar character */}
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                {/* background gradient */}
                <defs>
                  <radialGradient id="bgGrad" cx="50%" cy="60%" r="60%">
                    <stop offset="0%" stopColor="#2e4499"/>
                    <stop offset="100%" stopColor="#1a2f7a"/>
                  </radialGradient>
                </defs>
                <rect width="80" height="80" rx="18" fill="url(#bgGrad)"/>
                {/* body / suit */}
                <path d="M20 80 Q20 58 40 54 Q60 58 60 80Z" fill="#1e3a8a"/>
                {/* shirt / tie */}
                <path d="M35 54 L40 58 L45 54 L43 68 L40 72 L37 68Z" fill="white" opacity="0.9"/>
                <path d="M40 58 L38 65 L40 69 L42 65Z" fill="#e63946"/>
                {/* neck */}
                <rect x="35" y="46" width="10" height="10" rx="4" fill="#f5c5a3"/>
                {/* head */}
                <ellipse cx="40" cy="36" rx="14" ry="16" fill="#f5c5a3"/>
                {/* hair */}
                <path d="M26 32 Q27 18 40 18 Q53 18 54 32 Q52 22 40 22 Q28 22 26 32Z" fill="#2c1a0e"/>
                <path d="M26 30 Q25 36 27 40 Q26 34 26 30Z" fill="#2c1a0e"/>
                <path d="M54 30 Q55 36 53 40 Q54 34 54 30Z" fill="#2c1a0e"/>
                {/* eyes */}
                <ellipse cx="34" cy="36" rx="2.5" ry="2.8" fill="white"/>
                <ellipse cx="46" cy="36" rx="2.5" ry="2.8" fill="white"/>
                <circle cx="34.5" cy="36.5" r="1.5" fill="#1a1a2e"/>
                <circle cx="46.5" cy="36.5" r="1.5" fill="#1a1a2e"/>
                <circle cx="35" cy="36" r="0.5" fill="white"/>
                <circle cx="47" cy="36" r="0.5" fill="white"/>
                {/* eyebrows */}
                <path d="M31 32 Q34 30 37 32" stroke="#2c1a0e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M43 32 Q46 30 49 32" stroke="#2c1a0e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* nose */}
                <path d="M39 38 Q40 41 41 38" stroke="#e0a882" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                {/* smile */}
                <path d="M35 44 Q40 48 45 44" stroke="#c97a5a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* ear */}
                <ellipse cx="26" cy="37" rx="2.5" ry="3" fill="#f5c5a3"/>
                <ellipse cx="54" cy="37" rx="2.5" ry="3" fill="#f5c5a3"/>
              </svg>
            </div>
            <div className="edit-badge">
              <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
          </div>
          <div className="profile-name">Julian Thorne</div>
          <div className="profile-email">julian.thorne@architect-finance.com</div>
          <div className="badges">
            <span className="badge elite">Elite Member</span>
            <span className="badge sync">Secure Sync Active</span>
          </div>
        </div>

        {/* FINANCIAL PREFERENCES */}
        <div className="section">
          <div className="section-label">Financial Preferences</div>
          <div className="section-card">
            <div className="menu-row">
              <div className="menu-icon">
                <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div className="menu-text">
                <div className="menu-title">Budget Settings</div>
                <div className="menu-sub">Global limits and rollover rules</div>
              </div>
              <div className="menu-right">
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
            <div className="menu-row">
              <div className="menu-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
              </div>
              <div className="menu-text">
                <div className="menu-title">Categories Management</div>
                <div className="menu-sub">Custom labels and icon mapping</div>
              </div>
              <div className="menu-right">
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* EXPORT REPORTS */}
        <div className="section">
          <div className="section-label">Export Reports</div>
          <div className="section-card" style={{ padding: '16px' }}>
            <div className="export-btns">
              <button className="export-btn excel" onClick={handleExportExcel}>
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8l4 4-4 4M14 16h2"/></svg>
                Excel
              </button>
              <button className="export-btn pdf" onClick={handleExportPDF}>
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
                PDF
              </button>
            </div>
            <div className="export-note">Reports include last 12 months of financial data</div>
          </div>
        </div>

        {/* DATA & CONTINUITY */}
        <div className="section">
          <div className="section-label">Data &amp; Continuity</div>
          <div className="section-card">
            <div className="menu-row">
              <div className="menu-icon">
                <svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
              </div>
              <div className="menu-text">
                <div className="menu-title">Cloud Sync</div>
                <div className="menu-sub">Last synced 2 minutes ago</div>
              </div>
              <div className="menu-right">
                <span className="active-badge">Active</span>
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
            <div className="menu-row">
              <div className="menu-icon">
                <svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.33"/></svg>
              </div>
              <div className="menu-text">
                <div className="menu-title">Export History</div>
                <div className="menu-sub">Access previous report downloads</div>
              </div>
              <div className="menu-right">
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* ARCHITECT PRO CARD */}
        <div className="pro-card">
          <div className="pro-title">Architect Pro</div>
          <div className="pro-desc">Unlock predictive analytics<br/>and multi-bank integration.</div>
          <button className="pro-btn">Manage Subscription</button>
        </div>

        {/* APP EXPERIENCE */}
        <div className="section">
          <div className="section-label">App Experience</div>
          <div className="section-card">
            <div className="toggle-row">
              <div className="toggle-left">
                <div className="menu-icon">
                  <svg viewBox="0 0 24 24" stroke="var(--text-mid)" fill="none" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                </div>
                <div className="menu-title">Dark Mode</div>
              </div>
              <div 
                className={`toggle ${darkMode ? 'on' : ''}`} 
                onClick={() => setDarkMode(!darkMode)}
              ></div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <span className="version-txt">Version 2.4.1 (Stable Build)</span>
          <button className="signout-btn" onClick={handleSignOut}>
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out of Architect
          </button>
        </div>
      </div>

      <BottomNav />
    </>
  );
}