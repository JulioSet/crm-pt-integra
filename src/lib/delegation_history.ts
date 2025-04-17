export async function fetchAllDelegationHistory() {
   const response = await fetch('/api/delegation_history/fetch', {
      method: 'GET',
   });

   if (response.status === 500) {
      return false;
   }

   const data = await response.json()
   return data;
}

export async function createDelegationHistory(phone: string, name: string, agent: string, role: string, status: number) {
   await fetch('/api/delegation_history/create', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, name, agent, role, status }), // Send data as JSON
   });
}