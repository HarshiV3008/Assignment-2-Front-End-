// Front End Explaination

Index.html

Main Features:
1) Add new items viz modal
2) Edit existing items dynamically
3) Search and Filter by Item
4) Mark items as purchased
5) Responsive design

Process:
- Displays shopping list UI with CRUD buttons
- Use Materialise CSS 
- Communticates with client.js for API requests

Client.js

1) fetchItems(): fetches and displays items
2) renderItems(): dynamically updates the UI with fetched items
3) addItem(): sends POST request
4) editItem(): opens modal with item details to change
5) updateItem(): sends PUT request
6) deleteItem(): sends DELETE request

Server.js
- serverless API built on Deno and Supabase

Method	 Endpoint  	     Description
GET	   /api/items	     Fetch all items (with optional search & filtering)
POST	   /api/items	     Add a new shopping item
PUT	   /api/items/:id	  Update an existing item
DELETE	/api/items/:id	  Delete an item