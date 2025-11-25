// ==========================
// PRESCRIPTIONS — Backend + MongoDB
// ==========================

document.addEventListener("DOMContentLoaded", loadPrescriptionsFromDB);

const searchBox = document.getElementById("searchBox");
const categoryFilter = document.getElementById("categoryFilter");
const tableBody = document.getElementById("tableBody");

// Load prescriptions from backend
async function loadPrescriptionsFromDB() {
    const res = await fetch("/prescriptions/data");
    const items = await res.json();

    tableBody.innerHTML = "";
    items.forEach(addRowToTable);
}

// Save prescription to backend
document.getElementById("saveReportBtn").addEventListener("click", async () => {

    const formData = new FormData();
    formData.append("name", document.getElementById("r_name").value);
    formData.append("type", document.getElementById("r_type").value);
    formData.append("specialty", document.getElementById("r_category").value);
    formData.append("date", document.getElementById("r_date").value);
    formData.append("doctor", document.getElementById("r_doctor").value);
    formData.append("file", document.getElementById("fileUpload").files[0]);

    const res = await fetch("/prescriptions/add", {
        method: "POST",
        body: formData
    });

    if (res.ok) {
        alert("Prescription saved!");
        document.getElementById("addReportModal").style.display = "none";
        loadPrescriptionsFromDB();
    } else {
        alert("Error saving prescription");
    }
});

// Add row to UI
function addRowToTable(item) {
    const row = document.createElement("tr");
    row.dataset.id = item._id;

    row.innerHTML = `
        <td><input type="checkbox" class="row-checkbox"></td>
        <td>${item.name}</td>
        <td>${item.type}</td>
        <td>${item.specialty}</td>
        <td>${item.date}</td>
        <td>${item.doctor}</td>
        <td><span class="file-tag">${item.type}</span></td>
        <td><button class="viewBtn">View</button></td>
        <td><button class="deleteBtn">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

// View/Delete
tableBody.addEventListener("click", async (e) => {

    const row = e.target.closest("tr");
    const id = row.dataset.id;

    // VIEW FILE
    if (e.target.classList.contains("viewBtn")) {
        const iframeUrl = `/uploads/prescriptions/${id}`;
        document.getElementById("modalContent").innerHTML =
            `<iframe src="${iframeUrl}" width="100%" height="520px"></iframe>`;
        document.getElementById("modal").style.display = "flex";
    }

    // DELETE
    if (e.target.classList.contains("deleteBtn")) {
        if (confirm("Delete this prescription?")) {
            await fetch(`/prescriptions/delete/${id}`, { method: "DELETE" });
            row.remove();
        }
    }
});

document.getElementById("closeModal").addEventListener("click", () =>
    document.getElementById("modal").style.display = "none"
);

// Filters
searchBox.addEventListener("input", filterTable);
categoryFilter.addEventListener("change", filterTable);

function filterTable() {
    const search = searchBox.value.toLowerCase();
    const cat = categoryFilter.value;

    tableBody.querySelectorAll("tr").forEach(row => {
        const name = row.cells[1].innerText.toLowerCase();
        const specialty = row.cells[3].innerText;

        const matchSearch = name.includes(search);
        const matchCat = cat === "all" || specialty === cat;

        row.style.display = matchSearch && matchCat ? "" : "none";
    });
}
