import { Conversation } from '@/lib/definitions';
import { getEmail, getSession } from '@/lib/employee';
import { fetchAll, getConversations } from '@/lib/message';
import { sendMail } from '@/lib/notification';
import { create } from 'zustand';

interface ChatStore {
  data: Conversation[]
  reminderIntervals: Record<string, NodeJS.Timeout>
  isFetching: boolean
  loading: boolean
  fetchData: (reminderInterval: number) => void;
  startMessageReminder: (id: string, phone: string, reminderInterval: number) => void
  stopMessageReminder: (phone: string) => void
  resetLoadingStateToLogout: () => void
}

const useChatStore = create<ChatStore>((set, get) => ({
   data: [],
   reminderIntervals: {},
   isFetching: false, // Track if fetching is active
   loading: true,
   fetchData: (reminderInterval: number) => {
      if (get().isFetching) return; // Prevent multiple intervals
      set({ isFetching: true });
      setInterval(async () => {
         const session = await getSession()
         let result
         if (session.role === 'admin') {
            result = await fetchAll()
         } else {
            result = await getConversations()
         }
         set({ data: result });
         set({ loading: false });

         // set up reminder
         result.forEach((msg: Conversation) => {
            if (!msg.baca) {
               get().startMessageReminder(session.id, msg.telepon, reminderInterval)
            }
         });
      }, 1000)
   },
   // Start a reminder for a specific message
   startMessageReminder: (id: string, phone: string, reminderInterval: number) => {
      const { reminderIntervals } = get();
      console.log(`Initiate reminder...`);

      if (!reminderIntervals[phone]) {
      console.log(`Starting reminder for message ${phone}...`);

      const interval = setInterval(async () => {
         const employee = await getEmail(id)
         const to = employee.email
         const text = `Mohon segera membalas pesan ${phone}`
         await sendMail(to, text)
      }, reminderInterval); // Every 3 minutes

      set((state) => ({
         reminderIntervals: { ...state.reminderIntervals, [phone]: interval },
      }));
      }
   },
   // Stop the reminder for a message when it's read
   stopMessageReminder: (phone: string) => {
      const { reminderIntervals } = get();

      if (reminderIntervals[phone]) {
      clearInterval(reminderIntervals[phone]);
      console.log(`Stopping reminder for message ${phone}`);

      set((state) => {
         const newIntervals = { ...state.reminderIntervals };
         delete newIntervals[phone];
         return { reminderIntervals: newIntervals };
      });
      }
   },
   // to reset state of loading to logout
   resetLoadingStateToLogout: () => {
      set({ loading: true });
   }
}));

export default useChatStore;
