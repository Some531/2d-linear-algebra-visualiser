"use client";

import { useState, useEffect } from "react";
import MatrixInput from "@/components/MatrixInput";
import LinearCanvas from "@/components/LinearCanvas";

function evaluateVectorExpression(
  expr: string,
  vectorMap: { [key: string]: number[] }
): number[] | null {
  expr = expr.replace(/\s+/g, "");
  const match = expr.match(/^([AB])([+-])([AB])$/i);
  if (!match) return null;

  const v1 = vectorMap[match[1].toUpperCase()];
  const v2 = vectorMap[match[3].toUpperCase()];
  if (!v1 || !v2) return null;

  return match[2] === "+"
    ? [v1[0] + v2[0], v1[1] + v2[1]]
    : [v1[0] - v2[0], v1[1] - v2[1]];
}

export default function LinearPage() {
  const [vectors, setVectors] = useState<number[][]>([
    [1, 0], // Vector A
    [0, 1], // Vector B
  ]);
  const labels = ["Vector A", "Vector B"];

  const [formula, setFormula] = useState("A + B");
  const [resultVector, setResultVector] = useState<number[] | null>(null);

  // Update result vector whenever formula or vectors change
  useEffect(() => {
    const res = evaluateVectorExpression(formula, {
      A: vectors[0],
      B: vectors[1],
    });
    setResultVector(res);
  }, [formula, vectors]);

  const magnitude =
    resultVector && Math.hypot(resultVector[0], resultVector[1]);
  const direction =
    resultVector &&
    (Math.atan2(resultVector[1], resultVector[0]) * 180) / Math.PI;

  return (
    <main className="flex flex-col min-h-screen">
      <header className="p-4 border-b text-center">
        <h1 className="text-2xl font-bold">2D Linear Algebra Visualiser</h1>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-120 p-30 border-r flex flex-col gap-10 items-center">
          <h2 className="text-2xl font-semibold">Vectors</h2>

          <MatrixInput
            vectors={vectors}
            labels={labels}
            onVectorsChange={setVectors}
          />

          <div className="w-full mt-4 flex flex-col gap-2">
            <label className="text-sm font-medium text-center">
              Input vector expression
            </label>

            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="Addition or Subtraction"
              className="border rounded p-1 text-center"
            />

            {resultVector && (
              <div className="text-sm text-center mt-2 space-y-1">
                <div className="font-medium">
                  Result = ({resultVector[0].toFixed(2)},{" "}
                  {resultVector[1].toFixed(2)})
                </div>
                <div>Magnitude: {magnitude!.toFixed(3)}</div>
                <div>Direction: {direction!.toFixed(2)}°</div>
              </div>
            )}
          </div>
        </aside>

        {/* Canvas */}
        <section className="flex-1 flex items-center justify-center">
          <LinearCanvas vectors={vectors} resultVector={resultVector ?? undefined} />
        </section>
      </div>
    </main>
  );
}
