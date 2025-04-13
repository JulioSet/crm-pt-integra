"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { Input } from "@/ui/input"
import { Button } from "@/ui/button"
import { Label } from "@/ui/label"
import { Clock } from "lucide-react"
import { getResponseTimeSetting, updateResponseTimeSetting } from "@/lib/setting"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [initHours, setInitHours] = useState("0")
  const [initMinutes, setInitMinutes] = useState("5")
  const [initSeconds, setInitSeconds] = useState("0")
  const [hours, setHours] = useState("0")
  const [minutes, setMinutes] = useState("5")
  const [seconds, setSeconds] = useState("0")
  const [saveDisabled, setSaveDisabled] = useState(true)
  const [saveClicked, setSaveClicked] = useState(false)

   // init time
   useEffect(() => {
      (async () => {
         const responseTime = await getResponseTimeSetting()
         const totalSeconds = Math.floor(responseTime / 1000)
         const h = Math.floor(totalSeconds / 3600)
         const m = Math.floor((totalSeconds % 3600) / 60)
         const s = totalSeconds % 60
         
         setInitHours(h.toString())
         setInitMinutes(m.toString())
         setInitSeconds(s.toString())
         setHours(h.toString())
         setMinutes(m.toString())
         setSeconds(s.toString())

         setLoading(false)
      })()
      setSaveClicked(false)
   }, [saveClicked])

   // check change time input
   useEffect(() => {
      if (initHours === hours && initMinutes === minutes && initSeconds === seconds) {
         setSaveDisabled(true)
      } else {
         setSaveDisabled(false)
      }
   }, [initHours, initMinutes, initSeconds, hours, minutes, seconds])

   const handleSave = async () => {
      const totalSeconds = 
      ((parseInt(hours) * 3600) + 
      (parseInt(minutes) * 60) + 
      parseInt(seconds)) * 1000
      
      console.log("Response time set to:", totalSeconds, "seconds")
      await updateResponseTimeSetting(totalSeconds.toString())
      setSaveClicked(true)
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
                  <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
               </div>

               <Card className="rounded-lg">
                  <CardHeader className="pl-6 pt-6">
                     <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <p className="text-2xl font-semibold mb-1">Konfigurasi Batas Waktu Respon</p>
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 pl-6 pb-6">
                     <div className="grid gap-6 max-w-sm">
                        <div className="grid grid-cols-3 gap-4">
                           <div className="space-y-2">
                              <Label htmlFor="hours">Jam</Label>
                              <Input
                                 id="hours"
                                 type="number"
                                 min="0"
                                 max="23"
                                 value={hours}
                                 onChange={(e) => setHours(e.target.value)}
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="minutes">Menit</Label>
                              <Input
                                 id="minutes"
                                 type="number"
                                 min="0"
                                 max="59"
                                 value={minutes}
                                 onChange={(e) => setMinutes(e.target.value)}
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="seconds">Detik</Label>
                              <Input
                                 id="seconds"
                                 type="number"
                                 min="0"
                                 max="59"
                                 value={seconds}
                                 onChange={(e) => setSeconds(e.target.value)}
                              />
                           </div>
                        </div>
                        <Button 
                           className={`${saveDisabled && "opacity-50 cursor-not-allowed hover:bg-blue-600"}`}
                           onClick={handleSave}
                           disabled={saveDisabled}
                        >
                           Save Changes
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}
      </div>
   )
}