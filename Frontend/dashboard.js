function defaultDashboard() {
  document.getElementById("content").innerHTML = `
    <div class="welcome">
      <h2>👋 Welcome Back!</h2>
      <p>Here’s a quick overview of your activity and tools to get started.</p>
    </div>

    <div class="dashboard-grid">
      <!-- Stats Card -->
      <div class="card">
        <h3>📊 Profile Overview</h3>
        <p>Check and update your profile to get accurate predictions.</p>
        <button class="save-btn" onclick="loadProfile()">View Profile</button>
      </div>

      <!-- Quick Prediction -->
      <div class="card">
        <h3>⚡ Quick Prediction</h3>
        <p>Start a new prediction instantly with just one click.</p>
        <button class="save-btn" onclick="newAction()">New Prediction</button>
      </div>

      <!-- History -->
      <div class="card">
        <h3>📜 Recent History</h3>
        <p>View your latest predictions and outcomes.</p>
        <button class="save-btn" onclick="historyAction()">View History</button>
      </div>

      <!-- Tips -->
      <div class="card">
        <h3>💡 Tips</h3>
        <p>Improve predictions by keeping your profile updated regularly.</p>
      </div>
    </div>
  `;
}
