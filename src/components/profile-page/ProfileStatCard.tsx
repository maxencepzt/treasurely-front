export default function ProfileStatCard({ title, emoji, value }: { title: string, emoji: string, value: number | string }) {
  return (
    <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl px-4 py-6 shadow-md text-center border-2 border-green-600 hover:shadow-xl hover:border-green-700 hover:scale-105 transition-all duration-200">
      <div className="text-3xl mb-2">
        {emoji}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">
        {value}
      </p>
      <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {title}
      </h3>
    </div>
  );
}
