import { useParams } from 'react-router';

import { Loading } from '../../components';
import { useRiddleGetByIdQuery } from '../../store/slices/api';
import type { AnyRiddleAPI, GPSRiddleAPI, MCQRiddleAPI, QRRiddle, TextRiddleAPI } from '../../types/api';
import { parseApiError } from '../../utils/api';
import ErrorView from '../Error';
import GPSRiddleView from './GPSRiddleView';
import MCQRiddleView from './MCQRiddleView';
import QRRiddleView from './QRRiddleView';
import TextRiddleView from './TextRiddleView';

function isMCQRiddle(riddle: AnyRiddleAPI): riddle is MCQRiddleAPI {
  return (riddle as MCQRiddleAPI).choices !== undefined;
}

function isGPSRiddle(riddle: AnyRiddleAPI): riddle is GPSRiddleAPI {
  return (riddle as GPSRiddleAPI).latitude !== undefined;
}

function isQRRiddle(riddle: AnyRiddleAPI): riddle is QRRiddle {
  return (riddle as QRRiddle).code !== undefined;
}

function isTextRiddle(riddle: AnyRiddleAPI): riddle is TextRiddleAPI {
  return (riddle as TextRiddleAPI).answer !== undefined;
}

export default function Riddle() {
  const params = useParams();
  if (!params.id) {
    throw new Error('No id provided.');
  }

  const { data: riddle, isLoading, error } = useRiddleGetByIdQuery({ id: parseInt(params.id) });

  if (isLoading) return <Loading />;

  if (error) {
    const { status, message } = parseApiError(error);
    return <ErrorView status={status} message={message} />;
  }

  if (!riddle) return <ErrorView status={404} message="Énigme introuvable" />;

  if (isMCQRiddle(riddle)) {
    return <MCQRiddleView riddle={riddle} />;
  }

  if (isGPSRiddle(riddle)) {
    return <GPSRiddleView riddle={riddle} />;
  }

  if (isQRRiddle(riddle)) {
    return <QRRiddleView riddle={riddle} />;
  }

  if (isTextRiddle(riddle)) {
    return <TextRiddleView riddle={riddle} />;
  }

  return <ErrorView status={500} message="Type d'énigme non reconnu" />;
}

