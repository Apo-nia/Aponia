// Map pet type and mood to image path
const petImageMap: Record<string, Record<string, string>> = {
  cow: {
    happy: '/images/pet/basic/cow_happy.png',
    hungry: '/images/pet/basic/cow_hungry.png',
    sad: '/images/pet/basic/cow_sad.png',
    sleep: '/images/pet/basic/cow_sleep.png',
  },
  frog: {
    happy: '/images/pet/basic/frog_happy.png',
    hungry: '/images/pet/basic/frog_hungry.png',
    sad: '/images/pet/basic/frog_sad.png',
    sleep: '/images/pet/basic/frog_sleep.png',
  },
  tutel: {
    happy: '/images/pet/basic/tutel_happy.png',
    hungry: '/images/pet/basic/tutel_hungry.png',
    sad: '/images/pet/basic/tutel_sad.png',
    sleep: '/images/pet/basic/tutel_sleep.png',
  },
};

export default petImageMap;
