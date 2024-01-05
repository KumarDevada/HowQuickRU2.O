import { ref, database } from "./firebase"; // Import ref function

export function insertData(userData) {
  const uid = userData.uid;
  const newSpeed = userData.speed;

  // Use ref() to create a reference to the "users" node
  const usersRef = ref(database, "users");

  // Use child() to create a reference to the specific user data
  const userRef = ref(usersRef, uid);

  userRef.once("value", (snapshot) => {
    if (snapshot.exists()) {
      const existingSpeed = snapshot.val().speed;
      if (newSpeed > existingSpeed) {
        // Update existing speed
        userRef
          .update({ speed: newSpeed })
          .then(() => {
            console.log("Speed updated for UID:", uid);
          })
          .catch((error) => {
            console.error("Error updating speed:", error);
          });
      } else {
        // No speed update needed
        console.log("Speed not updated for UID:", uid);
      }
    } else {
      // Insert new data
      userRef
        .set({
          speed: newSpeed,
          date: userData.date,
          time: userData.time,
          username: userData.username,
        })
        .then(() => {
          console.log("Data inserted successfully for UID:", uid);
        })
        .catch((error) => {
          console.error("Error inserting data:", error);
        });
    }
  });
}
