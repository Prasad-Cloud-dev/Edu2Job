// profile.js
let currentProfile = null;

// Ensure global access for inline onclick handlers
window.loadProfile = loadProfile;
window.showEditProfile = showEditProfile;
window.updateProfile = updateProfile;

async function loadProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/profile", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      document.getElementById("content").innerHTML = `
        <div class="profile-card fade-in">
          <h2>⚠️ No Profile Found</h2>
          <p class="muted">Please create a profile to get started.</p>
          <button class="save-btn full-width" onclick="showEditProfile()">➕ Create Profile</button>
        </div>
      `;
      currentProfile = null;
      return;
    }

    const data = await res.json();
    currentProfile = data;

    document.getElementById("content").innerHTML = `
      <div class="profile-card fade-in">
        <h2>👤 My Profile</h2>
        <div class="profile-info-grid">
          <div><b>Username:</b> <span>${data.user?.username ?? "N/A"}</span></div>
          <div><b>Email:</b> <span>${data.user?.email ?? "N/A"}</span></div>
          <div><b>Degree:</b> <span>${data.degree ?? "N/A"}</span></div>
          <div><b>University:</b> <span>${data.university ?? "N/A"}</span></div>
          <div><b>CGPA:</b> <span>${data.cgpa ?? "N/A"}</span></div>
          <div><b>Skills:</b> <span>${Array.isArray(data.skills) && data.skills.length ? data.skills.join(", ") : "N/A"}</span></div>
          <div><b>Year of Passing:</b> <span>${data.yearOfPassing ?? "N/A"}</span></div>
          <div><b>Predictions Made:</b> <span>${data.predictionCount ?? 0}</span></div>
        </div>
        <div class="form-actions">
          <button onclick="showEditProfile()" class="save-btn">✏️ Edit Profile</button>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("content").innerHTML = `
      <div class="profile-card fade-in">
        <h2>❌ Error</h2>
        <p class="muted">Unable to load profile. Please try again.</p>
      </div>
    `;
  }
}

function showEditProfile() {
  if (!currentProfile) currentProfile = {};

  document.getElementById("content").innerHTML = `
    <div class="profile-card fade-in">
      <h2>${currentProfile._id ? "✏️ Edit Profile" : "➕ Create Profile"}</h2>
      <form onsubmit="updateProfile(event)" class="profile-form">
        <div class="form-group">
          <label>🎓 Degree</label>
          <input type="text" id="degree" value="${currentProfile.degree ?? ""}">
        </div>
        <div class="form-group">
          <label>🏫 University</label>
          <input type="text" id="university" value="${currentProfile.university ?? ""}">
        </div>
        <div class="form-group">
          <label>📊 CGPA</label>
          <input type="number" step="0.01" id="cgpa" value="${currentProfile.cgpa ?? ""}">
        </div>
        <div class="form-group">
          <label>💡 Skills</label>
          <input type="text" id="skills" value="${Array.isArray(currentProfile.skills) ? currentProfile.skills.join(", ") : ""}" placeholder="e.g. JavaScript, Python, SQL">
        </div>
        <div class="form-group">
          <label>📅 Year of Passing</label>
          <input type="number" id="yearOfPassing" value="${currentProfile.yearOfPassing ?? ""}">
        </div>
        <div class="form-actions">
          <button type="submit" class="save-btn">💾 Save</button>
          <button type="button" onclick="loadProfile()" class="cancel-btn">❌ Cancel</button>
        </div>
      </form>
    </div>
  `;
}

async function updateProfile(e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const payload = {
    degree: document.getElementById("degree").value.trim(),
    university: document.getElementById("university").value.trim(),
    cgpa: document.getElementById("cgpa").value,
    skills: document.getElementById("skills").value
      .split(",")
      .map(s => s.trim())
      .filter(Boolean),
    yearOfPassing: document.getElementById("yearOfPassing").value
  };

  const method = currentProfile && currentProfile._id ? "PUT" : "POST";

  try {
    const res = await fetch("http://localhost:5000/api/profile", {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert(`✅ Profile ${method === "POST" ? "created" : "updated"} successfully!`);
      await loadProfile();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(`❌ Error saving profile${err?.message ? `: ${err.message}` : ""}`);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Network error saving profile");
  }
}
