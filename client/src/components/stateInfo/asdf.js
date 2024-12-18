// Base URL for the API
const baseURL = 'http://localhost:8080/states/6/districts/';

// Function to fetch and combine the payloads
async function getDistrictSummaries() {
    const districtData = [];

    for (let i = 1; i <= 7; i++) {
        try {
            const response = await fetch(`${baseURL}${6}/summary`);
            if (response.ok) {
                const data = await response.json();
                districtData.push(data);
            } else {
                console.error(`Failed to fetch data for district ${i}`);
            }
        } catch (error) {
            console.error(`Error fetching district ${i}:`, error);
        }
    }

    // Output combined data as a JavaScript object
    console.log(districtData);
}

// Call the function to get the data
getDistrictSummaries();
