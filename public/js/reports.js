// ==========================
// REPORTS — Now using backend & MongoDB
// ==========================

document.addEventListener("DOMContentLoaded", loadReportsFromDB);

const searchBox = document.getElementById("searchBox");
const categoryFilter = document.getElementById("categoryFilter");
const tableBody = document.getElementById("tableBody");

// Load reports from backend
async function loadReportsFromDB() {
    const res = await fetch("/reports/data");
    const reports = await res.json();

    tableBody.innerHTML = "";
    reports.forEach(addRowToTable);
}

// Add new report (submit to backend)
document.getElementById("saveReportBtn").addEventListener("click", async () => {

    const formData = new FormData();
    formData.append("name", document.getElementById("r_name").value);
    formData.append("type", document.getElementById("r_type").value);
    formData.append("category", document.getElementById("r_category").value);
    formData.append("date", document.getElementById("r_date").value);
    formData.append("doctor", document.getElementById("r_doctor").value);
    formData.append("file", document.getElementById("fileUpload").files[0]);

    const res = await fetch("/reports/add", {
        method: "POST",
        body: formData
    });

    if (res.ok) {
        alert("Report saved!");
        document.getElementById("addReportModal").style.display = "none";
        loadReportsFromDB();
    } else {
        alert("Error saving report");
    }
});

// Add row to HTML table
function addRowToTable(report) {
    const row = document.createElement("tr");
    row.dataset.id = report._id;

    row.innerHTML = `
        <td><input type="checkbox" class="row-checkbox"></td>
        <td>${report.name}</td>
        <td>${report.type}</td>
        <td>${report.category}</td>
        <td>${report.date}</td>
        <td>${report.doctor}</td>
        <td><span class="file-tag">${report.type}</span></td>
        <td><button class="viewBtn">View</button></td>
        <td><button class="deleteBtn">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

// Handle View/Delete buttons
tableBody.addEventListener("click", async (e) => {

    const row = e.target.closest("tr");
    const id = row.dataset.id;

    // VIEW FILE
    if (e.target.classList.contains("viewBtn")) {
        const iframeUrl = `/uploads/${id}`;
        document.getElementById("modalContent").innerHTML =
            `<iframe src="${iframeUrl}" width="100%" height="520px"></iframe>`;
        document.getElementById("modal").style.display = "flex";
    }

    // DELETE FILE
    if (e.target.classList.contains("deleteBtn")) {
        if (confirm("Delete this report?")) {
            await fetch(`/reports/delete/${id}`, { method: "DELETE" });
            row.remove();
        }
    }
});

document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
});

// Search filter
searchBox.addEventListener("input", filterTable);
categoryFilter.addEventListener("change", filterTable);

function filterTable() {
    const search = searchBox.value.toLowerCase();
    const cat = categoryFilter.value;

    tableBody.querySelectorAll("tr").forEach(row => {
        const name = row.cells[1].innerText.toLowerCase();
        const category = row.cells[3].innerText;

        const matchSearch = name.includes(search);
        const matchCat = cat === "all" || category === cat;

        row.style.display = matchSearch && matchCat ? "" : "none";
    });
}
