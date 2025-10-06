// predict.js - Predict Component Script with searchable multi-select dropdown (final skill list)

window.loadPredict = function () {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="predict-card"> 
      <h2>🎓 Job Role Prediction</h2>
      <form id="predictionForm" class="form-grid">
        
        <label>Degree</label>
        <select id="degree" required>
          <option value="">-- Select Degree --</option>
          <option value="M.Sc">M.Sc</option>
          <option value="B.Sc">B.Sc</option>
          <option value="MBA">MBA</option>
          <option value="B.Tech">B.Tech</option>
          <option value="M.Tech">M.Tech</option>
        </select>

        <label>Major</label>
        <select id="major" required>
          <option value="">-- Select Major --</option>
          <option value="Finance">Finance</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Electrical">Electrical</option>
          <option value="Economics">Economics</option>
          <option value="Computer Science">Computer Science</option>
        </select>

        <label>CGPA</label>
        <input type="number" id="cgpa" placeholder="8.5" step="0.01" required>

        <label>Employed</label>
        <select id="employed" required>
          <option value="">-- Select --</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <label>Experience (years)</label>
        <input type="number" id="experience" placeholder="1" min="0" required>

        <label>Certifications</label>
        <select id="certifications" required>
          <option value="">-- Select Certification --</option>
          <option value="Data Science Certificate">Data Science Certificate</option>
          <option value="PMP">PMP</option>
          <option value="AWS Certified">AWS Certified</option>
          <option value="Six Sigma">Six Sigma</option>
          <option value="No Certification">No Certification</option>
        </select>

        <label>Industry Preference</label>
        <select id="industryPreference" required>
          <option value="">-- Select Industry --</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Education">Education</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
          <option value="Research">Research</option>
        </select>

        <label>Skills</label>
        <div class="custom-multiselect" id="skillsDropdown">
          <div class="select-box" id="selectBox">Select skills...</div>
          <div class="dropdown" id="dropdown">
            <input type="text" id="searchSkill" placeholder="Search skills...">
            <div class="options" id="options"></div>
          </div>
        </div>

        <button type="submit" class="btn">🚀 Predict Job Role</button>
      </form>

      <div id="predictionResult" class="result-box" style="display:none;"></div>
    </div>
  `;

  // ✅ Final skill list you provided
  const skillOptions = [
    "Accounting", "AutoCAD", "C", "C++", "Circuit Design",
    "Data Analysis", "Econometrics", "Embedded Systems",
    "Excel", "Financial Modeling", "Java", "MATLAB",
    "Machine Learning", "Python", "R", "Risk Analysis",
    "SQL", "SolidWorks", "Statistics", "Thermodynamics", "VHDL"
  ];

  let selectedSkills = [];

  const selectBox = document.getElementById("selectBox");
  const dropdown = document.getElementById("dropdown");
  const optionsDiv = document.getElementById("options");
  const searchInput = document.getElementById("searchSkill");

  // Render dropdown options
  function renderOptions(filter = "") {
    optionsDiv.innerHTML = "";
    skillOptions
      .filter(skill => skill.toLowerCase().includes(filter.toLowerCase()))
      .forEach(skill => {
        const option = document.createElement("div");
        option.className = "option";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = skill;
        checkbox.checked = selectedSkills.includes(skill);

        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            if (!selectedSkills.includes(skill)) selectedSkills.push(skill);
          } else {
            selectedSkills = selectedSkills.filter(s => s !== skill);
          }
          updateSelectBox();
        });

        const label = document.createElement("label");
        label.textContent = skill;

        option.appendChild(checkbox);
        option.appendChild(label);
        optionsDiv.appendChild(option);
      });
  }

  function updateSelectBox() {
    selectBox.textContent = selectedSkills.length > 0
      ? selectedSkills.join(", ")
      : "Select skills...";
  }

  // Toggle dropdown
  selectBox.addEventListener("click", () => {
    dropdown.classList.toggle("show");
    searchInput.value = "";
    renderOptions();
  });

  // Search filter
  searchInput.addEventListener("input", () => {
    renderOptions(searchInput.value);
  });

  // Click outside to close
  document.addEventListener("click", (e) => {
    if (!document.getElementById("skillsDropdown").contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });

  renderOptions();

  // Form submit
  document.getElementById("predictionForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const payload = {
      degree: document.getElementById("degree").value,
      major: document.getElementById("major").value,
      cgpa: parseFloat(document.getElementById("cgpa").value),
      employed: document.getElementById("employed").value,
      experience: parseInt(document.getElementById("experience").value),
      certifications: document.getElementById("certifications").value,
      industryPreference: document.getElementById("industryPreference").value,
      skills: selectedSkills
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
         },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      const prediction = data.prediction || "Unknown";

      const resultBox = document.getElementById("predictionResult");
      resultBox.style.display = "block";
      resultBox.innerHTML = `
        ✅ Predicted Job Role: <b>${prediction}</b><br>
        <button class="btn another-btn" onclick="loadPredict()">🔄 Make Another Prediction</button>
      `;
    } catch (err) {
      const resultBox = document.getElementById("predictionResult");
      resultBox.style.display = "block";
      resultBox.innerHTML = "❌ Error predicting job role.";
    }
  });
};
