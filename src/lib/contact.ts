export async function createContact(id: string, name: string, phone: string) {
   const response = await fetch('/api/contact/create', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name, phone }), // Send data as JSON
   });

   if (!response.ok) {
      console.error('Failed to create contact');
      return;
   }
}

export async function getContacts() {
   const response = await fetch('/api/contact/fetch', {
      method: 'GET',
   });

   if (response.status === 500) {
      return false;
   }

   const data = await response.json()
   return data;
}

export async function getContactInfo(phone: string) {
   const response = await fetch('/api/contact/info', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }), // Send data as JSON
   });

   if (!response.ok) {
      console.error('Failed to fetch contact info');
      return;
   }
   
   const data = await response.json();
   return data;
}

export async function updateContact(id: string, name: string, phone: string) {
   const response = await fetch('/api/contact/update', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name, phone }), // Send data as JSON
   });
   
   if (!response.ok) {
      console.error('Failed to update contact');
      return;
   }
}

export async function deleteContact(id: string) {
   const response = await fetch('/api/contact/delete', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }), // Send data as JSON
   });
   
   if (!response.ok) {
      console.error('Failed to delete contact');
      return;
   }
}