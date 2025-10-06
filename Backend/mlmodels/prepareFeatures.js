// mlmodels/prepareFeatures.js

/**
 * Convert user input to 28-length numeric feature array
 * Adjust the mapping according to your encoding used in training
 */
function prepareFeatures({
  degree,
  major,
  cgpa,
  employed,
  experience,
  certifications,
  industryPreference,
  skills = []
}) {
  // Example encoding: adjust to match how your model was trained
  const featureArray = [];

  // Degree mapping
  const degreeMap = { "B Tech": 1, "M Tech": 2, "BSc": 3, "MSc": 4 };
  featureArray.push(degreeMap[degree] || 0);

  // Major mapping
  const majorMap = {
    "Computer Science": 1,
    "Electronics": 2,
    "Mechanical": 3,
    "Finance": 4,
    "Business": 5
  };
  featureArray.push(majorMap[major] || 0);

  // CGPA
  featureArray.push(parseFloat(cgpa) || 0);

  // Employed
  featureArray.push(employed ? 1 : 0);

  // Experience
  featureArray.push(parseFloat(experience) || 0);

  // Certifications
  featureArray.push(certifications ? 1 : 0);

  // Industry Preference
  const industryMap = { "IT": 1, "Finance": 2, "Manufacturing": 3, "Other": 4 };
  featureArray.push(industryMap[industryPreference] || 0);

  // Skills one-hot encoding (28 total features)
  const skillList = [
    "Accounting","AutoCAD","C","C++","Circuit Design","Data Analysis",
    "Econometrics","Embedded Systems","Excel","Financial Modeling",
    "Java","MATLAB","Machine Learning","Python","R","Risk Analysis",
    "SQL","SolidWorks","Statistics","Thermodynamics","VHDL"
  ];

  skillList.forEach(skill => {
    featureArray.push(skills.includes(skill) ? 1 : 0);
  });

  // Ensure length is 28
  return featureArray.slice(0,28);
}

module.exports = prepareFeatures;
