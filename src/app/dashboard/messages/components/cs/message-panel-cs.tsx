import { Conversation, Employee, MessagePriority } from "@/lib/definitions";
import { useState } from "react";
import { cn } from "@/utils/class-merger";
import { Button } from "@/lib/ui/button"
import { Label } from "@/lib/ui/label";
import { Textarea } from "@/lib/ui/textarea";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/lib/ui/command"
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/lib/ui/popover"
import { 
   Select, 
   SelectContent, 
   SelectItem, 
   SelectTrigger, 
   SelectValue 
} from "@/lib/ui/select"
import { Check, ChevronsUpDown, Flag } from "lucide-react";
import { updateNote, updatePriority } from "@/lib/message";

interface MessagePanelCSProps {
   conversation: Conversation | null
   listAgent: Employee[]
}

export function MessagePanelCS({ conversation, listAgent }: MessagePanelCSProps) {
   const phone = conversation?.telepon || ""
   // delegasi
   const [open, setOpen] = useState(false)
   const [agent, setAgent] = useState("")
   const [note, setNote] = useState(conversation?.catatan || "")
   // priority
   const [priority, setPriority] = useState(conversation?.prioritas || "")
   // deadline

   const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Handle note change
      setNote(event.target.value)
   }

   const handleSaveNote = async () => {
      // Handle save note
      await updateNote(phone, note)
   }

   const handlePriorityChange = async (newPriority: MessagePriority) => {
      // Handle priotity change
      setPriority(newPriority)
      await updatePriority(phone, newPriority)
   }

   return (
      <div className="p-4 space-y-6">
         {/* priority level */}
         <div className="space-y-2">
            <Label htmlFor="priority" className="text-md font-bold">
               Priority Level
            </Label>
            <Select value={priority} onValueChange={handlePriorityChange}>
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Set priority" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="high" className="pt-2 pb-2 mr-1 pr-32">
                     <span className="flex items-center">
                        <Flag className="w-4 h-4 mr-2 text-red-500" />
                        High Priority
                     </span>
                  </SelectItem>
                  <SelectItem value="medium" className="pt-2 pb-2 mr-1 pr-32">
                     <span className="flex items-center">
                        <Flag className="w-4 h-4 mr-2 text-yellow-500" />
                        Medium Priority
                     </span>
                  </SelectItem>
                  <SelectItem value="low" className="pt-2 pb-2 mr-1 pr-32">
                     <span className="flex items-center">
                        <Flag className="w-4 h-4 mr-2 text-green-500" />
                        Low Priority
                     </span>
                  </SelectItem>
               </SelectContent>
            </Select>
         </div>

         {/* delegasi chat */}
         <div className="space-y-4">
            <Label className="text-md font-bold">Delegasi Ke</Label>
            <Popover open={open} onOpenChange={setOpen}>
               <PopoverTrigger asChild>
                  <Button
                     variant="outline"
                     role="combobox"
                     aria-expanded={open}
                     className="w-[200px] justify-between"
                  >
                     {agent
                     ? listAgent.find((data) => data.name === agent)?.name
                     : "Pilih agent..."}
                     <ChevronsUpDown className="opacity-50" />
                  </Button>
               </PopoverTrigger>
               <PopoverContent className='w-[200px] p-0'>
                  <Command>
                     <CommandInput placeholder="Mencari agent..." className="h-10 outline-none" />
                     <CommandList className="max-h-40 overflow-y-auto">
                     <CommandEmpty className="p-2 text-center">Agent tidak ditemukan.</CommandEmpty>
                     <CommandGroup>
                        {listAgent.map((data) => (
                           <CommandItem
                           className="p-1 m-1"
                           key={data.name}
                           value={data.name}
                           onSelect={(currentValue) => {
                              setAgent(currentValue === agent ? "" : currentValue)
                              setOpen(false)
                           }}
                           >
                           {data.name}
                           <Check
                              className={cn(
                                 "ml-auto",
                                 agent === data.name ? "opacity-100" : "opacity-0"
                              )}
                           />
                           </CommandItem>
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
               Notes
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
               Save
            </Button>
         </div>
      </div>
   )
}