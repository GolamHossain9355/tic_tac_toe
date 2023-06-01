import fetch from "node-fetch"

// Function to ping your server
async function pingServer() {
   try {
      // Replace `https://your-server-url` with the actual URL of your server
      const response = await fetch("https://tic-tac-toe-back-qqyl.onrender.com")
      console.log(`Ping response: ${response.status}`)
   } catch (error) {
      console.error("Error pinging server:", error)
   }
}

// Ping the server every 13 minutes (in milliseconds)
const pingInterval = 13 * 60 * 1000
setInterval(pingServer, pingInterval)
