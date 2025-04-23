'use client'

import { createContact, deleteContact, getContacts, updateContact } from "@/lib/contact";
import { createMessage } from "@/lib/message";
import { getSession } from "@/lib/employee";
import { Box, Button } from "@mui/material";
import {
   GridRowsProp,
   GridRowModesModel,
   GridRowModes,
   DataGrid,
   GridColDef,
   GridToolbarContainer,
   GridActionsCellItem,
   GridEventListener,
   GridRowId,
   GridRowModel,
   GridRowEditStopReasons,
   GridSlotProps,
   GridAddIcon,
} from '@mui/x-data-grid';
import { MessageSquarePlus, Pencil, Save, Trash, X } from "lucide-react";
import { customAlphabet } from "nanoid";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const nanoid = customAlphabet('1234567890', 10) // id

declare module '@mui/x-data-grid' {
   interface ToolbarPropsOverrides {
      setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
      setRowModesModel: (
         newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
      ) => void;
      setMode: (mode: string) => void
   }
}

// setup add record button here!
function EditToolbar(props: GridSlotProps['toolbar']) {
   const { setRows, setRowModesModel, setMode } = props;
 
   const handleClick = () => {
      const id = nanoid();
      setRows((oldRows) => [
         ...oldRows,
         { id, nama: 'Isi nama', telepon: 'Awali 62', isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
         ...oldModel,
         [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
      setMode('create')
   };

   return (
      <GridToolbarContainer>
         <Button color="primary" startIcon={<GridAddIcon />} onClick={handleClick}>
            Tambah Kontak
         </Button>
      </GridToolbarContainer>
   );
}

// Page UI
export default function Contacts() {
   const [loading, setLoading] = useState(true)
   // agent data
   const [agent, setAgent] = useState("")
   const [role, setRole] = useState("")
   // Table data
   const [rows, setRows] = useState<GridRowsProp>([]); // set data here!
   const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({}); // for inserting new row
   const [mode, setMode] = useState("") // mode create or update

   useEffect(() => {
      (async () => {
         const session = await getSession()
         setAgent(session?.name)
         setRole(session?.role)
      })()
   }, [])

   useEffect(() => {
      // fetch contacts
      const fetchData = async () => {
         const data = await getContacts()
         if (data) {
            setRows(data)
         }
      }
      fetchData()
      setLoading(false)
   }, [])

   const handleAddConversation = (id: GridRowId) => async () => {
      const contact = rows.find(contact => contact.id === id)
      localStorage.setItem("telepon", contact?.telepon)
      await createMessage(contact?.nama, contact?.telepon, agent)
      redirect('/dashboard/messages')
   }

   const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
         event.defaultMuiPrevented = true;
      }
   };

   const handleEditClick = (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
      setMode('update')
   };
   
   const handleSaveClick = (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
   };

   const handleDeleteClick = (id: GridRowId) => () => {
      setRows(rows.filter((row) => row.id !== id));
      void (async () => {
         await deleteContact(id.toString())
         console.log(id.toString())
      })()
   };

   const handleCancelClick = (id: GridRowId) => () => {
      setRowModesModel({
         ...rowModesModel,
         [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
      setMode('')

      const editedRow = rows.find((row) => row.id === id);
      if (editedRow!.isNew) {
         setRows(rows.filter((row) => row.id !== id));
      }
   };

   const processRowUpdate = (newRow: GridRowModel) => {
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      // create and update contact
      if (mode === 'create') {
         void (async () => {
            await createContact(newRow.id, newRow.nama, newRow.telepon)
         })()
      }
      if (mode === 'update') {
         void (async () => {
            await updateContact(newRow.id, newRow.nama, newRow.telepon)
         })()
      }
      return updatedRow;
   };

   const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
      setRowModesModel(newRowModesModel);
   };

   // set table header here!
   const column: GridColDef[] = [
      { 
         field: 'nama', 
         headerName: 'Nama', 
         width: 220, 
         editable: true 
      },
      { 
         field: 'telepon', 
         headerName: 'Nomor Telepon', 
         width: 150, 
         editable: true,
         valueGetter: (data) => `+${data}`,
      },
      {
         field: 'actions',
         type: 'actions',
         headerName: 'Tindakan',
         width: 120,
         cellClassName: 'actions',
         getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
               return [
                  <GridActionsCellItem
                     key={nanoid()}
                     icon={<Save />}
                     label="Save"
                     sx={{
                        color: 'primary.main',
                     }}
                     onClick={handleSaveClick(id)}
                  />,
                  <GridActionsCellItem
                     key={nanoid()}
                     icon={<X />}
                     label="Cancel"
                     className="textPrimary"
                     onClick={handleCancelClick(id)}
                     color="inherit"
                  />,
               ];
            }

            if (role === 'admin') {
               return [
                  <GridActionsCellItem
                     key={nanoid()}
                     icon={<Pencil />}
                     label="Edit"
                     className="textPrimary"
                     onClick={handleEditClick(id)}
                     color="inherit"
                  />,
                  <GridActionsCellItem
                     key={nanoid()}
                     icon={<Trash />}
                     label="Delete"
                     onClick={handleDeleteClick(id)}
                     color="inherit"
                  />,
                  <GridActionsCellItem
                     key={nanoid()}
                     icon={<MessageSquarePlus />}
                     label="Message"
                     onClick={handleAddConversation(id)}
                     color="inherit"
                  />,
               ];
            }

            return [
               <GridActionsCellItem
                  key={nanoid()}
                  icon={<MessageSquarePlus />}
                  label="Message"
                  onClick={handleAddConversation(id)}
                  color="inherit"
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
                  <h2 className="text-3xl font-bold tracking-tight">Kontak</h2>
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
                     editMode="row"
                     rowModesModel={rowModesModel}
                     onRowModesModelChange={handleRowModesModelChange}
                     onRowEditStop={handleRowEditStop}
                     processRowUpdate={processRowUpdate}
                     slots={{ toolbar: EditToolbar }}
                     slotProps={{
                        toolbar: { setRows, setRowModesModel, setMode },
                     }}
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