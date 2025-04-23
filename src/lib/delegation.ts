// HISTORY
export async function fetchAllDelegationHistory() {
   const response = await fetch('/api/delegation/history/fetch', {
      method: 'GET',
   });

   if (response.status === 500) {
      return false;
   }

   const data = await response.json()
   return data;
}

export async function createDelegationHistory(phone: string, name: string, agent: string, role: string, status: number) {
   await fetch('/api/delegation/history/create', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, name, agent, role, status }), // Send data as JSON
   });
}

// NOTIFICATION
export async function fetchDelegationNotification() {
   const response = await fetch('/api/delegation/notification/fetch', {
      method: 'GET',
   });

   if (response.status === 500) {
      return false;
   }

   const data = await response.json()
   return data;
}

export async function createDelegationNotification(phone: string, name: string, agent_now: string, agent_before: string, reason: string) {
   await fetch('/api/delegation/notification/create', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, name, agent_now, agent_before, reason }), // Send data as JSON
   });
}

export async function deleteDelegationNotification(id: number) {
   await fetch('/api/delegation/notification/delete', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }), // Send data as JSON
   });
}