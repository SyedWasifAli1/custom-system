"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

const ExcelDataFetcher = () => {
  const [data, setData] = useState<string[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleFileRead = async () => {
    setLoading(true); // Set loading to true when file is being read
    try {
      const response = await fetch("/data.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils
        .sheet_to_json(sheet, { header: 1, raw: true, range: 0 }) // Ensuring no limit on rows
        .flat()
        .filter((item): item is string => typeof item === "string"); // Ensures only strings are included

      const formattedData = jsonData
        .map((num) => num.toString().replace(/^0/, "+92"))
        .filter((num) => /^\+92\d+$/.test(num));

      setData(formattedData);
    } catch (error) {
      console.error("Error reading file:", error);
    } finally {
      setLoading(false); // Set loading to false once the file is processed
    }
  };

  const handleNext = () => {
    if (startIndex + 100 < data.length) {
      setStartIndex(startIndex + 100);
    }
  };

  const handleBack = () => {
    if (startIndex - 100 >= 0) {
      setStartIndex(startIndex - 100);
    }
  };

  const handleCopy = () => {
    const numbersToCopy = data.slice(startIndex, startIndex + 100).join("\n");
    navigator.clipboard.writeText(numbersToCopy);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <button
        onClick={handleFileRead}
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Load Data
      </button>
      <button
        onClick={handleCopy}
        style={{
          backgroundColor: "#28A745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "5px 10px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Copy All
      </button>

      {loading && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div className="loader"></div> {/* Add loader */}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Start Index"
          value={startIndex}
          onChange={(e) => setStartIndex(Number(e.target.value) || 0)}
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <button
          onClick={handleBack}
          disabled={startIndex === 0}
          style={{
            backgroundColor: startIndex === 0 ? "#ccc" : "#007BFF",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: startIndex === 0 ? "not-allowed" : "pointer",
          }}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={startIndex + 5 >= data.length}
          style={{
            backgroundColor: startIndex + 5 >= data.length ? "#ccc" : "#007BFF",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: startIndex + 5 >= data.length ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
      
      <ul style={{ listStyle: "none", padding: 0 }}>
        {data.slice(startIndex, startIndex + 100).map((num, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              borderBottom: "1px solid #ccc",
            }}
          >
            <span>{num}</span>
          </li>
        ))}
      </ul>


      
   
    </div>
  );
};

export default ExcelDataFetcher;
