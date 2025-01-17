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

/// Function to fetch and display ticket data from Firebase
function fetchTicketListFromFirebase() {
    const listContainer = document.querySelector(".list-container ul");

    // Reference to tickets data in Firebase
    const ticketsRef = ref(database, "tickets");

    // Listen for changes in the database
    onValue(ticketsRef, (snapshot) => {
        const tickets = snapshot.val();

        // Clear the existing list items before adding new ones
        listContainer.innerHTML = '';

        // If there are tickets in the database
        if (tickets) {
            // Get an array of ticket objects and sort them by the 'id' field
            const sortedTickets = Object.keys(tickets)
                .map(ticketKey => tickets[ticketKey])
                .sort((a, b) => a.id - b.id); // Sorting based on the 'id' field

            // Iterate through the sorted tickets and create list items
            sortedTickets.forEach(ticket => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <img src="static/icons/person.svg" alt="Person Logo" class="person-logo">
                    <div class="ticket-number">${ticket.current_ticket}</div>
                    <span class="ticket-office">
                        <div class="office-number">${ticket.office_number}</div>
                        <img src="static/icons/ticket_office.svg" alt="Office Logo" class="office-logo">
                    </span>
                `;
                listContainer.appendChild(listItem);
            });
        } else {
            listContainer.innerHTML = `<li>No tickets available.</li>`;
        }
    });
}

// Call the function to fetch tickets
fetchTicketListFromFirebase();

