"use client";
import React, { useState, useEffect } from 'react';

const accessories = [
  { name: 'Bow', price: 250, img: '/images/pet/accessories/bow.png' },
  { name: 'Shade', price: 350, img: '/images/pet/accessories/shade.png' },
  { name: 'Tie', price: 500, img: '/images/pet/accessories/tie.png' },
];

export default function AccessoryShop({ userId }: { userId: string }) {
  const [owned, setOwned] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/accessory?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setOwned(data.owned);
        setPoints(data.points);
      });
  }, [userId]);

  const buyAccessory = async (name: string) => {
    setLoading(true);
    const res = await fetch('/api/accessory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, userId }),
    });
    const data = await res.json();
    setOwned(data.owned);
    setPoints(data.points);
    setLoading(false);
  };

  return (
  <div className="accessory-shop large-container">
  <h1 className="bg-[#569ab4] bg-opacity-70 backdrop-blur-sm p-6 rounded-2xl mb-8 shadow-lg w-full max-w-2xl mx-auto text-center text-2xl font-bold text-white">Focus Points: {points}</h1>
      <div className="accessory-list">
        {accessories.map(acc => (
          <div key={acc.name} className="accessory-item">
            <div className="accessory-row">
              <img src={acc.img} alt={acc.name} className="accessory-img" />
              <span className="accessory-name">{acc.name}</span>
              <span className="accessory-price">{acc.price} pts</span>
              {owned.includes(acc.name) ? (
                <button disabled>Owned</button>
              ) : (
                <button disabled={loading || points < acc.price} onClick={() => buyAccessory(acc.name)}>
                  Buy
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .shop-page { padding: 2rem; }
        .accessory-shop { max-width: 1100px; min-width: 1100px; margin: 40px auto; padding: 32px 0; }
        .large-container { min-height: 600px; min-width: 1100px; }
        .points { font-size: 1.2rem; margin-bottom: 1rem; }
        .accessory-list { display: flex; flex-direction: column; gap: 2rem; align-items: center; min-width: 1100px; }
        .accessory-item { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 1rem; width: 500px; margin: 0 auto; }
        .accessory-row { display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 1.5rem; }
        .accessory-img { width: 80px; height: 80px; object-fit: contain; }
        .accessory-name { font-weight: bold; min-width: 70px; text-align: left; }
        .accessory-price { color: #888; min-width: 70px; text-align: left; }
        button { background: #4f8cff; color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1rem; cursor: pointer; }
        button:disabled { background: #ccc; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
