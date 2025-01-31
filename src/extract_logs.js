const fs = require("fs");
const readline = require("readline");
const path = require("path");

if (process.argv.length !== 3) {
  console.error("Usage: node extract_logs.js YYYY-MM-DD");
  process.exit(1);
}

const targetDate = process.argv[2];
const logFilePath = "test_logs.log";
const outputDirectory = "../output";
const outputFilePath = path.join(outputDirectory, `output_${targetDate}.txt`);

// Ensure output directory exists
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

// Create read and write streams
const logStream = fs.createReadStream(logFilePath, { encoding: "utf8" });
const outputStream = fs.createWriteStream(outputFilePath, { encoding: "utf8" });

// Process file line by line
const lineReader = readline.createInterface({ input: logStream });

lineReader.on("line", (line) => {
  if (line.startsWith(targetDate)) {
    outputStream.write(line + "\n");
  }
});

lineReader.on("close", () => {
  console.log(`Logs for ${targetDate} saved in ${outputFilePath}`);
  outputStream.end();
});

// Handle errors gracefully
logStream.on("error", (err) => console.error("Error reading the log file:", err));
outputStream.on("error", (err) => console.error("Error writing output file:", err));
