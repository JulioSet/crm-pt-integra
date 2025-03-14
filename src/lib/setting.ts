export async function getResponseTimeSetting() {
   const response = await fetch('/api/setting/employee_response_time', {
      method: 'GET'
   });
   const { value } = await response.json()
   return value
}

export async function updateResponseTimeSetting(value: string) {
   await fetch('/api/setting/update/response', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }), // Send data as JSON
   });
}