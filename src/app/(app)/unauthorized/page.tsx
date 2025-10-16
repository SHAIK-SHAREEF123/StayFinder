export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          Access Denied 🚫
        </h1>
        <p className="text-gray-600">You are not authorized to view this page.</p>
      </div>
    </div>
  );
}
