// ================= MAIN FUNCTION TO SHOW VISUALIZATIONS =================
function showVisualizations() {
  // Replace main content with visualization UI
  document.getElementById("content").innerHTML = `
    <div class="profile-card">
      <h2>📊 Prediction Visualizations</h2>
      <div class="chart-controls">
        <button class="chart-toggle active" data-chart="bar">Bar Chart</button>
        <button class="chart-toggle" data-chart="pie">Pie Chart</button>
        <button class="chart-toggle" data-chart="line">Line Chart</button>
      </div>
      <div class="chart-container">
        <canvas id="barChart" style="margin-bottom:30px;"></canvas>
        <canvas id="pieChart" style="display:none;"></canvas>
        <canvas id="lineChart" style="display:none;"></canvas>
      </div>
      <div class="stats-summary">
        <h3>Prediction Statistics</h3>
        <div id="statsContainer"></div>
      </div>
    </div>
  `;

  // Setup toggle buttons for charts
  document.querySelectorAll(".chart-toggle").forEach(button => {
    button.addEventListener("click", function() {
      document.querySelectorAll(".chart-toggle").forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");

      const chartType = this.getAttribute("data-chart");
      document.getElementById("barChart").style.display = chartType === "bar" ? "block" : "none";
      document.getElementById("pieChart").style.display = chartType === "pie" ? "block" : "none";
      document.getElementById("lineChart").style.display = chartType === "line" ? "block" : "none";
    });
  });

  // Load charts after DOM manipulation
  loadCharts();
}

// ================= LOAD CHARTS FUNCTION =================
async function loadCharts() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  try {
    const statsContainer = document.getElementById("statsContainer");
    if (statsContainer) statsContainer.innerHTML = "<p>Loading data...</p>";

    const res = await fetch("http://localhost:5000/api/predictions/history", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success) {
      alert("Failed to load predictions");
      return;
    }

    const counts = {};
    const dates = {};
    data.history.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    data.history.forEach(item => {
      counts[item.prediction] = (counts[item.prediction] || 0) + 1;
      const date = new Date(item.createdAt).toLocaleDateString();
      if (!dates[date]) dates[date] = {};
      dates[date][item.prediction] = (dates[date][item.prediction] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const values = Object.values(counts);
    const dateLabels = Object.keys(dates);

    const timelineDatasets = labels.map((label, i) => {
      const color = getColor(i);
      return {
        label,
        data: dateLabels.map(date => dates[date][label] || 0),
        borderColor: color,
        backgroundColor: color + "20",
        tension: 0.3,
        fill: true
      };
    });

    if (window.barChartInstance) window.barChartInstance.destroy();
    if (window.pieChartInstance) window.pieChartInstance.destroy();
    if (window.lineChartInstance) window.lineChartInstance.destroy();

    // Bar chart
    const ctxBar = document.getElementById("barChart").getContext("2d");
    window.barChartInstance = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Predictions Count",
          data: values,
          backgroundColor: labels.map((_, i) => getColor(i)),
          borderRadius: 8,
          borderColor: "#fff"
        }]
      }
    });

    // Pie chart
    const ctxPie = document.getElementById("pieChart").getContext("2d");
    window.pieChartInstance = new Chart(ctxPie, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: labels.map((_, i) => getColor(i)),
          borderColor: "#fff",
          borderWidth: 2
        }]
      }
    });

    // Line chart
    const ctxLine = document.getElementById("lineChart").getContext("2d");
    window.lineChartInstance = new Chart(ctxLine, {
      type: "line",
      data: { labels: dateLabels, datasets: timelineDatasets }
    });

    // Update stats
    updateStatistics(data.history, counts);
  } catch (err) {
    console.error("Visualization error:", err);
    const statsContainer = document.getElementById("statsContainer");
    if (statsContainer) statsContainer.innerHTML = "<p class='error'>Error loading data. Please try again.</p>";
  }
}

// ================= HELPERS =================
function getColor(i) {
  const colors = ["#6366f1","#06b6d4","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316","#84cc16"];
  return colors[i % colors.length];
}

function updateStatistics(history, counts) {
  const statsContainer = document.getElementById("statsContainer");
  if (!statsContainer) return;
  const total = history.length;
  const mostCommon = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  const leastCommon = Object.keys(counts).reduce((a, b) => counts[a] < counts[b] ? a : b);

  statsContainer.innerHTML = `
    <div class="stat-item"><span>Total Predictions:</span> <span>${total}</span></div>
    <div class="stat-item"><span>Most Common:</span> <span>${mostCommon} (${counts[mostCommon]})</span></div>
    <div class="stat-item"><span>Least Common:</span> <span>${leastCommon} (${counts[leastCommon]})</span></div>
    <div class="stat-item"><span>Prediction Types:</span> <span>${Object.keys(counts).length}</span></div>
  `;
}
