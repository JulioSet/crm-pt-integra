import { Conversation, Employee } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Button } from "@/ui/button"
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/ui/command"
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/ui/popover"
import { ChevronsUpDown } from "lucide-react";
import { updateNote } from "@/lib/message";
import { toast } from "sonner";
import { getSession } from "@/lib/employee";

interface MessagePanelTechProps {
   conversation: Conversation | null
   listAgent: Employee[]
   assignAgent: (chosenAgent: string) => void
}

export function MessagePanelTech({ conversation, listAgent, assignAgent }: MessagePanelTechProps) {
   const phone = conversation?.telepon || ""
   const [ID, setID] = useState('')
   const [open, setOpen] = useState(false)
   const [note, setNote] = useState(conversation?.catatan || "")

   useEffect(() => {
      (async () => {
         const session = await getSession()
         setID(session?.id)
      })()
   }, [])

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
         {/* chat delegation */}
         <div className="space-y-4">
            <Label className="text-md font-bold">Delegasi Ke</Label>
            <Popover open={open} onOpenChange={setOpen}>
               <PopoverTrigger asChild>
                  <Button
                     variant="outline"
                     role="combobox"
                     aria-expanded={open}
                     className="w-[290px] justify-between"
                  >
                     Pilih agent...
                     <ChevronsUpDown className="opacity-50" />
                  </Button>
               </PopoverTrigger>
               <PopoverContent className='w-[290px] p-0'>
                  <Command>
                     <CommandInput placeholder="Mencari agent..." className="h-10 outline-none" />
                     <CommandList className="max-h-40 overflow-y-auto">
                        <CommandEmpty className="p-2 text-center">Agent tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                           {listAgent.map((agent) => (
                              agent.id !== ID && (
                                 <CommandItem
                                    className="p-1 m-1"
                                    key={agent.id}
                                    value={agent.id}
                                    onSelect={(currentValue) => {
                                       setOpen(false)
                                       assignAgent(currentValue)
                                    }}
                                 >
                                    {agent.name}
                                 </CommandItem>
                              )
                           ))}
                        </CommandGroup>
                     </CommandList>
                  </Command>
               </PopoverContent>
            </Popover>
         </div>

         {/* notes */}
         <div className="space-y-2">
            <Label htmlFor="note" className="text-md font-bold">
               Catatan
            </Label>
            <Textarea
               id="note"
               placeholder="Add notes about this conversation..."
               value={note}
               onChange={handleNoteChange}
               className="min-h-[200px] resize-none"
            />
            <Button
               variant="default"
               size="icon"
               className="w-full"
               onClick={handleSaveNote}
            >
               Simpan
            </Button>
         </div>
      </div>
   )
}