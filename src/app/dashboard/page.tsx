import { getSession } from "@/lib/session";

export default async function Dashboard() {
   // fetching session
   const session = await getSession();
   if (session) {
      const name = session.name;
   } else {
      console.error("There's something wrong with session!")
   }

   return (
      <h2>Berhasil masuk</h2>
   );
}