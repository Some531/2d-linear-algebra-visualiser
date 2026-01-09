"use client";

import { useState, useEffect } from "react";

type MatrixInputProps = {
  vectors: number[][];
  labels: string[];
  onVectorsChange: (vectors: number[][]) => void;
};

export default function MatrixInput({
  vectors,
  labels,
  onVectorsChange,
}: MatrixInputProps) {
  // TEXT state only — what user sees
  const [text, setText] = useState<string[][]>(
    vectors.map((v) => v.map((x) => x.toString()))
  );

  // Allow numbers, "-", ".", "-."
  const isValidTyping = (v: string) => /^-?\d*\.?\d*$/.test(v);

  // Convert to number for math
  const toNumber = (v: string) =>
    v === "" || v === "-" || v === "." || v === "-." ? 0 : Number(v);

  const handleChange = (i: number, j: number, value: string) => {
    const nextText = text.map((row) => [...row]);
    const prev = text[i][j];

    // "0" → "-" special
    if (prev === "0" && value === "0-") {
      nextText[i][j] = "-";
    }
    // Replace leading 0 with typed number
    else if (prev === "0" && /^[0-9]$/.test(value.slice(-1))) {
      nextText[i][j] = value.slice(-1);
    }
    // Typing "." after 0 → "0."
    else if (prev === "0" && value === ".") {
      nextText[i][j] = "0.";
    }
    // Valid input: numbers, "-", ".", "-."
    else if (isValidTyping(value)) {
      nextText[i][j] = value === "" ? "0" : value;
    } else {
      return; // invalid → ignore
    }

    setText(nextText);

    // Convert for calculations
    const numericVectors = nextText.map((row) => row.map(toNumber));
    onVectorsChange(numericVectors);
  };

  const getMagnitude = (v: number[]) => Math.hypot(...v).toFixed(3);
  const getDirection = (v: number[]) =>
    ((Math.atan2(v[1], v[0]) * 180) / Math.PI).toFixed(1) + "°";

  return (
    <div className="flex flex-col gap-4 w-full">
      {text.map((vec, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="font-semibold">{labels[i]}</div>

          <div className="flex gap-2">
            {vec.map((val, j) => (
              <input
                key={j}
                type="text"
                value={val}
                onChange={(e) => handleChange(i, j, e.target.value)}
                className="w-16 border rounded p-1 text-center"
                inputMode="decimal"
              />
            ))}
          </div>

          <div className="text-sm text-gray-700">
            Magnitude: {getMagnitude(vec.map(toNumber))}, Direction:{" "}
            {getDirection(vec.map(toNumber))}
          </div>
        </div>
      ))}
    </div>
  );
}
