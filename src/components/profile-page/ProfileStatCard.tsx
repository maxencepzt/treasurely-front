export default function ProfileStatCard({ title, emoji, value }: { title: string, emoji: string, value: number | string }) {
  return (
    <div className="bg-white rounded-2xl px-10 py-6 shadow-lg text-center border-3 border-green-700 h-30 flex flex-col justify-center w-48">
      <h3 className="text-base font-bold text-gray-900 mb-1 text-center">
        {title}
      </h3>
      <p className="text-gray-600 text-center text-base font-semibold">
        {emoji} {value}
      </p>
    </div>
  );
}
