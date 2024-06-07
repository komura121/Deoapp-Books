import { create } from "zustand";

const usePageStore = create((set) => ({
  chapters: [],
  newChapter: null,
  description: "",
  coverImageUrl: "https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png",
  isImageBoxVisible: false,
  response: "",


  setChapters: (chapters) => set({ chapters }),
  setNewChapter: (newChapter) => set({ newChapter }),
  setDescription: (description) => set({ description }),
  setCoverImageUrl: (coverImageUrl) => set({ coverImageUrl }),
  setIsImageBoxVisible: (isVisible) => set({ isImageBoxVisible: isVisible }),
  setResponse: (response) => set({ response }),

}));

export default usePageStore;
