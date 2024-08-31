document.addEventListener("DOMContentLoaded", () => {
  const userTableBody = document.querySelector("#userTable tbody");
  const userFormContainer = document.getElementById("userFormContainer");
  const userForm = document.getElementById("userForm");
  const addUserBtn = document.getElementById("addUserBtn");
  const closeForm = document.getElementById("closeForm");
  const formTitle = document.getElementById("formTitle");
  const userIdInput = document.getElementById("userId");

  const apiUrl = "https://jsonplaceholder.typicode.com/users";

  // Fetch and display users
  async function fetchUsers() {
    try {
      const response = await fetch(apiUrl);
      const users = await response.json();
      displayUsers(users);
    } catch (error) {
      alert("Failed to fetch users. Please try again later.");
      console.error("Error:", error);
    }
  }

  function displayUsers(users) {
    userTableBody.innerHTML = "";
    users.forEach((user) => {
      const userRow = document.createElement("tr");
      userRow.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name.split(" ")[0]}</td>
                <td>${user.name.split(" ")[1]}</td>
                <td>${user.email}</td>
                <td>${user.company.name}</td>
                <td>
                    <button class="editBtn" data-id="${user.id}">Edit</button>
                    <button class="deleteBtn" data-id="${
                      user.id
                    }">Delete</button>
                </td>
            `;
      userTableBody.appendChild(userRow);
    });

    // Attach event listeners for edit and delete buttons
    document.querySelectorAll(".editBtn").forEach((button) => {
      button.addEventListener("click", handleEditUser);
    });

    document.querySelectorAll(".deleteBtn").forEach((button) => {
      button.addEventListener("click", handleDeleteUser);
    });
  }

  // Add user
  addUserBtn.addEventListener("click", () => {
    formTitle.textContent = "Add User";
    userForm.reset();
    userIdInput.value = "";
    userFormContainer.style.display = "block";
  });

  // Close form modal
  closeForm.addEventListener("click", () => {
    userFormContainer.style.display = "none";
  });

  // Handle form submission
  userForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userId = userIdInput.value;
    const user = {
      name: `${document.getElementById("firstName").value} ${
        document.getElementById("lastName").value
      }`,
      email: document.getElementById("email").value,
      company: { name: document.getElementById("department").value },
    };

    if (userId) {
      await updateUser(userId, user);
    } else {
      await createUser(user);
    }

    userFormContainer.style.display = "none";
    fetchUsers(); // Refresh the user list
  });

  // Create user
  async function createUser(user) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      await response.json();
      alert("User added successfully.");
    } catch (error) {
      alert("Failed to add user. Please try again later.");
      console.error("Error:", error);
    }
  }

  // Edit user
  async function updateUser(userId, user) {
    try {
      const response = await fetch(`${apiUrl}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      await response.json();
      alert("User updated successfully.");
    } catch (error) {
      alert("Failed to update user. Please try again later.");
      console.error("Error:", error);
    }
  }

  // Handle edit user
  function handleEditUser(event) {
    const userId = event.target.getAttribute("data-id");
    fetch(`${apiUrl}/${userId}`)
      .then((response) => response.json())
      .then((user) => {
        formTitle.textContent = "Edit User";
        userIdInput.value = user.id;
        document.getElementById("firstName").value = user.name.split(" ")[0];
        document.getElementById("lastName").value = user.name.split(" ")[1];
        document.getElementById("email").value = user.email;
        document.getElementById("department").value = user.company.name;
        userFormContainer.style.display = "block";
      })
      .catch((error) => {
        alert("Failed to fetch user details. Please try again later.");
        console.error("Error:", error);
      });
  }

  // Handle delete user
  async function handleDeleteUser(event) {
    const userId = event.target.getAttribute("data-id");
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        await fetch(`${apiUrl}/${userId}`, {
          method: "DELETE",
        });
        alert("User deleted successfully.");
        fetchUsers(); // Refresh the user list
      } catch (error) {
        alert("Failed to delete user. Please try again later.");
        console.error("Error:", error);
      }
    }
  }

  // Fetch users on page load
  fetchUsers();
});
