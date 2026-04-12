'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

type TransactionType = 'Expense' | 'Income';
type Category = 'Makan' | 'Transport' | 'Tagihan' | 'Hiburan' | 'Belanja' | 'Lainnya';

const categories: { name: Category; icon: React.ReactElement }[] = [
  {
    name: 'Makan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="11"/><path d="M21 15V2a5 5 0 0 0-5 5v6h3.5c.8 0 1.5-.7 1.5-1.5z"/><path d="M18 15v7"/><path d="M7 15v7"/>
      </svg>
    ),
  },
  {
    name: 'Transport',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    name: 'Tagihan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
  {
    name: 'Hiburan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <circle cx="12" cy="12" r="2"/>
        <path d="M6 12h.01M18 12h.01"/>
      </svg>
    ),
  },
  {
    name: 'Belanja',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    name: 'Lainnya',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
      </svg>
    ),
  },
];

export default function RecordPage() {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState<TransactionType>('Expense');
  const [amount, setAmount] = useState<number>(12450.00);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Transport');
  const [note, setNote] = useState<string>('');
  const [tags, setTags] = useState<string[]>(['#Business', '#TaxDeductible']);
  const [newTag, setNewTag] = useState<string>('');

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim().startsWith('#') ? newTag.trim() : `#${newTag.trim()}`]);
      setNewTag('');
    }
  };

  const handleSaveTransaction = () => {
    // Implement save logic here
    console.log({
      type: transactionType,
      amount,
      category: selectedCategory,
      note,
      tags,
    });
  };

  return (
    <>
      <style jsx>{`
        .container {
          font-family: 'DM Sans', sans-serif;
          background: #f0f2f6;
          min-height: 100vh;
          max-width: 430px;
          margin: 0 auto;
          padding-bottom: 90px;
          color: #111827;
        }

        /* ── HEADER ── */
        .header {
          background: #f0f2f6;
          padding: 18px 20px 12px;
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
          cursor: pointer;
        }
        .back-btn {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .back-btn svg {
          width: 20px;
          height: 20px;
          stroke: #111827;
          fill: none;
          stroke-width: 2.5;
          stroke-linecap: round;
        }
        .header-title {
          font-family: 'Nunito', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #111827;
        }
        .header-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c9845a, #a0522d);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .header-avatar svg {
          width: 24px;
          height: 24px;
          fill: white;
        }

        /* ── TOGGLE TABS ── */
        .tabs-wrap {
          padding: 0 20px 6px;
        }
        .tabs {
          background: #ffffff;
          border-radius: 50px;
          padding: 4px;
          display: flex;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .tab {
          flex: 1;
          padding: 10px;
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          border-radius: 50px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          color: #9399ad;
        }
        .tab.active {
          background: #1a2f7a;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(26,47,122,0.35);
        }

        /* ── AMOUNT ── */
        .amount-section {
          padding: 14px 20px 18px;
        }
        .amount-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9399ad;
          margin-bottom: 8px;
        }
        .amount-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .amount-sign {
          font-family: 'Nunito', sans-serif;
          font-size: 28px;
          font-weight: 900;
          color: #4b5470;
        }
        .amount-value {
          font-family: 'Nunito', sans-serif;
          font-size: 42px;
          font-weight: 900;
          color: #1a2f7a;
          letter-spacing: -1px;
          line-height: 1;
        }
        .amount-cursor {
          display: inline-block;
          width: 2px;
          height: 38px;
          background: #1a2f7a;
          animation: blink 1s step-end infinite;
          margin-left: 2px;
          vertical-align: middle;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* ── CARD SECTION ── */
        .card {
          background: #ffffff;
          border-radius: 18px;
          margin: 0 20px 14px;
          padding: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .card-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9399ad;
          margin-bottom: 14px;
        }

        /* ── CATEGORY GRID ── */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .cat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }
        .cat-icon-wrap {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: #f7f8fb;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, transform 0.1s;
          border: 2px solid transparent;
          color: #9399ad;
        }
        .cat-icon-wrap svg {
          width: 24px;
          height: 24px;
        }
        .cat-item.active .cat-icon-wrap {
          background: #e8f9ef;
          border-color: #3dbf6e;
          color: #3dbf6e;
        }
        .cat-item:active .cat-icon-wrap {
          transform: scale(0.94);
        }
        .cat-name {
          font-size: 11.5px;
          font-weight: 600;
          color: #4b5470;
          text-align: center;
        }
        .cat-item.active .cat-name {
          color: #3dbf6e;
          font-weight: 700;
        }

        /* ── DATE ROW ── */
        .field-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .field-row svg {
          width: 18px;
          height: 18px;
          stroke: #9399ad;
          fill: none;
          stroke-width: 1.8;
          flex-shrink: 0;
        }
        .field-value {
          font-size: 14.5px;
          font-weight: 600;
          color: #111827;
        }

        /* ── PAYMENT ACCOUNT ── */
        .account-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .account-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .account-left svg {
          width: 20px;
          height: 20px;
          stroke: #9399ad;
          fill: none;
          stroke-width: 1.8;
          flex-shrink: 0;
        }
        .account-name {
          font-size: 14.5px;
          font-weight: 600;
          color: #111827;
        }
        .chevron {
          width: 18px;
          height: 18px;
          stroke: #9399ad;
          fill: none;
          stroke-width: 2.2;
        }

        /* ── NOTE INPUT ── */
        .note-input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #111827;
          resize: none;
          height: 36px;
        }
        .note-input::placeholder {
          color: #9399ad;
        }

        /* ── TAGS ── */
        .tags-section {
          padding: 0 20px 14px;
        }
        .tags-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9399ad;
          margin-bottom: 10px;
        }
        .tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }
        .tag-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #ffffff;
          border: 1.5px solid #e2e5ee;
          border-radius: 50px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #4b5470;
          cursor: pointer;
        }
        .tag-chip .remove {
          font-size: 11px;
          color: #9399ad;
          margin-left: 2px;
        }
        .add-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: 1.5px dashed #e2e5ee;
          border-radius: 50px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #9399ad;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .add-tag:hover {
          border-color: #1a2f7a;
          color: #1a2f7a;
        }

        /* ── SAVE BUTTON ── */
        .save-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #1a2f7a;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 17px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          width: calc(100% - 40px);
          margin: 6px 20px 24px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(26,47,122,0.3);
          transition: opacity 0.15s, transform 0.1s;
        }
        .save-btn:active {
          transform: scale(0.98);
          opacity: 0.9;
        }
        .save-btn svg {
          width: 18px;
          height: 18px;
          stroke: white;
          fill: none;
          stroke-width: 2.5;
          flex-shrink: 0;
        }

        /* fade-in */
        .card, .tags-section, .save-btn {
          animation: fadeUp 0.35s ease both;
        }
        .card:nth-of-type(1) { animation-delay: 0.05s; }
        .card:nth-of-type(2) { animation-delay: 0.1s; }
        .card:nth-of-type(3) { animation-delay: 0.15s; }
        .card:nth-of-type(4) { animation-delay: 0.2s; }
        .tags-section { animation-delay: 0.25s; }
        .save-btn { animation-delay: 0.3s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="container">
        {/* HEADER */}
        <div className="header">
          <div className="header-left" onClick={() => router.back()}>
            <div className="back-btn">
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
            <span className="header-title">Financial Architect</span>
          </div>
          <div className="header-avatar">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </div>
        </div>

        {/* TOGGLE TABS */}
        <div className="tabs-wrap">
          <div className="tabs">
            <div 
              className={`tab ${transactionType === 'Expense' ? 'active' : ''}`}
              onClick={() => setTransactionType('Expense')}
            >
              Expense
            </div>
            <div 
              className={`tab ${transactionType === 'Income' ? 'active' : ''}`}
              onClick={() => setTransactionType('Income')}
            >
              Income
            </div>
          </div>
        </div>

        {/* AMOUNT */}
        <div className="amount-section">
          <div className="amount-label">Amount to Record</div>
          <div className="amount-row">
            <span className="amount-sign">$</span>
            <span className="amount-value">{amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="amount-cursor"></span>
          </div>
        </div>

        {/* SELECT CATEGORY */}
        <div className="card">
          <div className="card-label">Select Category</div>
          <div className="cat-grid">
            {categories.map((cat) => (
              <div 
                key={cat.name}
                className={`cat-item ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <div className="cat-icon-wrap">
                  {cat.icon}
                </div>
                <span className="cat-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TRANSACTION DATE */}
        <div className="card">
          <div className="card-label">Transaction Date</div>
          <div className="field-row">
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="field-value">Today, 24 Oct 2023</span>
          </div>
        </div>

        {/* PAYMENT ACCOUNT */}
        <div className="card">
          <div className="card-label">Payment Account</div>
          <div className="account-row">
            <div className="account-left">
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <span className="account-name">Main Bank Account</span>
            </div>
            <svg className="chevron" viewBox="0 0 24 24" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        {/* NOTE */}
        <div className="card">
          <div className="card-label">Note (Optional)</div>
          <input 
            className="note-input" 
            type="text" 
            placeholder="What was this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* TAGS */}
        <div className="tags-section">
          <div className="tags-label">Tags</div>
          <div className="tags-row">
            {tags.map((tag) => (
              <div key={tag} className="tag-chip">
                {tag} <span className="remove" onClick={() => handleRemoveTag(tag)}>✕</span>
              </div>
            ))}
            <button className="add-tag" onClick={handleAddTag}>+ Add Tag</button>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button className="save-btn" onClick={handleSaveTransaction}>
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          Save Transaction
        </button>
      </div>

      <BottomNav />
    </>
  );
}