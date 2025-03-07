document.addEventListener("DOMContentLoaded", () => {
  M.Modal.init(document.querySelectorAll(".modal"));
  M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"));
  fetchItems();
});

// Fetch and display items with optional sorting
async function fetchItems(store = "") {
  try {
    let url = "/api/items";
    if (store) {
      url += `?place=${store}`; // Append place filter to API request
    }
    
    const response = await fetch(url);
    const items = await response.json();
    renderItems(items);
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}


document.getElementById("submitItem").addEventListener("click", async () => {
  const name = document.getElementById("itemName").value;
  const quantity = document.getElementById("itemQuantity").value;
  const place = document.getElementById("itemPlace").value;

  await fetch(`/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, quantity, place })
  });

  fetchItems();
  M.Modal.getInstance(document.getElementById("addItemModal")).close();
});

// Search for items
document.getElementById("searchBtn").addEventListener("click", async () => {
  const query = document.getElementById("search").value;
  const response = await fetch(`/api/items?search=${query}`);
  const items = await response.json();
  renderItems(items);
});


// Render shopping items
function renderItems(items) {
  const itemList = document.getElementById("itemList");
  itemList.innerHTML = ""; // Clear the list

  // Group items by store
  const groupedItems = items.reduce((groups, item) => {
    if (!groups[item.place]) {
      groups[item.place] = [];
    }
    groups[item.place].push(item);
    return groups;
  }, {});

  // Render each group separately
  for (const [store, storeItems] of Object.entries(groupedItems)) {
    const storeHeader = document.createElement("h5");
    storeHeader.textContent = store;
    storeHeader.className = "store-header"; // Custom styling if needed
    itemList.appendChild(storeHeader);

    storeItems.forEach((item) => {
      const li = document.createElement("li");
      li.className = "collection-item";
      li.innerHTML = `
        ${item.name} <strong>(${item.quantity})</strong>
        <button class="btn-small blue right" onclick="openEditModal(${item.id}, '${item.name}', ${item.quantity}, '${item.place}')">EDIT</button>
        <button class="btn-small red right" onclick="deleteItem(${item.id})">DELETE</button>
      `;
      itemList.appendChild(li);
    });
  }
}



  // Search items and show results in modal
  document.getElementById("searchBtn").addEventListener("click", async () => {
    const query = document.getElementById("searchName").value.trim();
    console.log(query);


    if (!query) {
      alert("Please enter a search term.");
      return;
    }

    // if (!query) return;
    try {
      const response = await fetch(`/api/items?search=${query}`);
      const results = await response.json();

      const searchResultsList = document.getElementById("searchResults");
      searchResultsList.innerHTML = "";

      if (results.length === 0) {
        searchResultsList.innerHTML = "<li class='collection-item'>No results found</li>";
      } else {
        results.forEach(item => {
          const li = document.createElement("li");
          li.className = "collection-item";
          li.textContent = `${item.name} (${item.quantity}) - ${item.place}`;
          searchResultsList.appendChild(li);
        });
      }

      M.Modal.getInstance(document.getElementById("searchModal")).open();
    } catch (error) {
      console.error("Search Error:", error);
    }
  });

  // Delete item
  async function deleteItem(id) {
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    fetchItems();
  }

  // Open Edit Modal and pre-fill data
  function openEditModal(id, name, quantity, place) {
    document.getElementById("editItemId").value = id;
    document.getElementById("editItemName").value = name;
    document.getElementById("editItemQuantity").value = quantity;
    document.getElementById("editItemPlace").value = place;

    M.Modal.getInstance(document.getElementById("editItemModal")).open();
  }

  document.getElementById("updateItem").addEventListener("click", async () => {
    const id = document.getElementById("editItemId").value;
    const name = document.getElementById("editItemName").value;
    const quantity = document.getElementById("editItemQuantity").value;
    const place = document.getElementById("editItemPlace").value;

    if (!id || !name || !quantity || !place) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity, place }),
      });

      fetchItems(); // Refresh item list after update
      M.Modal.getInstance(document.getElementById("editItemModal")).close(); // Close modal
    } catch (error) {
      console.error("Update Error:", error);
    }
  });

  document.getElementById("filterStore").addEventListener("change", () => {
    const selectedStore = document.getElementById("filterStore").value;
    fetchItems(selectedStore);
  });
  