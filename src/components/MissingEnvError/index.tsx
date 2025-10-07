export default function MissingEnvError() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Configuration Error
          </h1>
          <p className="text-gray-600 mb-2">
            Missing required environment variable:
          </p>
          <code className="block bg-gray-100 px-4 py-2 rounded text-sm font-mono text-red-600 mb-4">
            VITE_INSTANT_APP_ID
          </code>
          <p className="text-gray-500 text-sm">
            Please check your <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file
            and ensure this variable is properly configured.
          </p>
        </div>
      </div>
    </div>
  );
}
