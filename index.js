

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://we-are-the-champions-7e2cc-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsListInDB = ref(database, "endorsementsList");

let btn = document.getElementById("btn");
let alertArea = document.getElementById("alert-area");
let textApplied = document.getElementById("conteiner-post");

// Firebase data listener
onValue(endorsementsListInDB, function(snapshot) {
    textApplied.innerHTML = '';  // Clear existing data
    
    if (snapshot.exists()) {
        let endorsementsData = snapshot.val();
        let endorsementsKeys = Object.keys(endorsementsData); // Get the keys of the endorsements
        
        endorsementsKeys.reverse().forEach((key) => {
            let endorsement = endorsementsData[key]; // Get the endorsement data for each key
            textApplied.innerHTML += `<div class="conteiner-post">
                <p class="names">To ${endorsement.toWho}</p>
                <p class="text-applied">${endorsement.text}</p>
                <div class="conteiner-tre">
                    <p class="names">From ${endorsement.fromWho}</p>
                    <button class="names likes" id="likeBtn-${key}">❤️ ${endorsement.likes || 0}</button>
                </div>
            </div>`;
        });

        // Add event listeners to the likes buttons
        endorsementsKeys.forEach((key) => {
            let likeButton = document.getElementById(`likeBtn-${key}`);
            likeButton.addEventListener('click', function() {
                incrementLikes(key);
            });
        });
    }
});


// Function to increment likes
//function incrementLikes(key) {
 //   const endorsementRef = ref(database, `endorsementsList/${key}`);

    // Run a transaction to increment the likes
   // runTransaction(endorsementRef, (currentData) => {
    //    if (currentData) {
    //        currentData.likes = (currentData.likes || 0) + 1;
       // }
    //    return currentData;
    //});
//}
// Button click event
// Function to increment likes
function incrementLikes(key) {
    // Check if the user has already liked this post
    if(localStorage.getItem(`liked-${key}`)) {
        alert("You have already liked this post.");
        return;
    }

    const endorsementRef = ref(database, `endorsementsList/${key}`);

    // Run a transaction to increment the likes
    runTransaction(endorsementRef, (currentData) => {
        if (currentData) {
            currentData.likes = (currentData.likes || 0) + 1;
        }
        return currentData;
    }).then(() => {
        // Set a flag in local storage indicating that this user has liked this post
        localStorage.setItem(`liked-${key}`, true);
    });
}

// ... rest of your code ...

btn.addEventListener("click", function() {
    let textareaInput = document.getElementById("textarea-input").value;
    let fromInput = document.getElementById("from").value;
    let toInput = document.getElementById("to").value;
    
    // Clear previous alert message
    alertArea.innerHTML = '';

    // Check for empty input fields
    if (textareaInput === "" || fromInput === "" || toInput === "") {
        alertArea.textContent = "All fields must be filled out.";
        return;
    }

    // Create an object to store the endorsement data
    let endorsement = {
        text: textareaInput,
        fromWho: fromInput,
        toWho: toInput,
        likes: 0
    };

    // Push the endorsement object to Firebase
    push(endorsementsListInDB, endorsement);

    clearInputFieldEl();  // Clear input fields after submission
});

// Function to clear input fields
function clearInputFieldEl() {
  
    document.getElementById("textarea-input").value = "";
    document.getElementById("to").value = "";
    document.getElementById("from").value = "";
}
clearInputFieldEl()