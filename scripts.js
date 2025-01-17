
          // Check if the notification permission has been granted
          if (Notification.permission !== 'granted') {
            // Request permission from the user
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                } else if (permission === 'denied') {
                    console.log('Notification permission denied.');
                } else {
                    console.log('Notification permission dismissed.');
                }
            });
        } else {
            console.log('Notification permission already granted.');
        }
        
        //   // WebSocket integration
        //   console.log(`${window.location.protocol}//${window.location.hostname}:${window.location.port}`);
        //   var socket = io.connect("http://192.168.8.107:5000");
        
        //   // When the WebSocket connection is established
        //   socket.on("connect", () => {
        //     console.log("Socket.IO connection established.");
        //     socket.emit('tv', 'im_a_tv');
        // });
        
        //   // When a messgage is received from the server
        //   socket.on("update_tv", (data) => {
        //     try {
        //         // Ensure the data is valid
        //         if (data.current_ticket && data.office_number) {
        //             openPopup(data.current_ticket, data.office_number);
        //         } else {
        //             console.error("Invalid data received:", data);
        //         }
        //     } catch (error) {
        //         console.error("Error processing Socket.IO message:", error);
        //     }
        // });
        
        //  // Handle Socket.IO connection errors
        //     socket.on("connect_error", (error) => {
        //         console.error("Socket.IO connection error:", error);
        //     });
        
        //     // Handle Socket.IO disconnection
        //     socket.on("disconnect", () => {
        //         console.log("Socket.IO connection closed.");
        //     });
        
                // MQTT Configuration
                const brokerUrl = 'wss://22f036df50984390b36ae0d50c4bcf9d.s1.eu.hivemq.cloud:8884/mqtt';
                const username = 'pelectrome';
                const password = 'Snb19951717';
                const topicSub = 'kiosk';
                const topicPub = 'kiosk_cmd';
        
                // Connect to the broker
                const client = mqtt.connect(brokerUrl, {
                    username: username,
                    password: password
                });
        
        
                // Handle connection
                client.on('connect', () => {
                    logMessage('Connected to broker');
                    client.subscribe(topicSub, (err) => {
                        if (err) {
                            logMessage('Subscription error: ' + err.message);
                        } else {
                            logMessage('Subscribed to topic: ' + topicSub);
                        }
                    });
                });
        
                // Handle incoming messages
                client.on('message', (topic, message) => {
                    logMessage(`Message received on ${topic}: ${message.toString()}`);
                    const jsonObject = JSON.parse(message.toString());
                    openPopup(jsonObject.current_ticket, jsonObject.office_number);
        
                });
        
                // Handle errors
                client.on('error', (err) => {
                    logMessage('Connection error: ' + err.message);
                });
        
                // Publish a message
                function publishMessage() {
                    const msg = "hello bro";
                    if (msg) {
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
                // setInterval(publishMessage, 10000);
        
            function openPopup(current_ticket, office_number) {
                // Update the popup content
                document.querySelector(".ticket-number-popup").textContent = current_ticket;
                document.querySelector(".office-number-popup").textContent = office_number;
                document.querySelector(".popup-overlay").style.opacity = "1";
                document.querySelector(".popup-overlay").style.pointerEvents = "auto";
                const popupTitle = document.getElementById("popup-title");
                popupTitle.textContent = "Attention";
            
                // Get the list container
                const listContainer = document.querySelector(".list-container ul");
            
                // Check if an item with the same office number already exists
                const existingItem = Array.from(listContainer.children).find(item => {
                    const existingOfficeNumber = item.querySelector(".office-number")?.textContent;
                    return existingOfficeNumber === office_number;
                });
            
                if (existingItem) {
                    // Remove the existing item
                    listContainer.removeChild(existingItem);
                }
            
                // Create a new list item
                const newListItem = document.createElement("li");
                newListItem.innerHTML = `
                    <img src="static/icons/person.svg" alt="Person Logo" class="person-logo">
                    <div class="ticket-number">${current_ticket}</div>
                    <span class="ticket-office">
                        <div class="office-number">${office_number}</div>
                        <img src="static/icons/ticket_office.svg" alt="Office Logo" class="office-logo">
                    </span>
                `;
            
                // Insert the new list item at the top
                listContainer.prepend(newListItem);
            
                // Limit the list to a maximum of 4 items
                const listItems = listContainer.querySelectorAll("li");
                if (listItems.length > 4) {
                    listContainer.removeChild(listItems[listItems.length - 1]);
                }
            
                setTimeout(closePopup, 5000);
                const audioPlayer = document.getElementById("audioPlayer");
                audioPlayer.play();
        
        
        
                 // Display system notification
            if (Notification.permission === 'granted') {
                const notification = new Notification("New Ticket Update", {
                    body: `Ticket: ${current_ticket}, Office: ${office_number}`,
                    icon: "static/icons/logo.png", // Replace with your icon URL
                    requireInteraction: true, // Keeps the notification visible until the user interacts
                });
        
                // Optionally handle notification click
                notification.onclick = () => {
                    console.log("Notification clicked");
                };
            }
            }
            
        
          // Function to close the popup and remove the background blur
          function closePopup() {
            document.querySelector(".popup-overlay").style.opacity = "0";
            document.querySelector(".popup-overlay").style.pointerEvents = "none";
          }
          
        
        
        
        