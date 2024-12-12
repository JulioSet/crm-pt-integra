// create new employee
export async function createEmployee(name: string, password: string, role: string) {
   const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password, role }), // Send data as JSON
   });

   if (!response.ok) {
      console.error('Failed to create employee');
      return;
   }
}

// get employee's data
export async function getEmployee(name: string, password: string) {
   const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }), // Send data as JSON
   });

   if (!response.ok) {
      console.error('Failed to fetch employee');
      return;
   }
   
   const data = await response.json();
   if (data.status === 403) {
      return { success: false , message: "Nama pengguna atau kata sandi salah." };
   }
   
   return { success: true, data: data };
}
