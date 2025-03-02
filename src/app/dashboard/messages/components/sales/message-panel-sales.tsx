import { Conversation, Employee, MessageLabel } from "@/lib/definitions";
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
import { Check, ChevronsUpDown, DollarSign, Flame, Snowflake } from "lucide-react"
import { updateLabel, updateNote } from "@/lib/message";

interface MessagePanelSalesProps {
   conversation: Conversation | null
   listAgent: Employee[]
}

export function MessagePanelSales({ conversation, listAgent }: MessagePanelSalesProps) {
   const phone = conversation?.telepon || ""
   // delegasi
   const [open, setOpen] = useState(false)
   const [agent, setAgent] = useState("")
   const [note, setNote] = useState(conversation?.catatan || "")
   // label
   const [label, setLabel] = useState(conversation?.label || "")
   // request help

   const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Handle note change
      setNote(event.target.value)
   }

   const handleSaveNote = async () => {
      // Handle save note
      await updateNote(phone, note)
   }

   const handleLabelChange = async (newLabel: MessageLabel) => {
      // Handle status change
      setLabel(newLabel)
      await updateLabel(phone, newLabel)
   }

   return (
      <div className="p-4 space-y-6">
         {/* label */}
         <div className="space-y-4">
            <Label className="text-md font-bold">Label</Label>
            <div className="flex flex-col gap-2">
               <Button
                  variant={label === "hot" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLabelChange("hot")}
                  className={cn(
                     "flex justify-start",
                     label === "hot" && "bg-red-500 hover:bg-red-600"
                  )}
               >
                  <Flame className="w-4 h-4 m-2" />
                  Hot Lead
               </Button>
               <Button
                  variant={label === "cold" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLabelChange("cold")}
                  className={cn(
                     "flex justify-start",
                     label === "cold" && "bg-blue-500 hover:bg-blue-600"
                  )}
               >
                  <Snowflake className="w-4 h-4 m-2" />
                  Cold Lead
               </Button>
               <Button
                  variant={label === "deal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLabelChange("deal")}
                  className={cn(
                     "flex justify-start",
                     label === "deal" && "bg-green-500 hover:bg-green-600"
                  )}
               >
                  <DollarSign className="w-4 h-4 m-2" />
                  Potential Deal
               </Button>
            </div>
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