document.addEventListener("DOMContentLoaded", function () {
    const fraudForm = document.getElementById("fraudForm");
    const fraudResult = document.getElementById("fraudResult");
    const transactionTable = document.getElementById("transactionTable");
    const searchBox = document.getElementById("searchBox");

    // Dummy data (replace with API call)
    let transactions = [
        { id: "TXN001", amount: 5000, isFraud: false },
        { id: "TXN002", amount: 20000, isFraud: true },
        { id: "TXN003", amount: 7000, isFraud: false },
    ];

    // Function to fetch fraud detection result
    fraudForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const transactionId = document.getElementById("transactionId").value;
        const amount = document.getElementById("amount").value;

        // Call backend API (Replace with real API)
        // Example of API Response:
        let response = {
            transaction_id: transactionId,
            is_fraud: Math.random() < 0.3, // 30% chance of fraud (simulating)
            fraud_reason: "Suspicious transaction pattern"
        };

        // Display result
        fraudResult.innerHTML = `
            <div class="alert ${response.is_fraud ? 'alert-danger' : 'alert-success'}">
                Fraud Status: ${response.is_fraud ? "Fraudulent" : "Safe"}<br>
                Reason: ${response.fraud_reason}
            </div>
        `;

        // Add to transactions list
        transactions.push({ id: transactionId, amount, isFraud: response.is_fraud });
        updateTable();
    });

    // Function to update transaction table
    function updateTable() {
        transactionTable.innerHTML = transactions
            .map(txn => `
                <tr>
                    <td>${txn.id}</td>
                    <td>${txn.amount}</td>
                    <td class="${txn.isFraud ? 'fraud-alert' : ''}">
                        ${txn.isFraud ? "Fraud" : "Safe"}
                    </td>
                </tr>
            `)
            .join("");
    }

    // Search functionality
    searchBox.addEventListener("keyup", function () {
        let filter = searchBox.value.toLowerCase();
        let rows = transactionTable.getElementsByTagName("tr");

        for (let row of rows) {
            let text = row.getElementsByTagName("td")[0]?.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? "" : "none";
        }
    });

    // Initialize table
    updateTable();
});