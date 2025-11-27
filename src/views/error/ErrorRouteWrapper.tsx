import { useLocation } from 'react-router';

import ErrorView from './Error.tsx';


export default function ErrorRouteWrapper() {
  const loc = useLocation();
  const state = (loc.state as { error?: unknown; status?: number | string; message?: string } | null) ?? null;
  return <ErrorView status={state?.status} message={state?.message} error={state?.error} />;
}