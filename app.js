let carbonChart;
const nationalAvg = 5.5; // Average carbon footprint in tons per week

// Tab functionality
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab");

    // Update active tab button
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Show active tab content
    tabContents.forEach((content) => {
      content.classList.remove("active");
      if (content.id === tabId) {
        content.classList.add("active");
      }
    });
  });
});

// Form submission
document
  .getElementById("carbonForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const milesDriven = parseFloat(document.getElementById("miles").value);
    const electricityUsage = parseFloat(
      document.getElementById("electricity").value
    );
    const meatConsumption = parseFloat(document.getElementById("meat").value);
    const flights = parseFloat(document.getElementById("flights").value);
    const busMiles = parseFloat(document.getElementById("bus").value);
    const trainMiles = parseFloat(document.getElementById("train").value);
    const naturalGas = parseFloat(document.getElementById("naturalGas").value);

    if (
      isNaN(milesDriven) ||
      isNaN(electricityUsage) ||
      isNaN(meatConsumption) ||
      isNaN(flights) ||
      isNaN(busMiles) ||
      isNaN(trainMiles) ||
      isNaN(naturalGas)
    ) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    const carEmissionFactor = 0.411;
    const electricityEmissionFactor = 0.92;
    const meatEmissionFactor = 7;
    const flightEmissionFactor = 0.254;
    const busEmissionFactor = 0.089;
    const trainEmissionFactor = 0.041;
    const naturalGasEmissionFactor = 5.3;

    const carEmissions = milesDriven * carEmissionFactor;
    const electricityEmissions = electricityUsage * electricityEmissionFactor;
    const meatEmissions = meatConsumption * meatEmissionFactor;
    const flightEmissions = flights * flightEmissionFactor;
    const busEmissions = busMiles * busEmissionFactor;
    const trainEmissions = trainMiles * trainEmissionFactor;
    const naturalGasEmissions = naturalGas * naturalGasEmissionFactor;

    const totalFootprint =
      (carEmissions +
        electricityEmissions +
        meatEmissions +
        flightEmissions +
        busEmissions +
        trainEmissions +
        naturalGasEmissions) /
      1000; // Convert to tons

    // Display results
    document.getElementById(
      "FootprintResult"
    ).textContent = `${totalFootprint.toFixed(2)} tons`;

    // Set impact rating
    const rating = document.getElementById("impactRating");
    rating.className = "rating";
    if (totalFootprint > 6) {
      rating.textContent = "High Impact";
      rating.classList.add("danger");
    } else if (totalFootprint > 4) {
      rating.textContent = "Medium Impact";
      rating.classList.add("warning");
    } else {
      rating.textContent = "Low Impact";
    }

    // Comparison text
    const comparison = document.getElementById("comparisonText");
    const diff = Math.abs(totalFootprint - nationalAvg);
    const percentDiff = ((diff / nationalAvg) * 100).toFixed(0);

    if (totalFootprint > nationalAvg) {
      comparison.textContent = `Your footprint is ${percentDiff}% higher than the national average`;
    } else {
      comparison.textContent = `Your footprint is ${percentDiff}% lower than the national average`;
    }

    // Update breakdown
    const breakdown = document.getElementById("Breakdown");
    breakdown.innerHTML = `
                <div class="breakdown-item">
                    <div class="category">
                        <i class="fas fa-car"></i>
                        <span>Transportation</span>
                    </div>
                    <div class="value">${carEmissions.toFixed(2)} kg</div>
                </div>
                <div class="breakdown-item">
                    <div class="category">
                        <i class="fas fa-bolt"></i>
                        <span>Electricity</span>
                    </div>
                    <div class="value">${electricityEmissions.toFixed(
                      2
                    )} kg</div>
                </div>
                <div class="breakdown-item">
                    <div class="category">
                        <i class="fas fa-utensils"></i>
                        <span>Food</span>
                    </div>
                    <div class="value">${meatEmissions.toFixed(2)} kg</div>
                </div>
                <div class="breakdown-item">
                    <div class="category">
                        <i class="fas fa-plane"></i>
                        <span>Flights</span>
                    </div>
                    <div class="value">${flightEmissions.toFixed(2)} kg</div>
                </div>
                <div class="breakdown-item">
                    <div class="category">
                        <i class="fas fa-bus"></i>
                        <span>Bus</span>
                    </div>
                    <div class="value">${busEmissions.toFixed(2)} kg</div>
                </div>
                <div class="breakdown-item">
                    <div class="category">
                        <i class="fas fa-train"></i>
                        <span>Train</span>
                    </div>
                    <div class="value">${trainEmissions.toFixed(2)} kg</div>
                </div>
                <div class="breakdown-item">
                    <div class="category">
                        <i class="fas fa-fire"></i>
                        <span>Natural Gas</span>
                    </div>
                    <div class="value">${naturalGasEmissions.toFixed(
                      2
                    )} kg</div>
                </div>
            `;

    // Generate suggestions
    const suggestions = document.getElementById("Suggestions");
    suggestions.innerHTML = "";

    if (carEmissions > 100) {
      suggestions.innerHTML += `<li>Consider carpooling or using public transportation to reduce your driving emissions</li>`;
    }

    if (electricityEmissions > 200) {
      suggestions.innerHTML += `<li>Switch to energy-efficient appliances and turn off devices when not in use</li>`;
    }

    if (meatEmissions > 30) {
      suggestions.innerHTML += `<li>Reduce meat consumption and incorporate more plant-based meals</li>`;
    }

    if (flightEmissions > 100) {
      suggestions.innerHTML += `<li>Consider video conferencing instead of flying when possible</li>`;
    }

    if (suggestions.innerHTML === "") {
      suggestions.innerHTML = `<li>Great job! Your carbon footprint is well managed. Keep up the good work!</li>`;
    }

    // Show results
    document.querySelector(".results").style.display = "block";

    // Save to history
    let history = JSON.parse(localStorage.getItem("carbonHistory")) || [];
    history.push({
      date: new Date().toLocaleDateString(),
      footprint: totalFootprint.toFixed(2),
    });
    localStorage.setItem("carbonHistory", JSON.stringify(history));

    displayHistory();
    updateChart();

    // Scroll to results
    document.getElementById("results").scrollIntoView({ behavior: "smooth" });
  });

