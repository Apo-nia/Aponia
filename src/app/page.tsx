export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-4 text-center drop-shadow-lg">
        Aponia
      </h1>
      <p className="text-xl text-gray-700 font-medium text-center max-w-xl">
        Your all-in-one study and content management planner
      </p>
      {/* You can add a decorative divider or icon below if desired */}
      <div className="mt-8">
        <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
          {/* <circle cx="24" cy="24" r="22" stroke="#6366F1" strokeWidth="4" /> */}
          {/* <path d="M16 24h16" stroke="#6366F1" strokeWidth="3" strokeLinecap="round"/> */}
        </svg>
      </div>
    </div>
  );}