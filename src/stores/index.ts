import { configureStore } from '@reduxjs/toolkit';
import bannerReducer from './store/bannerSlice';
import categoryReducer from './store/categoryPhotoSlice'
import galleryReducer from './store/galleryPhotosSlice'
import categoryVideoReducer from './store/categoryVideoSlice'
import videoReducer from './store/videoSlice'
import categoryNewsReducer from './store/categoryNewsSlice'
import newsReducer from './store/newsSlice'
import guruReducer from './store/pegawaiSlice'
import registrasiSiswa from './store/pendaftaranSlice'
export const store = configureStore({
  reducer: {
    banner: bannerReducer,
    categoryPhoto : categoryReducer,
    gallery : galleryReducer,
    categoryVideo : categoryVideoReducer,
    video : videoReducer,
    categoryNews : categoryNewsReducer,
    news  : newsReducer,
    guru : guruReducer,
        registrasionSiswa : registrasiSiswa
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
