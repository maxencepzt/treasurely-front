function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mb-6"></div>
        <p className="text-xl text-green-800 font-semibold">Chargement...</p>
      </div>
    </div>
  );
}

export default Loading;
