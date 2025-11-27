import { useNavigate } from 'react-router';

import { useGetTreasureHuntRiddlesQuery } from '../store/slices/api.ts';
import { getIdFromUrl } from '../utils/api.ts';

export function UseRiddleValidation(riddle: { orderNumber: number; hunt: string }) {
  const navigate = useNavigate();
  const { data: riddles } = useGetTreasureHuntRiddlesQuery({ huntId: getIdFromUrl(riddle.hunt) });

  const nextRiddle = riddles
    ? riddles['riddles'].find((r: { orderNumber: number }) => r.orderNumber === riddle.orderNumber + 1)
    : null;
  if (nextRiddle) {
    navigate(`/riddle/${nextRiddle.id}`);
  } else {
    navigate(`/treasure-hunt/${getIdFromUrl(riddle.hunt)}/finished`);
  }
}