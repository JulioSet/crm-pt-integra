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
import { Conversation, Employee } from "@/lib/definitions"
import { getEmployeeByRole } from "@/lib/employee"
import { getResponseTimeSetting } from "@/lib/setting"
import { cn } from "@/utils/class-merger"
import { Badge } from "@/ui/badge"

interface SalesPerformanceTableProps {
  conversations: Conversation[]
}

export function CSPerformanceTable({ conversations }: SalesPerformanceTableProps) {
   const [currentPage, setCurrentPage] = useState(1)
   const [pageSize, setPageSize] = useState(5)
   const [employees, setEmployees] = useState<Employee[]>([])
   const [timeResponseLimit, setTimeResponseLimit] = useState(0)

   useEffect(() => {
      const fetchData = async () => {
         const data = await getEmployeeByRole('cs')
         if (data) {
            setEmployees(data)
         }
      }
      fetchData()

      const fetchTimeLimitSetting = async () => {
        const data = await getResponseTimeSetting()
        if (data) {
          setTimeResponseLimit(data)
        }
      }
      fetchTimeLimitSetting()
   }, [])

   // Calculate pagination
   const totalPages = Math.ceil(employees.length / pageSize)
   const startIndex = (currentPage - 1) * pageSize
   const endIndex = startIndex + pageSize
   const paginatedAgents = employees.slice(startIndex, endIndex)

   // Handle page size change
   const handlePageSizeChange = (value: string) => {
      const newPageSize = Number(value)
      const newTotalPages = Math.ceil(employees.length / newPageSize)
      setPageSize(newPageSize)
      // Adjust current page if it would exceed the new total pages
      if (currentPage > newTotalPages) {
         setCurrentPage(newTotalPages)
      }
   }

  return (
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
            Menunjukkan {startIndex + 1}-{Math.min(endIndex, employees.length)} dari {employees.length}
          </span>
          <span>|</span>
          <span>Halaman {currentPage} of {totalPages}</span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Rata - Rata Waktu Respon</TableHead>
            <TableHead>Ongoing</TableHead>
            <TableHead>Resolved Chat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedAgents.map((employee) => {
            // define employe role
            let role = ''
            if (employee.role === 'sales') {
              role = 'Sales'
            }
            if (employee.role === 'cs') {
              role = 'Customer Service'
            }
            if (employee.role === 'ts') {
              role = 'Technical Support'
            }

            // average response time, count ongoing, count hot, count cold, count deal
            let avg_response_time = 0
            let string_avg_response_time = ''
            let count_ongoing = 0
            let count_resolved = 0

            conversations.map((conversation) => {
               // counting average response time
               let count = 0
               let value = 0
               conversation.message_content.map((message) => {
                  if (message.agent === employee.id) {
                     value += parseInt(message.waktu_respon)
                     count++
                  }
               })

               avg_response_time = value / count
               const h = Math.floor(avg_response_time / 3600)
               const m = Math.floor((avg_response_time % 3600) / 60)
               const s = avg_response_time % 60

               if (h > 0) {
               string_avg_response_time += `${h}j `
               }
               if (m > 0) {
               string_avg_response_time += `${m}m `
               }
               if (s > 0) {
               string_avg_response_time += `${s}d`
               }
               // if there is no chat with agent access
               if (string_avg_response_time === '') {
                  string_avg_response_time = `-`
               }

               // processing label conversation
               if (conversation.akses === employee.id) {
                  if (conversation.label === 'ongoing') {
                     count_ongoing++
                  }
                  if (conversation.label === 'resolved') {
                     count_resolved++
                  }
               }
            })
            
            return (
              <TableRow key={employee.id} className="hover:bg-slate-100">
                <TableCell>
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">{role}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={avg_response_time <= timeResponseLimit/1000 && avg_response_time !== 0 ? "default" : "secondary"}>
                    <p className="font-bold">{string_avg_response_time}</p>
                  </Badge>
                </TableCell>
                <TableCell>{count_ongoing}</TableCell>
                <TableCell>{count_resolved}</TableCell>
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
  )
}