class TravelPlanner {
  constructor() {
    this.form = document.querySelector(".trip-form");
    this.responseContainer = document.getElementById("aiResponse");
    this.itineraryContent = document.getElementById("itineraryContent");
    this.loadingSpinner = document.getElementById("loadingSpinner");
    this.init();
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Show loading state
    this.loadingSpinner.style.display = "block";
    this.responseContainer.style.display = "block";
    this.itineraryContent.innerHTML = "";

    // Gather form data
    const formData = {
      destination: this.form.querySelector('select[name="destination"]').value,
      budget: this.form.querySelector('select[name="budget"]').value,
      startDate: this.form.querySelector('input[name="start-date"]').value,
      endDate: this.form.querySelector('input[name="end-date"]').value,
      travelingWith: this.form.querySelector('select[name="traveling-with"]')
        .value,
      adventureLevel: Array.from(
        this.form.querySelectorAll('input[name="style"]:checked')
      ).map((checkbox) => checkbox.value),
    };

    try {
      const response = await this.generateItinerary(formData);
      this.displayItinerary(response);
    } catch (error) {
      this.displayError(
        "Oops! Something went wrong while planning your trip. Please try again."
      );
    } finally {
      this.loadingSpinner.style.display = "none";
    }
  }

  async generateItinerary(formData) {
    const OPENAI_API_KEY =
      "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"; // Replace with your actual API key
    const prompt = this.createPrompt(formData);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate itinerary");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  createPrompt(formData) {
    const duration = this.calculateDuration(
      formData.startDate,
      formData.endDate
    );
    return `Create a detailed ${duration}-day travel itinerary for ${
      formData.destination
    }, India. 
                Budget: ${formData.budget}
                Traveling with: ${formData.travelingWith}
                Adventure level: ${formData.adventureLevel.join(", ")}
                
                Please include:
                - Day-by-day schedule
                - Recommended activities and attractions
                - Local food recommendations
                - Transportation tips
                - Estimated costs
                - Safety tips
                - Hidden gems and local secrets
                
                Format the response in markdown with clear headings and bullet points.`;
  }

  calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  displayItinerary(response) {
    // Convert markdown to HTML and display
    this.itineraryContent.innerHTML = marked.parse(response);
    document.getElementById("downloadPlan").style.display = "block";
  }

  displayError(message) {
    this.itineraryContent.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
  }
}

// Initialize the travel planner
new TravelPlanner();

function downloadTravelPlan(content) {
  // Create a blob with the content
  const blob = new Blob([content], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);

  // Create a temporary link and trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = "PlanIt-Travel-Plan.txt";
  document.body.appendChild(a);
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Add this where you handle the AI response
document.getElementById("downloadPlan").addEventListener("click", function () {
  const content = document.getElementById("itineraryContent").innerText;
  downloadTravelPlan(content);
});
