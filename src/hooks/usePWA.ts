import { useEffect, useReducer } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Étendre Window pour inclure deferredPrompt
declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent | null;
  }
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

type PWAAction =
  | { type: 'before_install_prompt'; payload: { deferredPrompt: BeforeInstallPromptEvent } }
  | { type: 'app_installed' }
  | { type: 'install_app' };

function reducer(state: PWAState, action: PWAAction): PWAState {
  switch (action.type) {
    case 'before_install_prompt': {
      return {
        ...state,
        deferredPrompt: action.payload.deferredPrompt,
        isInstallable: true,
      };
    }
    case 'app_installed': {
      return {
        ...state,
        isInstalled: true,
        isInstallable: false,
        deferredPrompt: null,
      };
    }
    case 'install_app': {
      return {
        ...state,
        isInstallable: false,
        deferredPrompt: null,
      };
    }
    default:
      return state;
  }
}

const initialState: PWAState = { isInstallable: false, isInstalled: false, deferredPrompt: null };

function usePWA() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker
  } = useRegisterSW();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();

      // Stocker dans window pour réutilisation
      window.deferredPrompt = e as BeforeInstallPromptEvent;

      dispatch({
        type: 'before_install_prompt',
        payload: {
          deferredPrompt: e as BeforeInstallPromptEvent,
        },
      });
    };

    const handleAppInstalled = () => {
      dispatch({
        type: 'app_installed',
      });
    };

    // Vérifier si l'événement a déjà été déclenché avant le montage du composant
    if (window.deferredPrompt) {
      dispatch({
        type: 'before_install_prompt',
        payload: {
          deferredPrompt: window.deferredPrompt,
        },
      });
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (!state.deferredPrompt) return;
    await state.deferredPrompt.prompt();
    await state.deferredPrompt.userChoice;

    dispatch({
      type: 'install_app',
    });
  };

  return {
    isInstallable: state.isInstallable,
    installPWA,
    needRefresh,
    updateServiceWorker,
  }
}

export default usePWA;