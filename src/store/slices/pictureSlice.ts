import { createSlice } from '@reduxjs/toolkit';

type PictureState = {
  /** Change à chaque photo envoyée ou supprimée, pour que les <img> redemandent la leur. */
  version: number;
};

const initialState: PictureState = {
  version: 0,
};

/**
 * Les photos sont servies à une adresse fixe (`/users/{id}/picture`) : après un envoi, le
 * navigateur garderait l'ancienne. La version, ajoutée à l'adresse, force la nouvelle.
 */
const pictureSlice = createSlice({
  name: 'pictures',
  initialState,
  reducers: {
    pictureChanged: (state) => {
      state.version = Date.now();
    },
  },
});

export const { pictureChanged } = pictureSlice.actions;
export default pictureSlice;
