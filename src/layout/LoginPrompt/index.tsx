interface LoginPromptProps {
  returnTo?: string;
}

export default function LoginPrompt({ returnTo = "/category/favorites" }: LoginPromptProps) {
  const handleLogin = () => {
    window.location.href = `/login?returnTo=${encodeURIComponent(returnTo)}`;
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-4">
        Please log in to use favorites
      </h2>
      <p className="text-gray-600 mb-6">
        You need to be logged in to save and view your favorite prayers.
      </p>
      <button
        onClick={handleLogin}
        className="bg-[#0082cb] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#006ba6] transition-colors"
      >
        Log In
      </button>
    </div>
  );
}
