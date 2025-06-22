"use client"

import { Conversation, DelegationHistory, Employee } from "@/lib/definitions"
import { fetchAllMessage } from "@/lib/message"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { useEffect, useState } from "react"
import { SalesPerformanceTable } from "./components/salesPerformanceTable"
import { CSPerformanceTable } from "./components/csPerformanceTable"
import { fetchAllDelegationHistory } from "@/lib/delegation"
import { fetchAllEmployee } from "@/lib/employee"

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  // source data
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [delegationHistory, setDelegationHistory] = useState<DelegationHistory[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  // total Conversation
  const [totalConversation, setTotalConversation] = useState('')
  const [openTotalConversation, setOpenTotalConversation] = useState(false)
  // total Deal
  const [totalDeal, setTotalDeal] = useState('')
  const [openTotalDeal, setOpenTotalDeal] = useState(false)
  // total Resolved Conversation
  const [totalResolvedConversation, setTotalResolvedConversation] = useState('')
  const [openTotalResolvedConversation, setOpenTotalResolvedConversation] = useState(false)
  // total Assigned Conversation
  const [totalAssignedConversation, setTotalAssignedConversation] = useState('')
  const [openTotalAssignedConversation, setOpenTotalAssignedConversation] = useState(false)
  // total Unassigned Conversation
  const [totalUnassignedConversation, setTotalUnassignedConversation] = useState('')
  const [openTotalUnassignedConversation, setOpenTotalUnassignedConversation] = useState(false)
  // total Conversation Per Day
  const [totalConversationPerDay, setTotalConversationPerDay] = useState('')
  const [openTotalConversationPerDay, setOpenTotalConversationPerDay] = useState(false)
  // average First Time Response
  const [averageFirstTimeResponse, setAverageFirstTimeResponse] = useState('')
  const [openAverageFirstTimeResponse, setOpenAverageFirstTimeResponse] = useState(false)
  // average Resolution Time
  const [averageResolutionTime, setAverageResolutionTime] = useState('')
  const [openAverageResolutionTime, setOpenAverageResolutionTime] = useState(false)
  // average Wait Time
  const [averageWaitTime, setAverageWaitTime] = useState('')
  const [openAverageWaitTime, setOpenAverageWaitTime] = useState(false)

  useEffect(() => {
    (async () => {
      const dataConversation = await fetchAllMessage()
      setConversations(dataConversation)
      const dataDelegationHistory = await fetchAllDelegationHistory()
      setDelegationHistory(dataDelegationHistory)
      const dataEmployee = await fetchAllEmployee()
      setEmployees(dataEmployee)
    })()
  }, [])

  useEffect(() => {
    setTotalConversation(conversations.length.toString())
    setTotalDeal(conversations.filter(conversation => conversation.label === 'deal').length.toString())
    setTotalResolvedConversation(conversations.filter(conversation => conversation.label === 'resolved').length.toString())
    setTotalAssignedConversation(conversations.filter(conversation => conversation.akses !== 'resepsionis').length.toString())
    setTotalUnassignedConversation(conversations.filter(conversation => conversation.akses === 'resepsionis').length.toString())
    setTotalConversationPerDay(conversations.filter(conversation => isToday(conversation.waktu_terbaru || '')).length.toString())
    setAverageFirstTimeResponse(countFirstTimeResponse)
    setAverageResolutionTime(countResolutionTime)
    setAverageWaitTime(countWaitTime)
    
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations])

  const isToday = (timestamp: string) => {
    const date = new Date(timestamp); // Convert timestamp to Date
    const today = new Date();
  
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const countFirstTimeResponse = () => {
    let result = ""
    let count = 0
    let value = 0
    conversations.forEach(conversation => {
      if (conversation.waktu_admin_delegasi !== null) {
        value += parseInt(conversation.waktu_admin_delegasi) - parseInt(conversation.message_content[0].waktu)
        count++
      }
    })
    
    const avg = value / count
    const h = Math.floor(avg / 3600)
    const m = Math.floor((avg % 3600) / 60)
    const s = Math.floor(avg % 60)

    if (h > 0) {
      result += `${h}j `
    }
    if (m > 0) {
      result += `${m}m `
    }
    if (s > 0) {
      result += `${s}d`
    }
    return result
  }

  const countResolutionTime = () => {
    let result = ""
    let count = 0
    let value = 0
    conversations.forEach(conversation => {
      if (conversation.waktu_resolusi !== null) {
        value += parseInt(conversation.waktu_resolusi) - parseInt(conversation.message_content[0].waktu)
        count++
      }
    })

    const avg = value / count
    const h = Math.floor(avg / 3600)
    const m = Math.floor((avg % 3600) / 60)
    const s = Math.floor(avg % 60)

    if (h > 0) {
      result += `${h}j `
    }
    if (m > 0) {
      result += `${m}m `
    }
    if (s > 0) {
      result += `${s}d`
    }
    return result
  }

  const countWaitTime = () => {
    let result = ""
    let count = 0
    let value = 0
    conversations.forEach(conversation => {
      conversation.message_content.forEach(message => {
        if (message.waktu_respon !== '') {
          value += parseInt(message.waktu_respon)
          count++
        }
      })
    })

    const avg = value / count
    const h = Math.floor(avg / 3600)
    const m = Math.floor((avg % 3600) / 60)
    const s = Math.floor(avg % 60)

    if (h > 0) {
      result += `${h}j `
    }
    if (m > 0) {
      result += `${m}m `
    }
    if (s > 0) {
      result += `${s}d`
    }
    return result
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
            <h2 className="text-3xl font-bold tracking-tight">Laporan Perfoma</h2>
          </div>

          {/* Row 1 */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
                <CardTitle className="text-sm font-medium">Rata-Rata Durasi Respon Pertama</CardTitle>
              </CardHeader>
              <CardContent className="pl-6 pb-6">
                <div className="text-2xl font-bold">{averageFirstTimeResponse}</div>
                <button
                  onClick={() => setOpenAverageFirstTimeResponse(!openAverageFirstTimeResponse)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {openAverageFirstTimeResponse ? 'Tutup' : 'Lihat Detail'}
                </button>
              </CardContent>
              {openAverageFirstTimeResponse && (
                <div className="mt-4">
                  <table className="w-full table-auto text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Agen</th>
                        <th className="border px-2 py-1">Waktu Rata-rata yang Dibutuhkan untuk Delegasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        employees.map((employee, idx) => {
                          if (employee.role === 'resepsionis') {
                            let result = ""
                            let count = 0
                            let value = 0
                            delegationHistory.map((delegation) => {
                              if (delegation.agent === employee.name) {
                                conversations.map((conversation) => {
                                  if (conversation.waktu_admin_delegasi !== null && conversation.telepon === delegation.telepon) {
                                    count++
                                    value += parseInt(conversation.waktu_admin_delegasi) - parseInt(conversation.message_content[0].waktu)
                                  }
                                })
                              }
                            })
                            const avg = value / count
                            const h = Math.floor(avg / 3600)
                            const m = Math.floor((avg % 3600) / 60)
                            const s = Math.floor(avg % 60)
                        
                            if (h > 0) {
                              result += `${h}j `
                            }
                            if (m > 0) {
                              result += `${m}m `
                            }
                            if (s > 0) {
                              result += `${s}d`
                            }

                            return (
                              <tr key={idx}>
                                <td className="border px-2 py-1">{employee.name}</td>
                                <td className="border px-2 py-1">{result}</td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
            <Card className="rounded-ld">
              <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
                <CardTitle className="text-sm font-medium">Rata-Rata Durasi Tunggu</CardTitle>
              </CardHeader>
              <CardContent className="pl-6 pb-6">
                <div className="text-2xl font-bold">{averageWaitTime}</div>
                <button
                  onClick={() => setOpenAverageWaitTime(!openAverageWaitTime)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {openAverageWaitTime ? 'Tutup' : 'Lihat Detail'}
                </button>
              </CardContent>
              {openAverageWaitTime && (
                <div className="mt-4">
                  <table className="w-full table-auto text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Agen</th>
                        <th className="border px-2 py-1">Waktu Rata-rata Tunggu Respon</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        employees.map((employee, idx) => {
                          if (employee.role !== 'resepsionis' && employee.role !== 'admin') {
                            let result = ""
                            let count = 0
                            let value = 0
                            conversations.forEach(conversation => {
                              conversation.message_content.forEach(message => {
                                if (message.waktu_respon !== '' && employee.id === message.agent) {
                                  value += parseInt(message.waktu_respon)
                                  count++
                                }
                              })
                            })
                            const avg = value / count
                            const h = Math.floor(avg / 3600)
                            const m = Math.floor((avg % 3600) / 60)
                            const s = Math.floor(avg % 60)
                        
                            if (h > 0) {
                              result += `${h}j `
                            }
                            if (m > 0) {
                              result += `${m}m `
                            }
                            if (s > 0) {
                              result += `${s}d`
                            }

                            return (
                              <tr key={idx}>
                                <td className="border px-2 py-1">{employee.name}</td>
                                <td className="border px-2 py-1">{result === '' ? '-' : result}</td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
            <Card className="rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
                <CardTitle className="text-sm font-medium">Rata-Rata Durasi Resolusi</CardTitle>
              </CardHeader>
              <CardContent className="pl-6 pb-6">
                <div className="text-2xl font-bold">{averageResolutionTime}</div>
                <button
                  onClick={() => setOpenAverageResolutionTime(!openAverageResolutionTime)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {openAverageResolutionTime ? 'Tutup' : 'Lihat Detail'}
                </button>
              </CardContent>
              {openAverageResolutionTime && (
                <div className="mt-4">
                  <table className="w-full table-auto text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Agen</th>
                        <th className="border px-2 py-1">Waktu Rata-rata Resolusi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        employees.map((employee, idx) => {
                          if (employee.role !== 'resepsionis' && employee.role !== 'admin') {
                            let result = ""
                            let count = 0
                            let value = 0
                            conversations.forEach(conversation => {
                              if (conversation.waktu_resolusi !== null && employee.id === conversation.akses) {
                                value += parseInt(conversation.waktu_resolusi) - parseInt(conversation.message_content[0].waktu)
                                count++
                              }
                            })
                            const avg = value / count
                            const h = Math.floor(avg / 3600)
                            const m = Math.floor((avg % 3600) / 60)
                            const s = Math.floor(avg % 60)
                        
                            if (h > 0) {
                              result += `${h}j `
                            }
                            if (m > 0) {
                              result += `${m}m `
                            }
                            if (s > 0) {
                              result += `${s}d`
                            }

                            return (
                              <tr key={idx}>
                                <td className="border px-2 py-1">{employee.name}</td>
                                <td className="border px-2 py-1">{result === '' ? '-' : result}</td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Row 2 */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
                <CardTitle className="text-sm font-medium">Total Percakapan</CardTitle>
              </CardHeader>
              <CardContent className="pl-6 pb-6">
                <div className="text-2xl font-bold">{totalConversation}</div>
                <button
                  onClick={() => setOpenTotalConversation(!openTotalConversation)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {openTotalConversation ? 'Tutup' : 'Lihat Detail'}
                </button>
              </CardContent>
              {openTotalConversation && (
                <div className="mt-4">
                  <table className="w-full table-auto text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Nomor Telepon</th>
                        <th className="border px-2 py-1">Nama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        conversations.map((conversation, idx) => {
                          return (
                            <tr key={idx}>
                              <td className="border px-2 py-1">{`+${conversation.telepon}`}</td>
                              <td className="border px-2 py-1">{conversation.nama ?? '-'}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
            <Card className="rounded-ld">
              <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
                <CardTitle className="text-sm font-medium">Total Deal</CardTitle>
              </CardHeader>
              <CardContent className="pl-6 pb-6">
                <div className="text-2xl font-bold">{totalDeal}</div>
                <button
                  onClick={() => setOpenTotalDeal(!openTotalDeal)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {openTotalDeal ? 'Tutup' : 'Lihat Detail'}
                </button>
              </CardContent>
              {openTotalDeal && (
                <div className="mt-4">
                  <table className="w-full table-auto text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Nomor Telepon</th>
                        <th className="border px-2 py-1">Nama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        conversations.map((conversation, idx) => {
                          if (conversation.label === 'deal') {
                            return (
                              <tr key={idx}>
                                <td className="border px-2 py-1">{`+${conversation.telepon}`}</td>
                                <td className="border px-2 py-1">{conversation.nama ?? '-'}</td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
            <Card className="rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
                <CardTitle className="text-sm font-medium">Total Resolved</CardTitle>
              </CardHeader>
              <CardContent className="pl-6 pb-6">
                <div className="text-2xl font-bold">{totalResolvedConversation}</div>
                <button
                  onClick={() => setOpenTotalResolvedConversation(!openTotalResolvedConversation)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {openTotalResolvedConversation ? 'Tutup' : 'Lihat Detail'}
                </button>
              </CardContent>
              {openTotalResolvedConversation && (
                <div className="mt-4">
                  <table className="w-full table-auto text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Nomor Telepon</th>
                        <th className="border px-2 py-1">Nama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        conversations.map((conversation, idx) => {
                          if (conversation.label === 'resolved') {
                            return (
                              <tr key={idx}>
                                <td className="border px-2 py-1">{`+${conversation.telepon}`}</td>
                                <td className="border px-2 py-1">{conversation.nama ?? '-'}</td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Row 3 */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
                <CardTitle className="text-sm font-medium">Total Percakapan yang Didelegasi</CardTitle>
              </CardHeader>
              <CardContent className="pl-6 pb-6">
                <div className="text-2xl font-bold">{totalAssignedConversation}</div>
                <button
                  onClick={() => setOpenTotalAssignedConversation(!openTotalAssignedConversation)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {openTotalAssignedConversation ? 'Tutup' : 'Lihat Detail'}
                </button>
              </CardContent>
              {openTotalAssignedConversation && (
                <div className="mt-4">
                  <table className="w-full table-auto text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Nomor Telepon</th>
                        <th className="border px-2 py-1">Nama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        conversations.map((conversation, idx) => {
                          if (conversation.akses !== 'resepsionis') {
                            return (
                              <tr key={idx}>
                                <td className="border px-2 py-1">{`+${conversation.telepon}`}</td>
                                <td className="border px-2 py-1">{conversation.nama ?? '-'}</td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
            <Card className="rounded-ld">
              <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
                <CardTitle className="text-sm font-medium">Total Percakapan yang Belum Didelegasi</CardTitle>
              </CardHeader>
              <CardContent className="pl-6 pb-6">
                <div className="text-2xl font-bold">{totalUnassignedConversation}</div>
                <button
                  onClick={() => setOpenTotalUnassignedConversation(!openTotalUnassignedConversation)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {openTotalUnassignedConversation ? 'Tutup' : 'Lihat Detail'}
                </button>
              </CardContent>
              {openTotalUnassignedConversation && (
                <div className="mt-4">
                  <table className="w-full table-auto text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Nomor Telepon</th>
                        <th className="border px-2 py-1">Nama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        conversations.map((conversation, idx) => {
                          if (conversation.akses === 'resepsionis') {
                            return (
                              <tr key={idx}>
                                <td className="border px-2 py-1">{`+${conversation.telepon}`}</td>
                                <td className="border px-2 py-1">{conversation.nama ?? '-'}</td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
            <Card className="rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
                <CardTitle className="text-sm font-medium">Total Percakapan per Hari</CardTitle>
              </CardHeader>
              <CardContent className="pl-6 pb-6">
                <div className="text-2xl font-bold">{totalConversationPerDay}</div>
                <button
                  onClick={() => setOpenTotalConversationPerDay(!openTotalConversationPerDay)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {openTotalConversationPerDay ? 'Tutup' : 'Lihat Detail'}
                </button>
              </CardContent>
              {openTotalConversationPerDay && (
                <div className="mt-4">
                  <table className="w-full table-auto text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Nomor Telepon</th>
                        <th className="border px-2 py-1">Nama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        conversations.map((conversation, idx) => {
                          if (isToday(conversation.waktu_terbaru || '')) {
                            return (
                              <tr key={idx}>
                                <td className="border px-2 py-1">{`+${conversation.telepon}`}</td>
                                <td className="border px-2 py-1">{conversation.nama ?? '-'}</td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Row 4 */}
          <Card className="rounded-lg col-span-4">
            <CardHeader>
              <CardTitle className="font-semibold text-2xl pt-5 pl-5 pb-4">Tabel Perfoma Sales</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <SalesPerformanceTable conversations={conversations} />
            </CardContent>
          </Card>

          {/* Row 5 */}
          <Card className="rounded-lg col-span-4">
            <CardHeader>
              <CardTitle className="font-semibold text-2xl pt-5 pl-5 pb-4">Tabel Perfoma Customer Service</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <CSPerformanceTable conversations={conversations} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}