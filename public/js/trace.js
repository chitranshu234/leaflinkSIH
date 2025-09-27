document.addEventListener('DOMContentLoaded', () => {

    // --- Mock Database ---
    // In a real application, you would fetch this data from a server or blockchain.
    const mockDatabase = {
        "LL-1701234567890": {
            herbName: "Ashwagandha",
            botanicalName: "Withania somnifera",
            collectorName: "Ravi Kumar",
            gpsCoordinates: "29.9457, 78.1642",
            timestamp: "2025-09-26T10:30:00Z",
            qualityNotes: "Healthy plant found in a partially shaded area. Leaves are vibrant green with no signs of pests. Harvested mature roots."
        },
        "LL-1701234561234": {
            herbName: "Brahmi",
            botanicalName: "Bacopa monnieri",
            collectorName: "Priya Sharma",
            gpsCoordinates: "29.9694, 78.1633",
            timestamp: "2025-09-27T11:05:00Z",
            qualityNotes: "Collected from a moist, marshy area near the riverbank. Plant appears healthy and well-hydrated. No discoloration observed."
        }
    };

    // --- DOM Elements ---
    const traceForm = document.getElementById('trace-form');
    const herbIdInput = document.getElementById('herb-id-input');
    const resultsContainer = document.getElementById('results-container');
    const resultsContent = document.getElementById('results-content');
    const errorMessage = document.getElementById('error-message');

    // --- Result Fields ---
    const resultHerbName = document.getElementById('result-herb-name');
    const resultBotanicalName = document.getElementById('result-botanical-name');
    const resultCollectorName = document.getElementById('result-collector-name');
    const resultGps = document.getElementById('result-gps');
    const resultDate = document.getElementById('result-date');
    const resultNotes = document.getElementById('result-notes');

    // --- Form Submission Logic ---
    if (traceForm) {
        traceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchId = herbIdInput.value.trim();
            let record = mockDatabase[searchId];

            // Show the main results container regardless
            resultsContainer.style.display = 'block';

            // If not found in mockDatabase, try API call
            if (!record) {
                try {
                    const requestOptions = {
                        method: "GET",
                        redirect: "follow"
                    };
                    // You may want to use searchId in the API URL if your backend supports it
                    const response = await fetch("http://localhost:3000/api/herbs/68d7a92c35d59c7b53cde096", requestOptions);
                    const result = await response.json().catch(() => null);

                    if (result && (result.herbName || result.botanicalName)) {
                        // Assume the API returns a similar structure
                        record = {
                            herbName: result.herbName || "",
                            botanicalName: result.botanicalName || "",
                            collectorName: result.collectorName || "",
                            gpsCoordinates: result.gpsCoordinates || "",
                            timestamp: result.timestamp || "",
                            qualityNotes: result.qualityNotes || ""
                        };
                    }
                } catch (err) {
                    // API error, do nothing here, will show error below
                }
            }

            if (record) {
                // If record is found, show details and hide error
                resultsContent.style.display = 'block';
                errorMessage.style.display = 'none';

                // Populate the fields
                resultHerbName.textContent = record.herbName;
                resultBotanicalName.textContent = record.botanicalName;
                resultCollectorName.textContent = record.collectorName;
                resultGps.textContent = record.gpsCoordinates;
                resultNotes.textContent = record.qualityNotes;
                // Format the date for better readability
                resultDate.textContent = record.timestamp
                    ? new Date(record.timestamp).toLocaleString()
                    : "";

            } else {
                // If record is not found, hide details and show error
                resultsContent.style.display = 'none';
                errorMessage.style.display = 'block';
                errorMessage.textContent = `No record found for ID: "${searchId}". Please check the ID and try again.`;
            }
        });
    }
});