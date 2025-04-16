export async function createEmployee(id: string, name: string, password: string, role: string, email: string) {
   const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name, password, role, email }), // Send data as JSON
   });

   if (!response.ok) {
      console.error('Failed to create employee');
      return;
   }
}

export async function getEmployee(email: string, password: string) {
   const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Send data as JSON
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

export async function getEmail(id: string) {
   const response = await fetch('/api/auth/email', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }), // Send data as JSON
   });
   const data = await response.json()
   return data
}

export async function getEmployeeByRole(role: string) {
   const response = await fetch('/api/auth/fetch', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }), // Send data as JSON
   });
   
   if (!response.ok) {
      console.error('Failed to fetch employee');
      return;
   }
   
   const { data } = await response.json();
   return data;
}

export async function updateEmployee(id: string, name: string, target: number, email: string) {
   const response = await fetch('/api/auth/update', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name, target, email }), // Send data as JSON
   });
   
   if (!response.ok) {
      console.error('Failed to update employee');
      return;
   }
}

export async function deleteEmployee(id: string) {
   const response = await fetch('/api/auth/delete', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }), // Send data as JSON
   });
   
   if (!response.ok) {
      console.error('Failed to delete employee');
      return;
   }
}

export async function getSession() {
   const response = await fetch('/api/auth/session', {
      method: 'GET',
   });

   if (response.status === 500) {
      return false;
   }

   const data = await response.json()
   return data;
}

export async function assignLeader(role: string, value: string) {
   const response = await fetch('/api/auth/leader/assign', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role, value }), // Send data as JSON
   });
   
   if (!response.ok) {
      console.error('Failed to assign leader');
      return;
   }
}

export async function fetchLeader(role: string) {
   const response = await fetch('/api/auth/leader/fetch', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }), // Send data as JSON
   });
   
   if (!response.ok) {
      console.error('Failed to fetch leader');
      return;
   }

   const { value } = await response.json();
   return value;
}

export async function fetchAllEmployee() {
   const response = await fetch('/api/auth/all', {
      method: 'GET',
   });

   if (response.status === 500) {
      return false;
   }

   const data = await response.json()
   return data;
}