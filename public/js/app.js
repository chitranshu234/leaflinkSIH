document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Navigation ---
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (navToggle && navMenu) {
    // Toggle menu on hamburger click
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show-menu");
      navToggle.classList.toggle("active");
    });

    // Close menu when a link is clicked
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("show-menu");
        navToggle.classList.remove("active");
      });
    });
  }

  // --- Form Handling ---
  const herbForm = document.getElementById("herb-form");
  const getLocationBtn = document.getElementById("getLocationBtn");
  const locationDisplay = document.getElementById("locationDisplay");
  const gpsCoordinatesInput = document.getElementById("gpsCoordinates");
  const successMessage = document.getElementById("success-message");
  const qrCodeContainer = document.getElementById("qrcode");
  const newHerbIdContainer = document.getElementById("new-herb-id");
  const logAnotherBtn = document.getElementById("log-another-btn");

  // Get GPS Location
  if (getLocationBtn) {
    getLocationBtn.addEventListener("click", () => {
      if (navigator.geolocation) {
        locationDisplay.textContent = "Fetching location...";
        locationDisplay.style.display = "block";

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            gpsCoordinatesInput.value = coords;
            locationDisplay.textContent = `✅ Location Captured: ${coords}`;
            getLocationBtn.textContent = "📍 Recapture Location";
          },
          (error) => {
            console.error("Geolocation error:", error);
            locationDisplay.textContent = `Error: ${error.message}. Please enable location services.`;
          }
        );
      } else {
        locationDisplay.textContent =
          "Geolocation is not supported by this browser.";
        locationDisplay.style.display = "block";
      }
    });
  }

  // Handle Form Submission
  if (herbForm) {
    herbForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // 1. Get form data
      const formData = new FormData(herbForm);
      console.log(formData);
      const herbData = Object.fromEntries(formData.entries());
      console.log(herbData);
      herbData.timestamp = new Date().toISOString();

      // api call to backend
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(herbData);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      let uniqueId = null;
      try {
        const response = await fetch("http://localhost:3000/api/herbs", requestOptions);
        const result = await response.json().catch(() => null);
        // Try to get the id from the result, fallback to null if not present
        uniqueId = result && (result._id || result.id) ? (result._id || result.id) : null;
      } catch (err) {
        console.error("Error submitting herb data:", err);
      }

      // This is a simple unique ID for demonstration
      herbData.id = uniqueId;

      console.log("Submitting data (simulated):", herbData);

      // 2. Hide form, show success message
      herbForm.style.display = "none";
      successMessage.style.display = "block";

      // 3. Generate QR Code
      qrCodeContainer.innerHTML = ""; // Clear previous QR code
      new QRCode(qrCodeContainer, {
        text: JSON.stringify({ id: uniqueId, name: herbData.herbName }),
        width: 128,
        height: 128,
        colorDark: "#0d1117",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      // 4. Display the new Herb ID
      newHerbIdContainer.textContent = `ID: ${uniqueId}`;
    });
  }

  // Handle "Log Another" button
  if (logAnotherBtn) {
    logAnotherBtn.addEventListener("click", () => {
      // Reset form fields
      herbForm.reset();

      // Hide success message, show form
      successMessage.style.display = "none";
      herbForm.style.display = "block";

      // Reset location button and display
      locationDisplay.style.display = "none";
      locationDisplay.textContent = "Location will be displayed here...";
      getLocationBtn.textContent = "📍 Get Current Location";
    });
  }
});
