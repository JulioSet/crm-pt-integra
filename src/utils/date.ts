export function formatMessageTime(time: string) {
  const timestamp = new Date(parseInt(time, 10) * 1000).toISOString()
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export function formatDateDistance(date: string | null) {
  const now = new Date()
  const timestamp = new Date(parseInt(date, 10) * 1000).toISOString() ?? ''
  const messageDate = new Date(timestamp)
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