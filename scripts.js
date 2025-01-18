// // Register the Service Worker
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('service-worker.js')
//         .then((registration) => {
//             console.log('Service Worker registered with scope:', registration.scope);
//         })
//         .catch((error) => {
//             console.error('Service Worker registration failed:', error);
//         });
// }
// // Function to send a notification request to the service worker
// function sendNotificationToServiceWorker(current_ticket, office_number) {
//     if (navigator.serviceWorker.controller) {
//         navigator.serviceWorker.controller.postMessage({
//             type: 'SHOW_NOTIFICATION',
//             title: 'New Ticket Update',
//             body: `Ticket: ${current_ticket}, Office: ${office_number}`,
//             icon: 'static/icons/logo.png'
//         });
//     }
// }
// // Check if the notification permission has been granted
// if (Notification.permission !== 'granted') {
//     // Request permission from the user
//     Notification.requestPermission().then(permission => {
//         if (permission === 'granted') {
//             console.log('Notification permission granted.');
//         } else if (permission === 'denied') {
//             console.log('Notification permission denied.');
//         } else {
//             console.log('Notification permission dismissed.');
//         }
//     });
// } else {
//     console.log('Notification permission already granted.');
// }

let muted = false;
let wakeLock = null;

async function requestWakeLock() {
    try {
        // Check if the browser supports the Screen Wake Lock API
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Screen wake lock acquired');
        } else {
            console.log('Screen Wake Lock API not supported');
        }
    } catch (err) {
        console.error('Failed to acquire wake lock:', err);
    }
}

// Request wake lock when the page is loaded
window.addEventListener('load', () => {
    requestWakeLock();
});

// Show loading animation
function showLoading() {
    document.getElementById("loading-animation").style.display = 'flex';
}

// Hide loading animation
function hideLoading() {
    document.getElementById("loading-animation").style.display = 'none';
}

// MQTT Configuration
const brokerUrl = 'wss://22f036df50984390b36ae0d50c4bcf9d.s1.eu.hivemq.cloud:8884/mqtt';
const username = 'pelectrome';
const password = 'Snb19951717';
const topicSub = 'kiosk';
const lp_topicSub = 'kiosk_lp';
const topicPub = 'kiosk_cmd';

// Connect to the broker
const client = mqtt.connect(brokerUrl, {
    username: username,
    password: password
});

// Handle connection
client.on('connect', () => {
    logMessage('Connected to broker');
    const topics = [topicSub, lp_topicSub];
    // Subscribing to multiple topics at once
    client.subscribe(topics, (err, granted) => {
        if (err) {
            logMessage('Subscription error: ' + err.message);
        } else {
            logMessage('Subscribed to topics: ' + granted.map(grant => grant.topic).join(', '));
            console.log('calling')
            publishMessage('load_page')
        }
    });
});

// Handle incoming messages
client.on('message', (topic, message) => {
    if(topic == lp_topicSub)
    {
        logMessage(`Message received on ${topic}: ${message.toString()}`);
        const jsonObject = JSON.parse(message.toString());

        hideLoading();
        updateList(jsonObject.list);  // Update the list with the received data

    }
    else if(topic == topicSub)
    {
        logMessage(`Message received on ${topic}: ${message.toString()}`);
        const jsonObject = JSON.parse(message.toString());
        updateList(jsonObject.list);  // Update the list with the received data
        openPopup(jsonObject.list[0].current_ticket, jsonObject.list[0].office_number);
    }

});

// Handle errors
client.on('error', (err) => {
    logMessage('Connection error: ' + err.message);
});

// Publish a message
function publishMessage(msg) {
    if (msg) {
        // Add debug log to check if it's being called multiple times
        console.log("Publishing message: ", msg);
        // client.publish(topicPub, msg, { qos: 0 }, (err) => {
        client.publish(topicPub, msg, (err) => {
            if (err) {
                logMessage('Publish error: ' + err.message);
            } else {
                logMessage(`Published: ${msg} to ${topicPub}`);
            }
        });
    }
}

// Utility function to log messages
function logMessage(message) {
    console.log(message);
}

// Function to update the list on the page
function updateList(list) {
    const listContainer = document.querySelector(".list-container ul");

    // Clear the current list
    listContainer.innerHTML = '';

    // Iterate through the new list data and add items to the list
    list.forEach(ticket => {
        // Check if current_ticket is null, if so, set it as an empty string
        const ticketText = ticket.current_ticket === null ? "" : ticket.current_ticket;

        const newListItem = document.createElement("li");
        newListItem.innerHTML = `
            <img src="static/icons/person.svg" alt="Person Logo" class="person-logo">
            <div class="ticket-number">${ticketText}</div>
            <span class="ticket-office">
                <div class="office-number">${ticket.office_number}</div>
                <img src="static/icons/ticket_office.svg" alt="Office Logo" class="office-logo">
            </span>
        `;
        listContainer.appendChild(newListItem);
    });
}
let timeoutId; // Declare a variable to track the timeout

// Function to open the popup and trigger notification
function openPopup(current_ticket, office_number) {
    // Update the popup content
    document.querySelector(".ticket-number-popup").textContent = current_ticket;
    document.querySelector(".office-number-popup").textContent = office_number;
    document.querySelector(".popup-overlay").style.opacity = "1";
    document.querySelector(".popup-overlay").style.pointerEvents = "auto";
    const popupTitle = document.getElementById("popup-title");
    popupTitle.textContent = "Attention";

       // Clear the previous timeout if it exists
       if (timeoutId) {
        clearTimeout(timeoutId);
        console.log("Clear the previous timeout");
    }

    timeoutId = setTimeout(closePopup, 5000);
    if(muted == true){
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.play();
    }


    // Trigger notification from Service Worker
    // sendNotificationToServiceWorker(jsonObject.current_ticket, jsonObject.office_number);

}

// Function to close the popup and remove the background blur
function closePopup() {
    document.querySelector(".popup-overlay").style.opacity = "0";
    document.querySelector(".popup-overlay").style.pointerEvents = "none";
}

const muteButton = document.getElementById('muteButton');
    muteButton.addEventListener('click', () => {
      // Check the current state of the button by its file source
      if (muted) {
        muteButton.querySelector('img').src = 'static/icons/sound-muted.svg'; // Update the icon to mute
        muted = false;
        console.log(muted);
      } else {
        muteButton.querySelector('img').src = 'static/icons/sound-unmuted.svg'; // Update the icon to unmute
        muted = true;
        console.log(muted);
      }
    });