function displayHistory() {
  let history = JSON.parse(localStorage.getItem("carbonHistory")) || [];
  const historyList = document.getElementById("historyList");

  if (history.length === 0) {
    historyList.innerHTML =
      "<p>No history available. Calculate your footprint to see history here.</p>";
    return;
  }

  historyList.innerHTML = "";

  history.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "history-item";

    let ratingClass = "";
    let ratingText = "";
    const footprint = parseFloat(entry.footprint);

    if (footprint > 6) {
      ratingClass = "danger";
      ratingText = "High";
    } else if (footprint > 4) {
      ratingClass = "warning";
      ratingText = "Medium";
    } else {
      ratingClass = "";
      ratingText = "Low";
    }

    item.innerHTML = `
                    <div class="info">
                        <div class="date">${entry.date}</div>
                        <div class="footprint">${entry.footprint} tons CO2</div>
                    </div>
                    <div class="rating ${ratingClass}">${ratingText}</div>
                `;

    historyList.appendChild(item);
  });
}

function updateChart() {
  let history = JSON.parse(localStorage.getItem("carbonHistory")) || [];
  const trendText = document.getElementById("trendText");

  if (history.length === 0) {
    trendText.textContent =
      "Calculate your footprint multiple times to see trends here.";
    return;
  }

  const labels = history.map((entry) => entry.date);
  const data = history.map((entry) => parseFloat(entry.footprint));

  const ctx = document.getElementById("carbonChart").getContext("2d");

  if (carbonChart) {
    carbonChart.destroy();
  }

  carbonChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Carbon Footprint (tons CO2)",
          data: data,
          borderColor: "#00c853",
          backgroundColor: "rgba(0, 200, 83, 0.1)",
          borderWidth: 3,
          pointBackgroundColor: "#00c853",
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleFont: {
            size: 14,
          },
          bodyFont: {
            size: 13,
          },
          padding: 12,
          cornerRadius: 10,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "Tons CO2",
            font: {
              size: 14,
              weight: "bold",
            },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            font: {
              size: 12,
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "Date",
            font: {
              size: 14,
              weight: "bold",
            },
          },
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
            },
          },
        },
      },
    },
  });

  // Calculate trend
  if (history.length > 1) {
    const first = parseFloat(history[0].footprint);
    const last = parseFloat(history[history.length - 1].footprint);
    const diff = last - first;
    const percent = Math.abs((diff / first) * 100).toFixed(0);

    if (diff < 0) {
      trendText.textContent = `Great news! Your carbon footprint has decreased by ${percent}% since you started tracking.`;
    } else {
      trendText.textContent = `Your carbon footprint has increased by ${percent}% since you started tracking. Consider implementing some reduction strategies.`;
    }
  } else {
    trendText.textContent =
      "Track your footprint multiple times to see your progress over time.";
  }
}

document.getElementById("clearHistory").addEventListener("click", function () {
  if (
    confirm(
      "Are you sure you want to clear your history? This cannot be undone."
    )
  ) {
    localStorage.removeItem("carbonHistory");
    displayHistory();
    updateChart();
  }
});

// Function to download CSV
document.getElementById("downloadCSV").addEventListener("click", function () {
  let history = JSON.parse(localStorage.getItem("carbonHistory")) || [];

  if (history.length === 0) {
    alert("No data available to download.");
    return;
  }

  let csvContent = "Date,Carbon Footprint (kg CO2)\n";
  history.forEach((entry) => {
    csvContent += `${entry.date},${entry.footprint}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "carbon_footprint.csv";
  link.click();
});

// Function to download PDF
document.getElementById("downloadPDF").addEventListener("click", function () {
  let history = JSON.parse(localStorage.getItem("carbonHistory")) || [];

  if (history.length === 0) {
    alert("No data available to download.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Carbon Footprint Report", 20, 20);

  doc.setFontSize(12);
  history.forEach((entry, index) => {
    doc.text(
      `${index + 1}. ${entry.date} - ${entry.footprint} kg CO2`,
      20,
      40 + index * 10
    );
  });

  // Convert chart to image and add it to PDF
  const canvas = document.getElementById("carbonChart");
  const imgData = canvas.toDataURL("image/png");

  doc.addImage(imgData, "PNG", 20, 60, 160, 90);

  doc.save("carbon_footprint_report.pdf");
});

const darkModeToggle = document.getElementById("darkModeToggle");

// Check local storage for dark mode preference
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
  }
});

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  displayHistory();
  updateChart();
});
