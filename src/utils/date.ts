export function formatMessageDate(time: string) {
  const timestamp = new Date(parseInt(time, 10) * 1000).toISOString()
  return new Date(timestamp).toLocaleDateString("en-GB", { 
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function formatMessageTime(time: string) {
  const timestamp = new Date(parseInt(time, 10) * 1000).toISOString()
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })
}

export function formatDateDistance(date: string | null) {
  if (date === null) {
    return 
  }
  
  const now = new Date()
  const timestamp = new Date(parseInt(date, 10) * 1000).toISOString() ?? ''
  const messageDate = new Date(timestamp)
  const diffInHours = Math.abs(now.getTime() - messageDate.getTime()) / 36e5
  
  // checking if the message is from yesterday
  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const msgDateOnly = new Date(messageDate);
  msgDateOnly.setHours(0, 0, 0, 0);
  const isYesterday = msgDateOnly.getTime() === yesterday.getTime()
  if (isYesterday) {
    return 'Yesterday'
  }

  if (diffInHours < 24) {
    return messageDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    })
  } else {
    return messageDate.toLocaleDateString()
  }
}