'use client';

import React, { useState, useEffect, useRef } from 'react';

// SVG Icons as React Components
const IconMenu = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const IconSettings = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconArrow = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IconRefresh = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const IconHome = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconUser = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconSparkles = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const IconRocket = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/></svg>;
const IconPlay = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IconStats = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;

// Helpers
const getColPos = (c: number) => (c * 100) / 3;
const getRowPos = (r: number) => (r * 100) / 2;

const fruits = [
  { id: 0, x: getColPos(0), y: getRowPos(0) }, // Apple
  { id: 1, x: getColPos(1), y: getRowPos(0) }, // Banana
  { id: 2, x: getColPos(2), y: getRowPos(0) }, // Cherry
  { id: 3, x: getColPos(3), y: getRowPos(0) }, // Grapes
  { id: 4, x: getColPos(0), y: getRowPos(1) }, // Orange
  { id: 5, x: getColPos(1), y: getRowPos(1) }, // Peach
  { id: 6, x: getColPos(2), y: getRowPos(1) }, // Strawberry
  { id: 7, x: getColPos(3), y: getRowPos(1) }, // Watermelon
];

type Card = {
  instanceId: number;
  fruitId: number;
  isFlipped: boolean;
  isMatched: boolean;
};

type GameStatus = 'LOBBY' | 'PLAYING' | 'PAUSED' | 'FINISHED';

export default function FruitCardGame() {
  const [status, setStatus] = useState<GameStatus>('LOBBY');
  const [userName, setUserName] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [view, setView] = useState('play'); // 'home', 'play', 'stats'

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    if (!userName.trim()) return alert('이름을 입력해주세요!');
    const cardPool: Card[] = [];
    for (let i = 0; i < 8; i++) {
      cardPool.push({ instanceId: i * 2, fruitId: i, isFlipped: false, isMatched: false });
      cardPool.push({ instanceId: i * 2 + 1, fruitId: i, isFlipped: false, isMatched: false });
    }
    const shuffled = cardPool.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedCount(0);
    setTotalClicks(0);
    setTimer(0);
    setStatus('PLAYING');
    startTimer();
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
  };

  const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const handleCardClick = (index: number) => {
    if (status !== 'PLAYING' || flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
    
    setTotalClicks(prev => prev + 1);
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].fruitId === cards[second].fruitId) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatchedCount(prev => prev + 2);
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (matchedCount === 16) {
      setStatus('FINISHED');
      stopTimer();
    }
  }, [matchedCount]);

  useEffect(() => { return () => stopTimer(); }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const accuracy = totalClicks > 0 ? Math.round((16 / totalClicks) * 100) : 0;

  return (
    <div className="app-wrapper">
      <header className="header">
        <IconMenu />
        <span className="brand">Kinetic Orchard</span>
        <IconSettings />
      </header>

      {status === 'LOBBY' && (
        <main className="screen fade-in">
          <div className="blobs">
            <div className="blob pink">🍎</div>
            <div className="blob green">🌿</div>
          </div>
          <h1 className="title">Fruit Match</h1>
          <p className="tagline">Taste the kinetic energy.</p>

          <div className="main-card">
            <label className="label">Player Identity</label>
            <div className="input-field">
              <IconUser />
              <input 
                type="text" 
                placeholder="Enter your name..." 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <button className="btn-large btn-red" onClick={startGame}>
              Start Game <IconArrow />
            </button>
          </div>

          <div className="chips">
            <div className="chip">⏱️ 60s Round</div>
            <div className="chip">⭐ Daily High: 2,400</div>
          </div>
        </main>
      )}

      {status === 'PLAYING' && (
        <main className="screen fade-in">
          <div className="header-info" style={{width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
             <h2 style={{fontSize: '1.5rem'}}>{userName}</h2>
             <span className="timer" style={{fontWeight: 800}}>{formatTime(timer)}</span>
          </div>
          
          <div className="grid">
            {cards.map((card, idx) => (
              <div 
                key={card.instanceId} 
                className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
                onClick={() => handleCardClick(idx)}
              >
                <div className="card-inner">
                  <div className="card-front">🍎</div>
                  <div className="card-back">
                    <div 
                      className="fruit-img" 
                      style={{
                        backgroundImage: `url('/fruits.png')`,
                        backgroundSize: '400% 300%',
                        backgroundPosition: `${fruits[card.fruitId].x}% ${fruits[card.fruitId].y}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-large btn-gray" onClick={() => setStatus('LOBBY')}>Quit</button>
        </main>
      )}

      {status === 'FINISHED' && (
        <main className="screen fade-in">
          <h1 className="title">Well Done!</h1>
          
          <div className="main-card" style={{textAlign: 'center'}}>
            <label className="label">Total Time</label>
            <div className="big-time">{formatTime(timer)}</div>
            
            <div className="stat-boxes">
              <div className="stat-box green">
                <IconSparkles />
                <span className="val">{accuracy}%</span>
                <span className="desc">Accuracy</span>
              </div>
              <div className="stat-box yellow">
                <IconRocket />
                <span className="val">#12</span>
                <span className="desc">Global Rank</span>
              </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <button className="btn-large btn-red" onClick={startGame}>
                <IconRefresh /> Play Again
              </button>
              <button className="btn-large btn-gray" onClick={() => setStatus('LOBBY')}>
                 <IconHome /> Home
              </button>
            </div>
          </div>

          <p style={{marginTop: '40px', fontWeight: 800, color: '#999', cursor: 'pointer'}}>BRAG TO FRIENDS 📤</p>
        </main>
      )}

      <nav className="bottom-nav">
        <div className="nav-container">
          <div className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
             <div className="icon-circle"><IconHome /></div>
             <span>Home</span>
          </div>
          <div className={`nav-item ${view === 'play' ? 'active' : ''}`} onClick={() => setView('play')}>
             <div className="icon-circle"><IconPlay /></div>
             <span>Play</span>
          </div>
          <div className={`nav-item ${view === 'stats' ? 'active' : ''}`} onClick={() => setView('stats')}>
             <div className="icon-circle"><IconStats /></div>
             <span>Stats</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
