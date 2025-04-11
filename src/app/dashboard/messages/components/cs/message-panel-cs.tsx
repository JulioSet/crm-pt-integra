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
import { getEmployeeByRole, getSession } from "@/lib/employee";
import { cn } from "@/utils/class-merger";
import { format } from "date-fns";
import { Calendar } from "@/ui/calendar";
import { id } from "date-fns/locale";
import { toast } from "sonner";

interface MessagePanelCSProps {
   conversation: Conversation | null
   listAgent: Employee[]
   assignAgent: (chosenAgent: string) => void
}

export function MessagePanelCS({ conversation, listAgent, assignAgent }: MessagePanelCSProps) {
   // agent data
   const [ID, setID] = useState('')
   // conversation data
   const phone = conversation?.telepon || ""
   // delegasi
   const initialNote = conversation?.catatan || ""
   const [open, setOpen] = useState(false)
   const [note, setNote] = useState("")
   // priority
   const [priority, setPriority] = useState("")
   // deadline
   const [openDeadline, setOpenDeadline] = useState(false)
   const [deadline, setDeadline] = useState<Date>()
   // request help
   const [openHelp, setOpenHelp] = useState(false)
   const [selectedHelp, setSelectedHelp] = useState("")
   // request tech
   const [openTech, setOpenTech] = useState(false)
   const [listTech, setListTech] = useState<Employee[]>([])

   // just to fetch session one-time
   useEffect(() => {
      (async () => {
         const session = await getSession()
         setID(session?.id)
      })()
   }, [])

   // to update ui accordingly
   useEffect(() => {
      setNote(initialNote)
      setPriority(conversation?.prioritas || "")
      setDeadline(new Date(conversation?.deadline || new Date()))
      setSelectedHelp(conversation?.bala_bantuan || "")
   }, [conversation?.bala_bantuan, conversation?.deadline, conversation?.prioritas, initialNote])

   const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Handle note change
      setNote(event.target.value)
   }

   const handleSaveNote = async () => {
      // Handle save note
      await updateNote(phone, note)
      toast("Catatan berhasil disimpan")
   }

   const handlePriorityChange = async (newPriority: MessagePriority) => {
      // Handle priotity change
      setPriority(newPriority)
      await updatePriority(phone, newPriority)
      toast("Prioritas berhasil diganti")
   }

   const handleRequestHelp = async (selectedAgent: string) => {
      await assignHelp(phone, selectedAgent)
   }

   const handleDeadline = async () => {
      await updateDeadline(phone, deadline?.toString() || "")
      toast("Deadline berhasil ditentukan", {
         description: deadline?.toString()
      })
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

         {conversation?.akses === ID && 
            <div>
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
                              ? listAgent.find((agent) => agent.id === selectedHelp)?.name
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
                                 agent.id !== ID && (
                                    <CommandItem
                                       className="p-1 m-1"
                                       key={agent.id}
                                       value={agent.id}
                                       onSelect={(currentValue) => {
                                          setOpen(false)
                                          setSelectedHelp(currentValue)
                                          handleRequestHelp(currentValue)
                                          toast("Berhasil meminta bantuan")
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
                                    key={tech.id}
                                    value={tech.id}
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
                                    agent.id !== ID && (
                                       <CommandItem
                                          className="p-1 m-1"
                                          key={agent.id}
                                          value={agent.id}
                                          onSelect={(currentValue) => {
                                             setOpen(false)
                                             assignAgent(currentValue)
                                             handleRequestHelp("")
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
            </div>
         }

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