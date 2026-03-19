'use client';

import React, { useState, useEffect, useRef } from 'react';

// Define the 8 fruit positions (Column, Row) from the fruits.png (4x3 grid)
const fruitPositions = [
  { x: 0, y: 0 },         // Apple (Top Left)
  { x: 25, y: 0 },        // Banana
  { x: 50, y: 0 },        // Cherry
  { x: 75, y: 0 },        // Grapes
  { x: 0, y: 50 },        // Orange (Middle row) <- Wait, if 3 rows, middle is 50? No, 1/3, 2/3. 
                          // If 3 rows: row0=0%, row1=50%, row2=100%? Let's assume 3 rows are spaced.
  { x: 25, y: 50 },       // Peach
  { x: 50, y: 50 },       // Strawberry
  { x: 75, y: 50 },       // Watermelon
];

// Correcting Y positions for 3 rows: 0%, 50%, 100% or 0, 33.3, 66.6?
// Actually in background-position: (W-w)*X/(C-1). X is index. C is count.
// For 4 columns: 0%, 33.3%, 66.6%, 100%. Wait. (X * 100 / (C-1))
// X=0 -> 0%, X=1 -> 33.3%, X=2 -> 66.6%, X=3 -> 100%.

const getColPos = (c: number) => (c * 100) / 3; // 4 columns (0,1,2,3)
const getRowPos = (r: number) => (r * 100) / 2; // 3 rows (0,1,2)

const fruits = [
  { id: 0, name: 'Apple', x: getColPos(0), y: getRowPos(0) },
  { id: 1, name: 'Banana', x: getColPos(1), y: getRowPos(0) },
  { id: 2, name: 'Cherry', x: getColPos(2), y: getRowPos(0) },
  { id: 3, name: 'Grapes', x: getColPos(3), y: getRowPos(0) },
  { id: 4, name: 'Orange', x: getColPos(0), y: getRowPos(1) },
  { id: 5, name: 'Peach', x: getColPos(1), y: getRowPos(1) },
  { id: 6, name: 'Strawberry', x: getColPos(2), y: getRowPos(1) },
  { id: 7, name: 'Watermelon', x: getColPos(3), y: getRowPos(1) },
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
  const [bestTime, setBestTime] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game
  const startGame = () => {
    if (!userName.trim()) return alert('이름을 입력해주세요!');
    
    // Create 16 cards (8 pairs)
    const cardPool: Card[] = [];
    for (let i = 0; i < 8; i++) {
      cardPool.push({ instanceId: i * 2, fruitId: i, isFlipped: false, isMatched: false });
      cardPool.push({ instanceId: i * 2 + 1, fruitId: i, isFlipped: false, isMatched: false });
    }
    
    // Shuffle
    const shuffled = cardPool.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedCount(0);
    setTimer(0);
    setStatus('PLAYING');
    
    startTimer();
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePause = () => {
    if (status === 'PLAYING') {
      setStatus('PAUSED');
      stopTimer();
    } else if (status === 'PAUSED') {
      setStatus('PLAYING');
      startTimer();
    }
  };

  const restartGame = () => {
    stopTimer();
    startGame();
  };

  const goHome = () => {
    stopTimer();
    setStatus('LOBBY');
    setUserName('');
  };

  const handleCardClick = (index: number) => {
    if (status !== 'PLAYING' || flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].fruitId === cards[second].fruitId) {
        // Match!
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatchedCount(prev => prev + 2);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedCount === 16) {
      setStatus('FINISHED');
      stopTimer();
    }
  }, [matchedCount]);

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="container">
      {status === 'LOBBY' && (
        <div className="lobby animate-in">
          <h1>🍒 과일 짝맞추기 🍒</h1>
          <p style={{marginBottom: '1rem', color: '#666'}}>이름을 입력하고 게임을 시작하세요!</p>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="이름을 입력하세요" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startGame()}
            />
          </div>
          <button className="btn btn-primary" onClick={startGame}>게임 시작</button>
        </div>
      )}

      {(status === 'PLAYING' || status === 'PAUSED' || status === 'FINISHED') && (
        <div className="game-area">
          <div className="game-info">
            <div className="user-label">플레이어: <strong>{userName}</strong></div>
            <div className="timer">{formatTime(timer)}</div>
          </div>

          <div className="grid">
            {cards.map((card, idx) => (
              <div 
                key={card.instanceId} 
                className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
                onClick={() => handleCardClick(idx)}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <span style={{fontSize: '2rem', filter: 'grayscale(1)'}}>?</span>
                  </div>
                  <div className="card-back">
                    <div 
                      className="fruit-img" 
                      style={{
                        backgroundImage: `url('/fruits.png')`,
                        backgroundSize: '400% 300%',
                        backgroundPosition: `${fruits[card.fruitId].x}% ${fruits[card.fruitId].y}%`,
                        width: '100%',
                        height: '100%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="controls">
            <button className="btn btn-primary" onClick={togglePause}>
              {status === 'PAUSED' ? '계속하기' : '정지'}
            </button>
            <button className="btn btn-secondary" onClick={restartGame}>다시 시작</button>
          </div>
          
          <button className="btn btn-outline" onClick={goHome}>처음으로</button>

          {status === 'PAUSED' && (
            <div className="overlay">
              <h2>일시 정지됨</h2>
              <button className="btn btn-primary" style={{marginTop: '1rem'}} onClick={togglePause}>재개하기</button>
            </div>
          )}

          {status === 'FINISHED' && (
            <div className="overlay">
              <h1 style={{fontSize: '3rem'}}>🎉 완료! 🎉</h1>
              <p>{userName}님, 대단해요!</p>
              <div className="result-time">{formatTime(timer)}</div>
              <div className="controls">
                <button className="btn btn-primary" onClick={restartGame}>다시 한 번 더!</button>
                <button className="btn btn-secondary" onClick={goHome}>메인으로</button>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .animate-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
