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

const normalizeVector = (v: number[]) => {
  const mag = Math.hypot(...v);
  return mag === 0 ? [0, 0] : v.map((x) => x / mag);
};

const project = (a: number[], b: number[]) => {
  const magB2 = b.reduce((s, x) => s + x * x, 0);
  if (magB2 === 0) return [0, 0];
  const dot = a.reduce((s, x, i) => s + x * b[i], 0);
  return b.map((x) => (dot / magB2) * x);
};

const decompose = (a: number[], b: number[]) => {
  const proj = project(a, b);
  const perp = a.map((x, i) => x - proj[i]);
  return [proj, perp];
};

export default function LinearPage() {
  const [vectors, setVectors] = useState<number[][]>([
    [1, 0],
    [0, 1],
  ]);
  const labels = ["Vector A", "Vector B"];

  const [formula, setFormula] = useState("A + B");
  const [resultVector, setResultVector] = useState<number[] | null>(null);

  // Canvas toggles
  const [linCombo, setLinCombo] = useState(true); // now a checkbox
  const [normalizeA, setNormalizeA] = useState(false);
  const [normalizeB, setNormalizeB] = useState(false);
  const [projAontoB, setProjAontoB] = useState(false);
  const [projBontoA, setProjBontoA] = useState(false);
  const [decomposeA, setDecomposeA] = useState(false);
  const [decomposeB, setDecomposeB] = useState(false);

  useEffect(() => {
    const res = evaluateVectorExpression(formula, { A: vectors[0], B: vectors[1] });
    setResultVector(res);
  }, [formula, vectors]);

  const magnitude = resultVector && Math.hypot(resultVector[0], resultVector[1]);
  const direction = resultVector && (Math.atan2(resultVector[1], resultVector[0]) * 180) / Math.PI;

  return (
    <main className="flex flex-col min-h-screen">
      <header className="p-4 border-b text-center">
        <h1 className="text-5xl font-bold">2D Linear Algebra Visualiser</h1>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-100 p-4 border-r flex flex-col gap-4 items-center">
          <h2 className="text-3xl font-semibold">Vectors</h2>
          <MatrixInput vectors={vectors} labels={labels} onVectorsChange={setVectors} />

          {/* Formula input + linear combination checkbox */}
          <div className="w-full mt-4 flex flex-col gap-2 items-center">
            <label className="text-xl font-medium text-center">
              Input vector expression
            </label>
            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="Addition or Subtraction"
              className="border rounded p-1 text-center"
            />
            <label className="flex items-center gap-2 text-sm mt-1">
              <input
                type="checkbox"
                checked={linCombo}
                onChange={(e) => setLinCombo(e.target.checked)}
                className="w-4 h-4"
              />
              Show Linear Combination (Result)
            </label>
            {resultVector && (
              <div className="text-sm text-center mt-2 space-y-1">
                <div className="font-medium">
                  Result = ({resultVector[0].toFixed(2)}, {resultVector[1].toFixed(2)})
                </div>
                <div>Magnitude: {magnitude!.toFixed(3)}</div>
                <div>Direction: {direction!.toFixed(2)}°T</div>
              </div>
            )}
          </div>

          {/* Other canvas feature toggles */}
          <div className="mt-4 w-full flex flex-col gap-2">
            <label className="text-center font-medium">More Vector Operations (click to toggle)</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Normalize A", state: normalizeA, setter: setNormalizeA, vector: () => normalizeVector(vectors[0]) },
                { label: "Normalize B", state: normalizeB, setter: setNormalizeB, vector: () => normalizeVector(vectors[1]) },
                { label: "Project A → B", state: projAontoB, setter: setProjAontoB, vector: () => project(vectors[0], vectors[1]) },
                { label: "Project B → A", state: projBontoA, setter: setProjBontoA, vector: () => project(vectors[1], vectors[0]) },
                { label: "Decompose A", state: decomposeA, setter: setDecomposeA, vector: () => decompose(vectors[0], vectors[1])[0] },
                { label: "Decompose B", state: decomposeB, setter: setDecomposeB, vector: () => decompose(vectors[1], vectors[0])[0] },
              ].map((item) => {
                const vec = item.vector();
                const display = `(${vec[0].toFixed(2)}, ${vec[1].toFixed(2)})`;
                return (
                <button
                    key={item.label}
                    onClick={() => item.setter(!item.state)}
                    className={`
                    flex flex-col items-center justify-center p-2 border rounded text-sm transition-colors duration-200
                    ${item.state
                        ? "bg-gray-300 dark:bg-gray-700 border-gray-500"
                        : "bg-white dark:bg-gray-800 border-gray-400"}
                    hover:bg-gray-200 dark:hover:bg-gray-600
                    focus:outline-none
                    `}
                >
                    <span className="text-gray-900 dark:text-gray-100">{item.label}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">{display}</span>
                </button>
                );
              })}
            </div>
          </div>

            {/* Footer link at the bottom, inside sidebar */}
            <div className="mt-auto text-center">
                <a
                href="https://some531.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                >
                Who made this?
                </a>
            </div>
        </aside>

        {/* Canvas */}
        <section className="flex-1 flex items-center justify-center">
          <LinearCanvas
            vectors={vectors}
            resultVector={resultVector ?? undefined}
            linCombo={linCombo}
            normalizeA={normalizeA}
            normalizeB={normalizeB}
            projAontoB={projAontoB}
            projBontoA={projBontoA}
            decomposeA={decomposeA}
            decomposeB={decomposeB}
          />
        </section>

      </div>
    </main>
  );
}
