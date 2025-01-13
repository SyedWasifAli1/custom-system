"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";

interface ExcelRow {
  [key: string]: string | number | boolean; // Update this as per your Excel data types
}

const MergeExcelFiles: React.FC = () => {
  const [mergedData, setMergedData] = useState<ExcelRow[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const allData: ExcelRow[] = [];

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reader.onload = (event: any) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assume the first sheet is the one we need
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert sheet to JSON
        const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);
        allData.push(...jsonData);

        // Set merged data after all files are processed
        if (allData.length > 0) {
          setMergedData(allData);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const downloadMergedFile = () => {
    const worksheet = XLSX.utils.json_to_sheet(mergedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MergedData");

    // Create and download the Excel file
    XLSX.writeFile(workbook, "merged_data.xlsx");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
  });
  

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Excel Files Merger</h1>
      <Link href="/">
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#105153FF",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
            marginBottom:"20px",
          }}
        >
          Go to data
        </button>
      </Link>
      
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #0070f3",
          padding: "20px",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <p>Drag and drop your Excel files here, or click to select files</p>
      </div>
      {mergedData.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Files merged successfully!</h3>
          <button
            onClick={downloadMergedFile}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Download Merged File
          </button>
        </div>
      )}
    </div>
  );
};

export default MergeExcelFiles;
