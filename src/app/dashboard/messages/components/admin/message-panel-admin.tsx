import { Conversation, Employee } from "@/lib/definitions";
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
import { ChevronsUpDown } from "lucide-react";
import { updateNote } from "@/lib/message";
import { getEmployeeByRole } from "@/lib/employee";
import { toast } from "sonner";

interface MessagePanelAdminProps {
   conversation: Conversation | null
   assignAgent: (chosenAgent: string, role: string) => void
}

export function MessagePanelAdmin({ conversation, assignAgent }: MessagePanelAdminProps) {
   const initialNote = conversation?.catatan || ""
   const phone = conversation?.telepon || ""
   const [open, setOpen] = useState(false)
   const [job, setJob] = useState("sales")
   const [listAgent, setListAgent] = useState<Employee[]>([])
   const [loadingAgent, setLoadingAgent] = useState(true)
   const [selectedAgent, setSelectedAgent] = useState("")
   const [note, setNote] = useState(conversation?.catatan || "")

   const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Handle note change
      setNote(event.target.value)
   }

   const handleSaveNote = async () => {
      // Handle save note
      await updateNote(phone, note)
      toast("Catatan berhasil disimpan")
   }

   useEffect(() => {
      (async () => {
         setLoadingAgent(true)
         const data = await getEmployeeByRole(job)
         setListAgent(data)
         setSelectedAgent(conversation?.akses || "")
         setLoadingAgent(false)
      })()
   }, [conversation?.akses, job])

   useEffect(() => {
      setJob(conversation?.role_penanggung_jawab || "sales")
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <div className="p-4 space-y-6">
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
                                             assignAgent(currentValue, job)
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
      </div>
   )
}