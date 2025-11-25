const searchBox = document.getElementById("searchBox");
const categoryFilter = document.getElementById("categoryFilter");
const tableBody = document.getElementById("tableBody");
const profileQrBtn = document.getElementById("profileQrBtn");
const addReportBtn = document.getElementById("addReportBtn");

// Modals
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");
const addModal = document.getElementById("addReportModal");
const closeAddReport = document.getElementById("closeAddReport");
const saveReportBtn = document.getElementById("saveReportBtn");

// ========================= FILTER TABLE =========================
searchBox.addEventListener("input", filterTable);
categoryFilter.addEventListener("change", filterTable);

function filterTable() {
    let searchValue = searchBox.value.toLowerCase();
    let categoryValue = categoryFilter.value;
    let rows = tableBody.getElementsByTagName("tr");

    for (let row of rows) {
        let name = row.cells[0].innerText.toLowerCase();
        let category = row.cells[2].innerText;
        let matchesSearch = name.includes(searchValue);
        let matchesCategory = (categoryValue === "all" || categoryValue === category);
        row.style.display = (matchesSearch && matchesCategory) ? "" : "none";
    }
}

// ========================= ADD REPORT =========================
addReportBtn.addEventListener("click", () => addModal.style.display = "flex");
closeAddReport.addEventListener("click", () => addModal.style.display = "none");

saveReportBtn.addEventListener("click", () => {
    let name = document.getElementById("r_name").value;
    let type = document.getElementById("r_type").value;
    let category = document.getElementById("r_category").value;
    let date = document.getElementById("r_date").value;
    let doctor = document.getElementById("r_doctor").value;

    if (!name || !type || !category || !date || !doctor) {
        alert("Please fill all fields.");
        return;
    }

    const reportId = Date.now(); 
    tableBody.innerHTML += `
        <tr data-report-id="${reportId}">
            <td>${name}</td>
            <td>${type}</td>
            <td>${category}</td>
            <td>${date}</td>
            <td>${doctor}</td>
            <td><button class="viewBtn" data-url="#">View</button></td>
            <td><button class="deleteBtn">Delete</button></td>
        </tr>
    `;

    document.getElementById("r_name").value = '';
    document.getElementById("r_type").value = '';
    document.getElementById("r_category").value = '';
    document.getElementById("r_date").value = '';
    document.getElementById("r_doctor").value = '';
    addModal.style.display = "none";
});

// ========================= DELETE REPORT =========================
tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("deleteBtn")) {
        if (confirm("Are you sure you want to delete this report?")) {
            e.target.closest("tr").remove();
        }
    }
});

// ========================= VIEW / QR MODAL =========================
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    modalContent.innerHTML = '';
});

// View button
tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("viewBtn")) {
        modalContent.innerHTML = "<p>No preview available in this demo.</p>";
        modal.style.display = "flex";
    }
});

// ========================= GENERATE QR =========================
profileQrBtn.addEventListener("click", generateProfileQr);

function generateProfileQr() {
    let allReports = [];
    let rows = tableBody.getElementsByTagName("tr");

    for (let row of rows) {
        allReports.push({
            id: row.dataset.reportId,
            date: row.cells[3].innerText
        });
    }

    const profileId = "PATIENT_ID_XYZ_789";
    const reportCount = allReports.length;
    const dataSummary = allReports.map(r => `${r.id}:${r.date}`).join(';');
    const expiryTimestamp = Math.floor((Date.now() + 24*60*60*1000)/1000); 

    // Encode a token that includes the expiry and report IDs
    const tokenData = `HEALTH_PASSPORT|ID:${profileId}|COUNT:${reportCount}|EXPIRES:${expiryTimestamp}|RECORDS:${dataSummary}`;
    const tokenBase64 = btoa(tokenData);

    // URL that the doctor scans
    const viewerUrl = `http://localhost:4000/view-reports?token=${tokenBase64}`;

    modalContent.innerHTML = `
        <h3>Universal Health Passport QR Code</h3>
        <p>Scan this QR code to access the patient's ${reportCount} records (if valid).</p>
        <p style="font-weight:bold; color:#d32f2f;">
            Expires on: ${new Date(expiryTimestamp*1000).toLocaleString()}
        </p>
        <div id="qrcode" style="width:200px; height:200px; margin: 15px auto;"></div>
    `;

    modal.style.display = "flex";

    new QRCode(document.getElementById("qrcode"), {
        text: viewerUrl,
        width: 200,
        height: 200,
        colorDark : "#0d47a1",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}
