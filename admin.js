import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const roles = ["guest", "employee", "researcher", "senior researcher", "executive", "director"];

async function loadUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const tbody = document.getElementById("userTableBody");
        tbody.innerHTML = "";

        querySnapshot.forEach(docSnap => {
            const user = docSnap.data();
            const uid = docSnap.id;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email || "—"}</td>
                <td>
                    <select class="admin-select" data-uid="${uid}">
                        ${roles.map(r => `
                            <option value="${r}" ${r === user.role ? "selected" : ""}>${r}</option>
                        `).join("")}
                    </select>
                </td>
                <td>
                    <select class="admin-select admin-clearance" data-uid="${uid}">
                        ${[1,2,3,4,5,6].map(c => `
                            <option value="${c}" ${c === user.clearance ? "selected" : ""}>Level ${c}</option>
                        `).join("")}
                    </select>
                </td>
                <td>
                    <button class="admin-save-btn" data-uid="${uid}">Save</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Save button handlers
        document.querySelectorAll(".admin-save-btn").forEach(btn => {
            btn.addEventListener("click", async function() {
                const uid = this.dataset.uid;
                const row = this.closest("tr");
                const roleSelect = row.querySelectorAll(".admin-select")[0];
                const clearanceSelect = row.querySelectorAll(".admin-select")[1];

                try {
                    await updateDoc(doc(db, "users", uid), {
                        role: roleSelect.value,
                        clearance: parseInt(clearanceSelect.value)
                    });

                    btn.textContent = "Saved ✓";
                    btn.style.color = "#00cc66";
                    setTimeout(() => {
                        btn.textContent = "Save";
                        btn.style.color = "";
                    }, 2000);

                } catch (err) {
                    alert("Error saving: " + err.message);
                }
            });
        });

    } catch (err) {
        alert("Could not load users: " + err.message);
    }
}

// Check auth state and clearance before loading
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const clearance = parseInt(localStorage.getItem("clearance"));
    if (clearance < 6) {
        window.location.href = "index.html";
        return;
    }

    loadUsers();
});