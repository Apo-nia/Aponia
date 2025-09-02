'use client';

import React, { useState, useEffect } from 'react';
import petImageMap from './petImageMap';
import { getPetMood } from './PetMoodLogic';
import PetNotification from './PetNotification';

interface PetDisplayProps {
  userId: string;
}

const PetDisplay: React.FC<PetDisplayProps> = ({ userId }) => {
  const [user, setUser] = useState<any>(null);
  const [petMood, setPetMood] = useState('happy');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/petstatus?userId=${userId}`);
      const data = await res.json();
      if (data && data.petType) {
        setUser(data);
        setPetMood(data.petMood || 'happy');
      }
    }
    fetchUser();
  }, [userId]);

  if (!user) return null;

  const petType = user.petType || 'cow';
  const now = new Date();
  const lastStreak = new Date(user.streak?.lastCompletionDate);
  const hoursSinceStreak = (now.getTime() - lastStreak.getTime()) / (1000 * 60 * 60);
  const hasOngoingStreak = user.streak?.currentStreak > 0 && hoursSinceStreak < 24;
  const canRestore = user.streak?.canRestore;

  const happyQuotes = [
    "Keep going, you're doing great!",
    "Every step counts!",
    "Your streak is awesome!",
    "Success is a habit!",
    "Stay focused and happy!"
  ];

  const handlePetClick = () => {
    if (petMood === 'sleepy' && hoursSinceStreak >= 24 && hoursSinceStreak < 48) {
      setPetMood('hungry');
      // Optionally, update via API
    }
    if (canRestore && !hasOngoingStreak) {
      setPetMood('happy');
      setNotification('Streak restored!');
      setTimeout(() => setNotification(null), 2000);
    }
    if (hasOngoingStreak) {
      setPetMood('happy');
      setNotification(happyQuotes[Math.floor(Math.random() * happyQuotes.length)]);
      setTimeout(() => setNotification(null), 2500);
    }
  };

  const displayMood = getPetMood({ petMood, hasOngoingStreak, canRestore, hoursSinceStreak });
  let displayImgSrc = petImageMap[petType]?.[displayMood] || '/images/pet/basic/cow_happy.png';
  // Check for accessories and use correct image if available
  if (petType === 'cow' && user?.accessories?.includes('Bow')) {
    const accessoryKey = `bow_${displayMood}`;
    displayImgSrc = petImageMap.cow[accessoryKey] || displayImgSrc;
  }

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <PetNotification notification={notification} />
      <img 
        src={displayImgSrc} 
        alt={`${petType} is ${displayMood}`} 
        width={200} 
        height={200} 
        style={{ cursor: 'pointer' }} 
        onClick={handlePetClick}
      />
    </div>
  );
};

export default PetDisplay;
