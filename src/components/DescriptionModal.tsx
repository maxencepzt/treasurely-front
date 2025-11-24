type DescriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description: string;
};

export default function DescriptionModal({ isOpen, onClose, title = "Description complète", description }: DescriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative mx-4 shadow-2xl">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-light leading-none"
          onClick={onClose}
          aria-label="Fermer"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 pr-8">{title}</h2>
        <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line">{description}</div>
      </div>
    </div>
  );
}

