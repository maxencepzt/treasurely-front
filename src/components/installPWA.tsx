import { useState } from "react";
import { faDownload, faRefresh, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import usePWA from "../hooks/usePWA";

function InstallPWA() {
  const { isInstallable, installPWA, needRefresh, updateServiceWorker } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  const shouldShow = isInstallable || needRefresh;

  if (!shouldShow) return null;
  if (isDismissed) return null;

  const title = needRefresh ? "Mise à jour disponible" : "Installer l'application";
  const description = needRefresh
    ? "Une nouvelle version de l'application est disponible"
    : "Installez Treasurely sur votre appareil pour une meilleure expérience";
  const btnText = needRefresh ? "Mettre à jour" : "Installer";
  const icon = needRefresh ? faRefresh : faDownload;

  const handleAction = () => {
    if (needRefresh) {
      updateServiceWorker();
    } else {
      installPWA();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-5">
        {!shouldShow && (
          <div className="mb-3 px-2 py-1 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
            <strong>MODE DEV:</strong> Toast affiché pour test. Appuyez sur <kbd className="px-1 py-0.5 bg-white border border-yellow-400 rounded">Ctrl+Shift+P</kbd> pour afficher en prod.
            <br/>
            <span className="text-xs">isInstallable: {String(isInstallable)} | needRefresh: {String(needRefresh)}</span>
          </div>
        )}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            needRefresh ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-700'
          }`}>
            <FontAwesomeIcon icon={icon} className="text-lg" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-3">{description}</p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAction}
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors shadow-md hover:shadow-lg ${
                  needRefresh 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-700 hover:bg-green-800'
                }`}
              >
                {btnText}
              </button>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="cursor-pointer px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fermer"
          >
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPWA;