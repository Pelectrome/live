// Import necessary Firebase modules (modular API)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDSu3uQTddvPVZ9juGzyjNdfsvuPj9P-1s",
    authDomain: "kiosk-c7744.firebaseapp.com",
    databaseURL: "https://kiosk-c7744-default-rtdb.firebaseio.com",
    projectId: "kiosk-c7744",
    storageBucket: "kiosk-c7744.firebasestorage.app",
    messagingSenderId: "306519394521",
    appId: "1:306519394521:web:1a65c582bf9fbf309816c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to fetch and display ticket data from Firebase
function fetchTicketListFromFirebase() {
    const listContainer = document.querySelector(".list-container ul"); // Assuming the HTML contains a container like <div class="list-container"><ul></ul></div>

    // Reference to the 'list' data in Firebase
    const listRef = ref(database, "list");

    // Listen for changes in the database
    onValue(listRef, (snapshot) => {
        const listData = snapshot.val();

        // Clear the existing list items before adding new ones
        listContainer.innerHTML = '';

        // Check if the list data exists
        if (listData) {
            // Iterate through the array of objects in 'list'
            listData.forEach(item => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <img src="static/icons/person.svg" alt="Person Logo" class="person-logo">
                    <div class="ticket-number">${item.current_ticket}</div>
                    <span class="ticket-office">
                        <div class="office-number">${item.office_number}</div>
                        <img src="static/icons/ticket_office.svg" alt="Office Logo" class="office-logo">
                    </span>
                `;
                listContainer.appendChild(listItem);
            });
        } else {
            // If no list data is available, display a message
            listContainer.innerHTML = `<li>No tickets available.</li>`;
        }
    });
}

// Call the function to fetch and display tickets
fetchTicketListFromFirebase();
