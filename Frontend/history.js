

async function fetchHistory() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      document.getElementById("historyTable").innerHTML =
        "<p class='text-red'>⚠️ Please login again.</p>";
      return;
    }

    const res = await fetch("http://localhost:5000/api/predictions/history", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!data.success) {
      document.getElementById("historyTable").innerHTML =
        "<p>⚠️ Could not fetch history.</p>";
      return;
    }

    if (data.history.length === 0) {
      document.getElementById("historyTable").innerHTML =
        "<p>No predictions found.</p>";
      return;
    }

    // Build compact table
    let html = `
      <div style="max-height:300px; overflow-y:auto; margin-bottom:16px;">
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="border:1px solid #ddd; padding:6px;">Date</th>
              <th style="border:1px solid #ddd; padding:6px;">Degree</th>
              <th style="border:1px solid #ddd; padding:6px;">Major</th>
              <th style="border:1px solid #ddd; padding:6px;">Skills</th>
              <th style="border:1px solid #ddd; padding:6px;">Prediction</th>
            </tr>
          </thead>
          <tbody>
    `;

    data.history.forEach((item) => {
      html += `
        <tr>
          <td style="border:1px solid #ddd; padding:6px;">
            ${new Date(item.createdAt).toLocaleString()}
          </td>
          <td style="border:1px solid #ddd; padding:6px;">${item.degree}</td>
          <td style="border:1px solid #ddd; padding:6px;">${item.major}</td>
          <td style="border:1px solid #ddd; padding:6px;">
            ${Array.isArray(item.skills) ? item.skills.join(", ") : item.skills}
          </td>
          <td style="border:1px solid #ddd; padding:6px; font-weight:600;">
            ${item.prediction}
          </td>
        </tr>
      `;
    });

    html += `</tbody></table></div>`;

    // Add button below table
    html += `
      <div style="text-align:center; margin-top:10px;">
        <button onclick="goToVisualizations()" 
          style="padding:10px 16px; background:#6366f1; color:white; border:none; border-radius:8px; cursor:pointer; font-size:14px; font-weight:500;">
          📈 View Visualizations
        </button>
      </div>
    `;

    document.getElementById("historyTable").innerHTML = html;
  } catch (err) {
    console.error("History error:", err);
    document.getElementById("historyTable").innerHTML =
      "<p>❌ Error loading history.</p>";
  }
}

function goToVisualizations() {
  // // Replace content dynamically instead of navigating
  // document.getElementById("content").innerHTML = `
  //   <div class="profile-card">
  //     <h2>📊 Prediction Visualizations</h2>
  //     <canvas id="barChart" style="margin-bottom:30px;"></canvas>
  //     <canvas id="pieChart"></canvas>
  //   </div>
  // `;

  // // Call chart loader from visualizations.js
  // loadCharts();
  showVisualizations()
}

