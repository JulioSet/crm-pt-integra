import { Conversation, Employee, MessageLabel, MessagePriority } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Button } from "@/ui/button"
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { 
   Select, 
   SelectContent, 
   SelectItem, 
   SelectTrigger, 
   SelectValue 
} from "@/ui/select"
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
import { CalendarIcon, ChevronsUpDown, Flag, DollarSign, Flame, Snowflake } from "lucide-react";
import { assignHelp, assignTech, updateDeadline, updateLabel, updateName, updateNote, updatePriority } from "@/lib/message";
import { getEmployeeByRole } from "@/lib/employee";
import { toast } from "sonner";
import { createDelegationNotification } from "@/lib/delegation";
import { format } from "date-fns";
import { cn } from "@/utils/class-merger";
import { Calendar } from "@/ui/calendar";
import { id } from "date-fns/locale";
import { createContact } from "@/lib/contact";
import { customAlphabet } from "nanoid";

interface MessagePanelAdminProps {
   conversation: Conversation | null
   assignAgent: (chosenAgent: string, role: string) => void
}

export function MessagePanelAdmin({ conversation, assignAgent }: MessagePanelAdminProps) {
   const initialNote = conversation?.catatan || ""
   const phone = conversation?.telepon || ""
   // add contact
   const [client, setClient] = useState('')
   // label
   const [label, setLabel] = useState("")
   // priority
   const [priority, setPriority] = useState("")
   // deadline
   const [openDeadline, setOpenDeadline] = useState(false)
   const [deadline, setDeadline] = useState<Date>()
   // delegasi
   const [open, setOpen] = useState(false)
   const [job, setJob] = useState("sales")
   const [listAgent, setListAgent] = useState<Employee[]>([])
   const [loadingAgent, setLoadingAgent] = useState(true)
   const [selectedAgent, setSelectedAgent] = useState("")
   const [reason, setReason] = useState("")
   const [note, setNote] = useState("")
   // request help
   const [openHelp, setOpenHelp] = useState(false)
   const [selectedHelp, setSelectedHelp] = useState("")
   // request tech
   const [openTech, setOpenTech] = useState(false)
   const [listTech, setListTech] = useState<Employee[]>([])
   const [selectedTech, setSelectedTech] = useState("")

   const handleClientChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Handle name change
      setClient(event.target.value)
   }
   
   const handleDelegationReasonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setReason(event.target.value)
   }

   const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNote(event.target.value)
   }

   const handleAddContact = async () => {
      const nanoid = customAlphabet('1234567890', 10) // id
      await createContact(nanoid(), client, phone)
      await updateName(phone, client)
      toast("Kontak baru berhasil disimpan")
   }

   const handleLabelChange = async (newLabel: MessageLabel) => {
      // Handle status change
      setLabel(newLabel)
      await updateLabel(phone, newLabel)
      toast("Label berhasil diganti")
   }

   const handlePriorityChange = async (newPriority: MessagePriority) => {
      // Handle priotity change
      setPriority(newPriority)
      await updatePriority(phone, newPriority)
      toast("Prioritas berhasil diganti")
   }

   const handleDeadline = async () => {
      await updateDeadline(phone, deadline?.toString() || "")
      toast("Deadline berhasil ditentukan", {
         description: deadline?.toString()
      })
   }

   const handleSaveNote = async () => {
      await updateNote(phone, note)
      toast("Catatan berhasil disimpan")
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

   const handleDelegation = () => {
      assignAgent(selectedAgent, job)
      createDelegationNotification(phone, conversation?.nama || "", selectedAgent, conversation?.akses || "", reason)
      toast("Berhasil delegasi chat")
      setReason("")
   }

   // set delegation list
   useEffect(() => {
      (async () => {
         setLoadingAgent(true)
         const data = await getEmployeeByRole(job)
         setListAgent(data)
         setSelectedAgent(conversation?.akses || "")
         setLoadingAgent(false)
      })()
   }, [conversation?.akses, job])

   // set tech list
   useEffect(() => {
      (async () => {
         const data = await getEmployeeByRole('tech')
         setListTech(data)
      })()
   }, [])

   useEffect(() => {
      setJob(conversation?.role_penanggung_jawab || "sales")
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

  // to update ui accordingly
   useEffect(() => {
      setNote(initialNote)
      setLabel(conversation?.label || "")
      setPriority(conversation?.prioritas || "")
      setDeadline(new Date(conversation?.deadline || new Date()))
      setSelectedTech(conversation?.tech || "")
      setSelectedHelp(conversation?.bala_bantuan || "")
      setSelectedAgent(conversation?.akses || "")
   }, [conversation?.label, conversation?.prioritas, conversation?.deadline, conversation?.tech, conversation?.akses, conversation?.bala_bantuan, initialNote])

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
         <div className="space-y-4">
            <Label className="text-md font-bold">Delegasi Ke</Label>
            <div className="flex space-x-2">
               {/* select role */}
               <Select value={job} onValueChange={setJob}>
                  <SelectTrigger className="w-40">
                     <SelectValue placeholder="Peran" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="sales" className="pt-2 pb-2 pr-4">
                        Sales
                     </SelectItem>
                     <SelectItem value="cs" className="pt-2 pb-2 pr-4">
                        Customer Service
                     </SelectItem>
                     <SelectItem value="tech" className="pt-2 pb-2 pr-4">
                        Technical Support
                     </SelectItem>
                  </SelectContent>
               </Select>
               {/* select agent */}
               <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                     <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between hover:text-black"
                     >
                        {listAgent.find((agent) => agent.id === selectedAgent)?.name || "Pilih agent..."}
                        <ChevronsUpDown className="opacity-50" />
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px] p-0 mr-4'>
                     <Command>
                        <CommandInput placeholder="Mencari agent..." className="h-10 outline-none" />
                        <CommandList className="max-h-40 overflow-y-auto">
                           {loadingAgent ? (
                              <div className="flex justify-center pt-2 pb-2">
                                 <div className="w-4 h-4 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                           ) : (
                              <div>
                                 <CommandEmpty className="p-2 text-center">Agent tidak ditemukan.</CommandEmpty>
                                 <CommandGroup>
                                    {listAgent.map((agent) => (
                                       <CommandItem
                                          className="p-1 m-1"
                                          key={agent.id}
                                          value={agent.id}
                                          onSelect={(currentValue) => {
                                             setOpen(false)
                                             setSelectedAgent(currentValue)
                                          }}
                                       >
                                          {agent.name}
                                       </CommandItem>
                                    ))}
                                 </CommandGroup>
                              </div>
                              ) 
                           }
                        </CommandList>
                     </Command>
                  </PopoverContent>
               </Popover>
            </div>
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
               disabled={selectedAgent === conversation?.akses}
            >
               Delegasi
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

         {/* add contact */}
         {conversation?.nama === null && (
            <div className="space-y-4">
               <Label className="text-md font-bold">Add Contact</Label>
               <Textarea
                  id="client"
                  placeholder="Isi dengan nama kontak klien..."
                  value={client}
                  onChange={handleClientChange}
                  className="min-h-[10px] resize-none"
               />
               <Button
                  variant="default"
                  size="icon"
                  className="w-full"
                  onClick={handleAddContact}
                  disabled={client === ''}
               >
                  Tambah Kontak
               </Button>
            </div>
         )}
      </div>
   )
}