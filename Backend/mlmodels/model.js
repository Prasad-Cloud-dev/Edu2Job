const path = require("path");
const ort = require("onnxruntime-node");

// Map class indices to actual job role names (replace with your model's classes)
const JOB_ROLES = [
  "Financial Analyst",
  "Design Engineer",
  "Electronics Engineer",
  "Backend Developer",
  "Accountant",
  "Economist",
  "Investment Banker",
  "Data Analyst",
  "Electrical Engineer",
  "Software Engineer",
  "Manufacturing Engineer",
  "Mechanical Engineer"
];

async function runModel(inputArray) {
  try {
    const modelPath = path.join(__dirname, "rf_model_numeric.onnx");
    const session = await ort.InferenceSession.create(modelPath);

    const tensor = new ort.Tensor(
      "float32",
      Float32Array.from(inputArray),
      [1, inputArray.length]
    );

    const results = await session.run({ float_input: tensor });

    console.log("Available outputs:", Object.keys(results));

    // Use the probabilities tensor output
    let predictionIndex;
    if (results.probabilities) {
      const probs = results.probabilities.data;
      predictionIndex = probs.indexOf(Math.max(...probs));
      console.log("Probabilities:", probs);
      console.log("Predicted class index:", predictionIndex);
    } else {
      throw new Error("Model does not output a probabilities tensor.");
    }

    // Map index to actual job role
    const prediction = JOB_ROLES[predictionIndex];
    console.log("Predicted job role:", prediction);
    return prediction;

  } catch (err) {
    console.error("Error running model:", err);
  }
}

module.exports = runModel;
