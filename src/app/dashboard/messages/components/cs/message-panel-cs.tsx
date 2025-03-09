import { Conversation, Employee, MessagePriority } from "@/lib/definitions";
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
import { 
   Select, 
   SelectContent, 
   SelectItem, 
   SelectTrigger, 
   SelectValue 
} from "@/ui/select"
import { CalendarIcon, ChevronsUpDown, Flag } from "lucide-react";
import { assignHelp, updateDeadline, updateNote, updatePriority } from "@/lib/message";
import { getEmployeeByRole } from "@/lib/employee";
import { cn } from "@/utils/class-merger";
import { format } from "date-fns";
import { Calendar } from "@/ui/calendar";
import { id } from "date-fns/locale";

interface MessagePanelCSProps {
   conversation: Conversation | null
   listAgent: Employee[]
   assignAgent: (chosenAgent: string) => void
}

export function MessagePanelCS({ conversation, listAgent, assignAgent }: MessagePanelCSProps) {
   const phone = conversation?.telepon || ""
   // delegasi
   const [open, setOpen] = useState(false)
   const [note, setNote] = useState(conversation?.catatan || "")
   // priority
   const [priority, setPriority] = useState(conversation?.prioritas || "")
   // deadline
   const [openDeadline, setOpenDeadline] = useState(false)
   const [deadline, setDeadline] = useState<Date | undefined>(new Date(conversation?.deadline || new Date()))
   // request help
   const [openHelp, setOpenHelp] = useState(false)
   const [selectedHelp, setSelectedHelp] = useState(conversation?.bala_bantuan || "")
   // request tech
   const [openTech, setOpenTech] = useState(false)
   const [listTech, setListTech] = useState<Employee[]>([])

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

   const handleRequestHelp = async (selectedAgent: string) => {
      await assignHelp(phone, selectedAgent)
   }

   const handleDeadline = async () => {
      await updateDeadline(phone, deadline?.toString() || "")
   }

   useEffect(() => {
      (async () => {
         const data = await getEmployeeByRole('tech')
         setListTech(data)
      })()
   }, [])

   return (
      <div className="p-4 space-y-6">
         {/* priority level */}
         <div className="space-y-2">
            <Label htmlFor="priority" className="text-md font-bold">
               Level Prioritas
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

         {/* deadline */}
         <div className="space-y-2">
            <Label htmlFor="deadline" className="text-md font-bold">
               Deadline
            </Label>
            <Popover open={openDeadline} onOpenChange={setOpenDeadline}>
               <PopoverTrigger asChild>
                  <Button
                     variant={"outline"}
                     className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !deadline && "text-muted-foreground"
                     )}
                  >
                     <CalendarIcon className="mr-2 h-4 w-4" />
                     {deadline ? format(deadline, "dd MMMM yyyy") : <span>Pilih tanggal</span>}
                  </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                     locale={id}
                     mode="single"
                     selected={deadline}
                     onSelect={(date) => {
                        setOpenDeadline(false)
                        setDeadline(date)
                     }}
                     initialFocus
                  />
               </PopoverContent>
            </Popover>
            <Button
               variant="default"
               size="icon"
               className="w-full"
               onClick={handleDeadline}
            >
               Konfirmasi
            </Button>
         </div>

         {/* request help */}
         <div className="space-y-4">
            <Label className="text-md font-bold">Request Bantuan</Label>
            <Popover open={openHelp} onOpenChange={setOpenHelp}>
               <PopoverTrigger asChild>
                  <Button
                     variant="outline"
                     role="combobox"
                     aria-expanded={openHelp}
                     className="w-[290px] justify-between"
                  >
                     {selectedHelp
                        ? listAgent.find((agent) => agent.name === selectedHelp)?.name
                        : "Pilih agent..."}
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
                           <CommandItem
                              className="p-1 m-1"
                              key={agent.name}
                              value={agent.name}
                              onSelect={(currentValue) => {
                                 setOpenHelp(false)
                                 setSelectedHelp(currentValue)
                                 handleRequestHelp(currentValue)
                              }}
                           >
                           {agent.name}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                     </CommandList>
                  </Command>
               </PopoverContent>
            </Popover>
         </div>

         {/* request tech */}
         <div className="space-y-4">
            <Label className="text-md font-bold">Request Technician</Label>
            <Popover open={openTech} onOpenChange={setOpenTech}>
               <PopoverTrigger asChild>
                  <Button
                     variant="outline"
                     role="combobox"
                     aria-expanded={openTech}
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
                        {listTech.map((tech) => (
                           <CommandItem
                              className="p-1 m-1"
                              key={tech.name}
                              value={tech.name}
                              onSelect={(currentValue) => {
                                 setOpenTech(false)
                                 assignAgent(currentValue)
                                 handleRequestHelp("")
                              }}
                           >
                           {tech.name}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                     </CommandList>
                  </Command>
               </PopoverContent>
            </Popover>
         </div>

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
                              <CommandItem
                                 className="p-1 m-1"
                                 key={agent.name}
                                 value={agent.name}
                                 onSelect={(currentValue) => {
                                    setOpen(false)
                                    assignAgent(currentValue)
                                 }}
                              >
                              {agent.name}
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