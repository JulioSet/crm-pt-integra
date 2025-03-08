import { Conversation } from '@/lib/definitions';
import { getConversations } from '@/lib/message';
import { create } from 'zustand';

interface ChatStore {
  data: Conversation[];
  isFetching: boolean
  loading: boolean
  fetchData: () => void;
}

const useChatStore = create<ChatStore>((set, get) => ({
   data: [],
   isFetching: false, // Track if fetching is active
   loading: true,
   fetchData: () => {
      if (get().isFetching) return; // Prevent multiple intervals
      set({ isFetching: true });
      setInterval(async () => {
         const result = await getConversations()
         set({ data: result });
         set({ loading: false });
      }, 1000)
   },
}));

export default useChatStore;
