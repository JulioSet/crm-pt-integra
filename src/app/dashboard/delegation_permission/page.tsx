'use client'

import { fetchAllEmployee, getEmployeeByRole } from "@/lib/employee";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Box } from "@mui/material";
import {
   GridRowsProp,
   DataGrid,
   GridColDef,
   GridActionsCellItem,
} from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Employee } from "@/lib/definitions";
import useChatStore from "@/store/chatStore";
import { GridRowId } from "@mui/x-data-grid";
import { Check, X } from "lucide-react";
import { updateDelegatePermission } from "@/lib/message";

// Page UI
export default function DelagationPermission() {
   const { data } = useChatStore()
   const [loading, setLoading] = useState(true)
   const [employees, setEmployees] = useState<Employee[]>([])
   // table
   const [rows, setRows] = useState<GridRowsProp>([]); // set data here!
   const [role, setRole] = useState("all")

   useEffect(() => {
      setLoading(true)
      const setUpData = async () => {
         let fetch_conversations
         let fetch_employees

         if (role !== 'all') {
            fetch_conversations = data.filter(conversation => conversation.role_penanggung_jawab === role && conversation.akses !== 'admin' && conversation.persetujuan_delegasi_dari_admin === 2)
            fetch_employees = await getEmployeeByRole(role)
         } else {
            fetch_conversations = data.filter(conversation => conversation.akses !== 'admin' && conversation.persetujuan_delegasi_dari_admin === 2)
            fetch_employees = await fetchAllEmployee()
         }

         if (fetch_employees) {
            setEmployees(fetch_employees)
         }
         if (fetch_conversations) {
            setRows(fetch_conversations)
         }
      }
      setUpData()
      setLoading(false)
   }, [data, role])

   const handleAdminAccept = (id: GridRowId) => async () => {
      await updateDelegatePermission(id as string, 1)
      const name = data.find(conversation => conversation.telepon === id)?.nama || `+${id}`
      toast(`Izin delegasi percakapan dengan ${name} telah disetujui`)
   }

   const handleAdminReject = (id: GridRowId) => async () => {
      await updateDelegatePermission(id as string, 0)
      const name = data.find(conversation => conversation.telepon === id)?.nama || `+${id}`
      toast(`Izin delegasi percakapan dengan ${name} telah ditolak`)
}

   // set table header here!
   const column: GridColDef[] = [
      { 
         field: 'telepon', 
         headerName: 'Telepon', 
         width: 220, 
         valueGetter: (data) => `+${data}`
      },
      { 
         field: 'nama', 
         headerName: 'Nama', 
         width: 220, 
         valueGetter: (data) => data ?? ""
      },
      { 
         field: 'akses', 
         headerName: 'Agent yang Ditugaskan', 
         width: 220,
         valueGetter: (data) => employees.find(employee => employee.id == data)?.name
      },
      { 
         field: 'role_penanggung_jawab', 
         headerName: 'Role', 
         width: 220,
         valueGetter: (data) => {
            if (data === 'cs') {
               return 'Customer Service'
            }
            if (data === 'sales') {
               return 'Sales'
            }
         }
      },
      {
         field: 'actions',
         type: 'actions',
         headerName: 'Tindakan',
         width: 110,
         cellClassName: 'actions',
         getActions: ({ id }) => {
            return [
               <GridActionsCellItem
                  key="Terima"
                  icon={
                     <div className="flex p-1 pl-2 pr-2 rounded bg-green-700 hover:bg-green-800 text-white text-sm">
                        <Check size={"20px"} />
                     </div>
                  }
                  label="Terima"
                  onClick={handleAdminAccept(id)}
               />,
               <GridActionsCellItem
               key="Tolak"
               icon={
                     <div className="flex p-1 pl-2 pr-2 rounded bg-red-700 hover:bg-red-800 text-white text-sm">
                        <X size={"20px"} />
                     </div>
                  }
                  label="Tolak"
                  onClick={handleAdminReject(id)}
               />,
            ];
         },
      },
   ];

   return (
      <div>
         {loading ? (
            <div className="flex items-center justify-center h-screen">
               <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            </div>
         ) : (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold tracking-tight">Izin Delegasi</h2>
               </div>
               <div className="w-44">
                  <Select value={role} onValueChange={setRole}>
                     <SelectTrigger className="w-full rounded">
                        <SelectValue placeholder="Set priority" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all" className="pt-2 pb-2 mr-1 pr-7">
                           <span className="flex items-center">
                              All
                           </span>
                        </SelectItem>
                        <SelectItem value="sales" className="pt-2 pb-2 mr-1 pr-7">
                           <span className="flex items-center">
                              Sales
                           </span>
                        </SelectItem>
                        <SelectItem value="cs" className="pt-2 pb-2 mr-1 pr-7">
                           <span className="flex items-center">
                              Customer Service
                           </span>
                        </SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <Box
                  sx={{
                     maxHeight: 500,
                     '& .actions': {
                        color: 'text.secondary',
                     },
                     '& .textPrimary': {
                        color: 'text.primary',
                     },
                  }}
               >
                  <DataGrid
                     rows={rows}
                     columns={column}
                     getRowId={(row) => row.telepon}
                     pageSizeOptions={[10, 25, 50]}
                     initialState={{
                        sorting: {
                           sortModel: [{ field: 'name', sort: 'asc' }],
                        },
                        pagination: { 
                           paginationModel: { pageSize: 10, page: 0 } 
                        }, // Default 10 rows per page
                     }}
                     pagination
                  />
               </Box>
            </div>
         )}
      </div>
   );
}