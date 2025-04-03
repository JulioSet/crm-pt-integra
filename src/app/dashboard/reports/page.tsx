"use client"

import { Conversation } from "@/lib/definitions"
import { fetchAll } from "@/lib/message"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { useEffect, useState } from "react"
import { SalesPerformanceTable } from "./components/salesPerformanceTable"
import { CSPerformanceTable } from "./components/csPerformanceTable"

export default function ReportsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [totalConversation, setTotalConversation] = useState('')
  const [totalDeal, setTotalDeal] = useState('')
  const [totalResolvedConversation, setTotalResolvedConversation] = useState('')  
  const [totalAssignedConversation, setTotalAssignedConversation] = useState('')
  const [totalUnassignedConversation, setTotalUnassignedConversation] = useState('')
  const [totalConversationPerDay, setTotalConversationPerDay] = useState('')
  const [averageFirstTimeResponse, setAverageFirstTimeResponse] = useState('')
  const [averageResolutionTime, setAverageResolutionTime] = useState('')
  const [averageWaitTime, setAverageWaitTime] = useState('')

  useEffect(() => {
    (async () => {
      const result = await fetchAll()
      setConversations(result)
    })()
  }, [])

  useEffect(() => {
    setTotalConversation(conversations.length.toString())
    setTotalDeal(conversations.filter(conversation => conversation.label === 'deal').length.toString())
    setTotalResolvedConversation(conversations.filter(conversation => conversation.label === 'resolved').length.toString())
    setTotalAssignedConversation(conversations.filter(conversation => conversation.akses !== 'admin').length.toString())
    setTotalUnassignedConversation(conversations.filter(conversation => conversation.akses === 'admin').length.toString())
    setTotalConversationPerDay(conversations.filter(conversation => isToday(conversation.waktu_terbaru || '')).length.toString())
    setAverageFirstTimeResponse(countFirstTimeResponse)
    setAverageResolutionTime(countResolutionTime)
    setAverageWaitTime(countWaitTime)
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
    const s = avg % 60

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
    const s = avg % 60

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
    const s = avg % 60

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
          </CardContent>
        </Card>
        <Card className="rounded-ld">
          <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
            <CardTitle className="text-sm font-medium">Rata-Rata Durasi Tunggu</CardTitle>
          </CardHeader>
          <CardContent className="pl-6 pb-6">
            <div className="text-2xl font-bold">{averageWaitTime}</div>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
            <CardTitle className="text-sm font-medium">Rata-Rata Durasi Resolusi</CardTitle>
          </CardHeader>
          <CardContent className="pl-6 pb-6">
            <div className="text-2xl font-bold">{averageResolutionTime}</div>
          </CardContent>
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
          </CardContent>
        </Card>
        <Card className="rounded-ld">
          <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
            <CardTitle className="text-sm font-medium">Total Deal</CardTitle>
          </CardHeader>
          <CardContent className="pl-6 pb-6">
            <div className="text-2xl font-bold">{totalDeal}</div>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
            <CardTitle className="text-sm font-medium">Total Resolved</CardTitle>
          </CardHeader>
          <CardContent className="pl-6 pb-6">
            <div className="text-2xl font-bold">{totalResolvedConversation}</div>
          </CardContent>
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
          </CardContent>
        </Card>
        <Card className="rounded-ld">
          <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
            <CardTitle className="text-sm font-medium">Total Percakapan yang Belum Didelegasi</CardTitle>
          </CardHeader>
          <CardContent className="pl-6 pb-6">
            <div className="text-2xl font-bold">{totalUnassignedConversation}</div>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pl-6 pt-6">
            <CardTitle className="text-sm font-medium">Total Percakapan per Hari</CardTitle>
          </CardHeader>
          <CardContent className="pl-6 pb-6">
            <div className="text-2xl font-bold">{totalConversationPerDay}</div>
          </CardContent>
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
  )
}