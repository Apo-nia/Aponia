"use client";

import Calendar from '../../../components/Calendar';

const CalendarPage = () => {
    return (
        <main 
            className="relative flex min-h-screen flex-col items-center justify-center p-12"
            style={{
            backgroundImage: `url('/background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            }}
        >
        <div>
            <Calendar />
        </div>
    </main>
    );
};

export default CalendarPage;