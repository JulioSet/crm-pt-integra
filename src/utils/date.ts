export function formatMessageTime(timestamp: string) {
   return new Date(timestamp).toLocaleTimeString([], { 
     hour: '2-digit', 
     minute: '2-digit' 
   })
 }
 
 export function formatDateDistance(date: string | Date) {
   const now = new Date()
   const messageDate = new Date(date)
   const diffInHours = Math.abs(now.getTime() - messageDate.getTime()) / 36e5
 
   if (diffInHours < 24) {
     return messageDate.toLocaleTimeString([], { 
       hour: '2-digit', 
       minute: '2-digit' 
     })
   } else if (diffInHours < 48) {
     return 'Yesterday'
   } else {
     return messageDate.toLocaleDateString()
   }
 }