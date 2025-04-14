import { Conversation, Employee, MessageLabel } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { cn } from "@/utils/class-merger";
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
import { ChevronsUpDown, DollarSign, Flame, Snowflake } from "lucide-react"
import { assignHelp, updateLabel, updateName, updateNote } from "@/lib/message";
import { toast } from "sonner";
import { fetchLeader, getSession } from "@/lib/employee";
import { createContact } from "@/lib/contact";
import { customAlphabet } from "nanoid";

interface MessagePanelSalesProps {
   conversation: Conversation | null
   listAgent: Employee[]
   assignAgent: (chosenAgent: string, role: string) => void
}

export function MessagePanelSales({ conversation, listAgent, assignAgent }: MessagePanelSalesProps) {
   // agent data
   const [isLeader, setIsLeader] = useState(false)
   const [ID, setID] = useState('')
   // conversation data
   const phone = conversation?.telepon || ""
   // add contact
   const [client, setClient] = useState('')
   // delegasi
   const initialNote = conversation?.catatan || ""
   const [openDelegasi, setOpenDelegasi] = useState(false)
   const [selectedDelegationAgent, setSelectedDelegationAgent] = useState("")
   const [note, setNote] = useState("")
   // label
   const [label, setLabel] = useState("")
   // request help
   const [openHelp, setOpenHelp] = useState(false)
   const [selectedHelp, setSelectedHelp] = useState("")

   // just to fetch session one-time
   useEffect(() => {
      (async () => {
         const session = await getSession()
         setID(session?.id)

         const leader = await fetchLeader('sales')
         if (leader === ID) {
            setIsLeader(true)
         }
      })()
   }, [ID])

   // to update ui accordingly
   useEffect(() => {
      setLabel(conversation?.label || "")
      setNote(initialNote)
      setSelectedHelp(conversation?.bala_bantuan || "")
   }, [conversation?.bala_bantuan, conversation?.label, initialNote])

   const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Handle note change
      setNote(event.target.value)
   }

   const handleClientChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Handle name change
      setClient(event.target.value)
   }

   const handleSaveNote = async () => {
      // Handle save note
      await updateNote(phone, note)
      toast("Catatan berhasil disimpan")
   }
   
   const handleLabelChange = async (newLabel: MessageLabel) => {
      // Handle status change
      setLabel(newLabel)
      await updateLabel(phone, newLabel)
      toast("Label berhasil diganti")
   }
   
   const handleRequestHelp = async (selectedAgent: string) => {
      await assignHelp(phone, selectedAgent)
      toast("Berhasil meminta bantuan")
   }
   
   const handleAddContact = async () => {
      const nanoid = customAlphabet('1234567890', 10) // id
      await createContact(nanoid(), client, phone)
      await updateName(phone, client)
      toast("Kontak baru berhasil disimpan")
   }

   return (
      <div className="p-4 space-y-6">
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
         
         {/* chat delegation */}
         {isLeader && (
            <div className="space-y-4">
               <Label className="text-md font-bold">Delegasi Ke</Label>
               <Popover open={openDelegasi} onOpenChange={setOpenDelegasi}>
                  <PopoverTrigger asChild>
                     <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openDelegasi}
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
                                    setOpenDelegasi(false)
                                    assignAgent(currentValue, "")
                                    setSelectedDelegationAgent(currentValue)
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
            </div>
         )}

         {/* request help */}
         {(conversation?.akses === ID || isLeader) && 
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
                                       setOpenDelegasi(false)
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