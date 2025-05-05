"use client"

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/ui/table"
import { Button } from "@/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { useEffect, useState } from "react"
import { RoomChat } from "@/lib/definitions"
import { cn } from "@/utils/class-merger"
import { fetchComplains, sendRoomLink } from "@/lib/email_complain"

export default function EmailComplainPage() {
   const [loading, setLoading] = useState(true)
   const [origin, setOrigin] = useState('')
   const [currentPage, setCurrentPage] = useState(1)
   const [pageSize, setPageSize] = useState(5)
   const [emailComplain, setEmailComplain] = useState<RoomChat[]>([])

   useEffect(() => {
      setOrigin(window.location.origin)
      const fetchData = async () => {
         const data = await fetchComplains()
         if (data) {
          setEmailComplain(data)
         }
      }
      setInterval(fetchData, 1000)
      setLoading(false)
   }, [])

   // Send Email
   const handleSendEmail = async (id: string, to: string) => {
      const link = `${origin}/room/${id}`;
      const text = `Terima kasih sudah mencapai kami untuk menyampaikan keluhan\nJoin dalam link ini untuk melakukan percakapan dengan layanan kami\nSilahkan klik link dibawah ini \n${link}`
      await sendRoomLink(id, to, text)
   }

   // Calculate pagination
   const totalPages = Math.ceil(emailComplain.length / pageSize)
   const startIndex = (currentPage - 1) * pageSize
   const endIndex = startIndex + pageSize
   const paginatedAgents = emailComplain.slice(startIndex, endIndex)

   // Handle page size change
   const handlePageSizeChange = (value: string) => {
      const newPageSize = Number(value)
      const newTotalPages = Math.ceil(emailComplain.length / newPageSize)
      setPageSize(newPageSize)
      // Adjust current page if it would exceed the new total pages
      if (currentPage > newTotalPages) {
         setCurrentPage(newTotalPages)
      }
   }

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Email Keluhan</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 pl-3.5">
                <span className="text-sm text-muted-foreground">Baris per halaman</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {[5, 10, 20, 30, 40, 50].map((size) => (
                      <SelectItem key={size} value={size.toString()} className="pr-5 pt-1 pb-1">
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground pr-5">
                <span>
                  Menunjukkan {startIndex + 1}-{Math.min(endIndex, emailComplain.length)} dari {emailComplain.length}
                </span>
                <span>|</span>
                <span>Halaman {currentPage} of {totalPages}</span>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Keluhan</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAgents.map((complain) => {
                  let status
                  if (complain.status_terkirim) {
                    status = 'Sudah Terkirim'
                  } else {
                    status = 'Belum Terkirim'
                  }

                  return (
                    <TableRow key={complain.id} className="hover:bg-slate-100">
                      <TableCell>{complain.nama}</TableCell>
                      <TableCell>{complain.keluhan}</TableCell>
                      <TableCell>{status}</TableCell>
                      <TableCell>
                        <div>
                          <Button
                            variant={"default"}
                            onClick={() => {handleSendEmail(complain.id, complain.email)}}
                          >
                            Kirim Link
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <div className="flex items-center justify-end space-x-2 p-4">
              <Button
                className={cn(
                  "p-2 pl-3 pr-3",
                  currentPage === 1 ? "text-gray-400 hover:bg-transparent" : ""
                )}
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                className={cn(
                  "p-2 pl-3 pr-3",
                  currentPage === totalPages ? "text-gray-400 hover:bg-transparent" : ""
                )}
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}