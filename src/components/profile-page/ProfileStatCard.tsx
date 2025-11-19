export default function ProfileStatCard({ title, emoji, value }: { title: string, emoji: string, value: number | string }) {
  return (
    <div className="bg-white rounded-xl px-8 py-5 shadow-md text-center border-2 border-green-600 h-28 flex flex-col justify-center w-[45%] hover:shadow-lg hover:border-green-700 transition-all">
      <h3 className="text-sm font-bold text-gray-900 mb-1 text-center">
        {title}
      </h3>
      <p className="text-gray-700 text-center text-base font-semibold">
        {emoji} {value}
      </p>
    </div>
  );
}
