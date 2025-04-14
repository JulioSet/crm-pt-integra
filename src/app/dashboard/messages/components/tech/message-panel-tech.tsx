import { Conversation, Employee } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Button } from "@/ui/button"
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { updateNote } from "@/lib/message";
import { toast } from "sonner";

interface MessagePanelTechProps {
   conversation: Conversation | null
   listAgent: Employee[]
   assignAgent: (chosenAgent: string, role: string) => void
}

export function MessagePanelTech({ conversation }: MessagePanelTechProps) {
   const initialNote = conversation?.catatan || ""
   const phone = conversation?.telepon || ""
   const [note, setNote] = useState("")

   // to update ui accordingly
   useEffect(() => {
      setNote(initialNote)
   }, [initialNote])

   const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Handle note change
      setNote(event.target.value)
   }

   const handleSaveNote = async () => {
      // Handle save note
      await updateNote(phone, note)
      toast("Catatan berhasil disimpan")
   }

   return (
      <div className="p-4 space-y-6">
         {/* notes */}
         <div className="space-y-2">
            <Label htmlFor="note" className="text-md font-bold">
               Catatan
            </Label>
            <Textarea
               id="note"
               placeholder="Tambahkan catatan untuk percakapan ini..."
               value={note}
               onChange={handleNoteChange}
               className="min-h-[200px] resize-none"
            />
            <Button
               variant="default"
               size="icon"
               className="w-full"
               onClick={handleSaveNote}
               disabled={note === initialNote}
            >
               Simpan
            </Button>
         </div>
      </div>
   )
}