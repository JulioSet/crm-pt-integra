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
import { assignHelp, assignTech, updateDeadline, updateNote, updatePriority } from "@/lib/message";
import { fetchLeader, getEmployeeByRole, getSession } from "@/lib/employee";
import { cn } from "@/utils/class-merger";
import { format } from "date-fns";
import { Calendar } from "@/ui/calendar";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { createDelegationNotification } from "@/lib/delegation";

interface MessagePanelCSProps {
   conversation: Conversation | null
   listAgent: Employee[]
   assignAgent: (chosenAgent: string, role: string) => void
}

export function MessagePanelCS({ conversation, listAgent, assignAgent }: MessagePanelCSProps) {
   // agent data
   const [isLeader, setIsLeader] = useState(false)
   const [ID, setID] = useState('')
   // conversation data
   const phone = conversation?.telepon || ""
   // delegasi
   const initialNote = conversation?.catatan || ""
   const [note, setNote] = useState("")
   const [open, setOpen] = useState(false)
   const [selectedDelegationAgent, setSelectedDelegationAgent] = useState("")
   const [reason, setReason] = useState("")
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
   const [selectedTech, setSelectedTech] = useState("")

   // just to fetch session one-time
   useEffect(() => {
      (async () => {
         const session = await getSession()
         setID(session?.id)

         const leader = await fetchLeader('cs')
         if (leader === ID) {
            setIsLeader(true)
         }
      })()
   }, [ID])

   // to update ui accordingly
   useEffect(() => {
      setNote(initialNote)
      setPriority(conversation?.prioritas || "")
      setDeadline(new Date(conversation?.deadline || new Date()))
      setSelectedHelp(conversation?.bala_bantuan || "")
      setSelectedTech(conversation?.tech || "")
      setSelectedDelegationAgent(conversation?.akses || "")
   }, [conversation?.akses, conversation?.bala_bantuan, conversation?.tech, conversation?.deadline, conversation?.prioritas, initialNote])

   const handleDelegationReasonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setReason(event.target.value)
   }

   const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Handle note change
      setNote(event.target.value)
   }

   const handleSaveNote = async () => {
      // Handle save note
      await updateNote(phone, note)
      toast("Catatan berhasil disimpan")
   }

   const handleDelegation = () => {
      assignAgent(selectedDelegationAgent, "")
      createDelegationNotification(phone, conversation?.nama || "", selectedDelegationAgent, conversation?.akses || "", reason)
      toast("Berhasil meminta persetujuan admin untuk delegasi")
      setReason("")
   }

   const handlePriorityChange = async (newPriority: MessagePriority) => {
      // Handle priotity change
      setPriority(newPriority)
      await updatePriority(phone, newPriority)
      toast("Prioritas berhasil diganti")
   }

   const handleRequestHelp = async (selectedAgent: string) => {
      await assignHelp(phone, selectedAgent)
      if (selectedAgent !== "") {
         toast("Berhasil meminta bantuan")
      } else {
         toast("Berhasil clear bantuan")
      }
   }

   const handleRequestTech = async (selectedAgent: string) => {
      await assignTech(phone, selectedAgent)
      if (selectedAgent !== "") {
         toast("Berhasil meminta teknisi")
      } else {
         toast("Berhasil clear teknisi")
      }
   }

   const handleDeadline = async () => {
      await updateDeadline(phone, deadline?.toString() || "")
      toast("Deadline berhasil ditentukan", {
         description: deadline?.toString()
      })
   }

   // set tech list
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
            <p className="text-md">
               Tanggal : {conversation?.deadline ? format(conversation?.deadline, "dd MMMM yyyy") : <span>-</span>}
            </p>
            <Popover open={openDeadline} onOpenChange={setOpenDeadline}>
               <PopoverTrigger asChild>
                  <Button
                     variant={"outline"}
                     className={cn(
                        "w-[280px] justify-start text-left font-normal hover:text-black",
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

         {/* chat delegation */}
         {isLeader && (
            <div className="space-y-4">
               <Label className="text-md font-bold">Delegasi Ke</Label>
               <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                     <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[290px] justify-between hover:text-black"
                     >
                        {listAgent.find((agent) => agent.id === selectedDelegationAgent)?.name || "Pilih agent..."}
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
                                    key={agent.id}
                                    value={agent.id}
                                    onSelect={(currentValue) => {
                                       setOpen(false)
                                       setSelectedDelegationAgent(currentValue)
                                       assignAgent(currentValue, "")
                                       toast("Berhasil meminta persetujuan admin untuk delegasi")
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
               <Textarea
                  id="delegation_reason"
                  placeholder="Tambahkan alasan delegasi disini..."
                  value={reason}
                  onChange={handleDelegationReasonChange}
                  className="min-h-[100px] resize-none"
               />
               <Button
                  variant="default"
                  size="icon"
                  className="w-full"
                  onClick={handleDelegation}
                  disabled={selectedDelegationAgent === conversation?.akses}
               >
                  Delegasi
               </Button>
            </div>
         )}

         {(conversation?.akses === ID || isLeader) && 
            <div className="space-y-4">
               {/* request help */}
               <div className="space-y-4">
                  <Label className="text-md font-bold">Request Bantuan</Label>
                  <Popover open={openHelp} onOpenChange={setOpenHelp}>
                     <PopoverTrigger asChild>
                        <Button
                           variant="outline"
                           role="combobox"
                           aria-expanded={openHelp}
                           className="w-[290px] justify-between hover:text-black"
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
                                          setOpenHelp(false)
                                          setSelectedHelp(currentValue)
                                          handleRequestHelp(currentValue)
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
                  <Button
                     variant="default"
                     size="icon"
                     className="w-full"
                     onClick={() => {
                        setSelectedHelp("")
                        handleRequestHelp("")
                     }}
                     disabled={selectedHelp === ""}
                  >
                     Clear Help
                  </Button>
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
                           className="w-[290px] justify-between hover:text-black"
                        >
                           {selectedTech
                              ? listTech.find((agent) => agent.id === selectedTech)?.name
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
                              {listTech.map((tech) => (
                                 <CommandItem
                                    className="p-1 m-1"
                                    key={tech.id}
                                    value={tech.id}
                                    onSelect={(currentValue) => {
                                       setOpenTech(false)
                                       setSelectedTech(currentValue)
                                       handleRequestTech(currentValue)
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
                  <Button
                     variant="default"
                     size="icon"
                     className="w-full"
                     onClick={() =>{
                        setSelectedTech("") 
                        handleRequestTech("")
                     }}
                     disabled={selectedTech === ""}
                  >
                     Clear Technician
                  </Button>
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