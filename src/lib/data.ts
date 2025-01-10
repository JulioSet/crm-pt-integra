import { Conversation } from "./definitions";

export function getConversations(): Conversation[] {
  return [
    {
      id: "1",
      name: "Sarah Johnson",
      lastMessage: "Looking forward to our meeting tomorrow!",
      lastMessageAt: "2024-03-20T10:30:00Z",
      status: "hot",
      messages: [
        {
          id: "m1",
          content: "Hi, how are you?",
          sender: "other",
          timestamp: "2024-03-20T10:25:00Z",
        },
        {
          id: "m2",
          content: "I'm good, thanks! How about you?",
          sender: "user",
          timestamp: "2024-03-20T10:27:00Z",
        },
        {
          id: "m3",
          content: "Looking forward to our meeting tomorrow!",
          sender: "other",
          timestamp: "2024-03-20T10:30:00Z",
        },
        {
          id: "m4",
          content: "I'm good, thanks! How about you?",
          sender: "user",
          timestamp: "2024-03-20T10:27:00Z",
        },
        {
          id: "m5",
          content: "Looking forward to our meeting tomorrow!",
          sender: "other",
          timestamp: "2024-03-20T10:30:00Z",
        },
        {
          id: "m6",
          content: "I'm good, thanks! How about you?",
          sender: "user",
          timestamp: "2024-03-20T10:27:00Z",
        },
        {
          id: "m7",
          content: "Looking forward to our meeting tomorrow!",
          sender: "other",
          timestamp: "2024-03-20T10:30:00Z",
        },
        {
          id: "m8",
          content: "I'm good, thanks! How about you?",
          sender: "user",
          timestamp: "2024-03-20T10:27:00Z",
        },
        {
          id: "m9",
          content: "Looking forward to our meeting tomorrow!",
          sender: "other",
          timestamp: "2024-03-20T10:30:00Z",
        },
        {
          id: "m10",
          content: "I'm good, thanks! How about you?",
          sender: "user",
          timestamp: "2024-03-20T10:27:00Z",
        },
        {
          id: "m11",
          content: "Looking forward to our meeting tomorrow!",
          sender: "other",
          timestamp: "2024-03-20T10:30:00Z",
        },
      ],
    },
    {
      id: "2",
      name: "Michael Chen",
      lastMessage: "The project proposal looks great!",
      lastMessageAt: "2024-03-20T09:15:00Z",
      status: "deal",
      messages: [
        {
          id: "m4",
          content: "Have you reviewed the proposal?",
          sender: "other",
          timestamp: "2024-03-20T09:10:00Z",
        },
        {
          id: "m5",
          content: "Yes, it looks great!",
          sender: "user",
          timestamp: "2024-03-20T09:15:00Z",
        },
      ],
    },
    {
      id: "3",
      name: "Emily Davis",
      lastMessage: "Can we schedule a call next week?",
      lastMessageAt: "2024-03-19T16:45:00Z",
      status: "ongoing",
      messages: [
        {
          id: "m6",
          content: "I'd like to discuss the new features",
          sender: "other",
          timestamp: "2024-03-19T16:40:00Z",
        },
        {
          id: "m7",
          content: "Can we schedule a call next week?",
          sender: "other",
          timestamp: "2024-03-19T16:45:00Z",
        },
      ],
    },
  ]
}