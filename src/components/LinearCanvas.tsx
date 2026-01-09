"use client";

import { useEffect, useRef } from "react";

type LinearCanvasProps = {
  vectors: number[][]; // [A, B]
  resultVector?: number[];
  linCombo?: boolean;
  normalizeA?: boolean;
  normalizeB?: boolean;
  projAontoB?: boolean;
  projBontoA?: boolean;
  decomposeA?: boolean;
  decomposeB?: boolean;
};

export default function LinearCanvas({
  vectors,
  resultVector,
  linCombo,
  normalizeA,
  normalizeB,
  projAontoB,
  projBontoA,
  decomposeA,
  decomposeB,
}: LinearCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 50;

    // Choose axis color based on background brightness
    const bgColor = getComputedStyle(document.body).backgroundColor;
    let axisColor = "#999"; // default light gray
    if (bgColor) {
      // simple luminance check
      const rgb = bgColor.match(/\d+/g)?.map(Number) || [255, 255, 255];
      const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
      axisColor = lum < 128 ? "#fff" : "#000"; // white on dark bg, black on light bg
    }

    ctx.strokeStyle = axisColor;
    ctx.fillStyle = axisColor;
    ctx.lineWidth = 1;

    // Draw grid
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    const drawAxis = () => {
      ctx.strokeStyle = axisColor;
      ctx.fillStyle = axisColor;
      ctx.lineWidth = 2;

      // X-axis
      drawArrow(0, centerY, width, centerY);
      ctx.font = "16px sans-serif";
      ctx.fillText("x", width - 15, centerY - 10);

      // Y-axis
      drawArrow(centerX, height, centerX, 0);
      ctx.fillText("y", centerX + 10, 15);
    };

    const drawArrow = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const headLen = 10;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
      ctx.lineTo(x2, y2);
      ctx.fill();
    };

    drawAxis();

    // Draw vectors
    const drawVector = (v: number[], color: string, label?: string) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      const x = centerX + v[0] * scale;
      const y = centerY - v[1] * scale;

      // vector line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // arrowhead
      const angle = Math.atan2(y - centerY, x - centerX);
      const headLen = 10;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - headLen * Math.cos(angle - Math.PI / 6), y - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x - headLen * Math.cos(angle + Math.PI / 6), y - headLen * Math.sin(angle + Math.PI / 6));
      ctx.lineTo(x, y);
      ctx.fill();

      // label
      if (label) {
        ctx.fillStyle = color;
        ctx.font = "16px sans-serif";
        ctx.fillText(label, x + 5, y - 5);
      }
    };

    drawVector(vectors[0], "red", "A");
    drawVector(vectors[1], "blue", "B");

    if (normalizeA) drawVector(normalize(vectors[0]), "orange", "Â");
    if (normalizeB) drawVector(normalize(vectors[1]), "cyan", "B̂");
    if (linCombo && resultVector) drawVector(resultVector, "green", "Result");
    if (projAontoB) drawVector(project(vectors[0], vectors[1]), "purple", "proj A→B");
    if (projBontoA) drawVector(project(vectors[1], vectors[0]), "brown", "proj B→A");
    if (decomposeA) {
      const [proj, perp] = decompose(vectors[0], vectors[1]);
      drawVector(proj, "purple", "proj A→B");
      drawVector(perp, "red", "A⊥");
    }
    if (decomposeB) {
      const [proj, perp] = decompose(vectors[1], vectors[0]);
      drawVector(proj, "brown", "proj B→A");
      drawVector(perp, "blue", "B⊥");
    }

    function normalize(v: number[]) {
      const mag = Math.hypot(...v);
      return mag === 0 ? [0, 0] : v.map((x) => x / mag);
    }

    function project(a: number[], b: number[]) {
      const magB2 = b.reduce((s, x) => s + x * x, 0);
      if (magB2 === 0) return [0, 0];
      const dot = a.reduce((s, x, i) => s + x * b[i], 0);
      return b.map((x) => (dot / magB2) * x);
    }

    function decompose(a: number[], b: number[]) {
      const projVec = project(a, b);
      const perp = a.map((x, i) => x - projVec[i]);
      return [projVec, perp];
    }
  }, [vectors, resultVector, linCombo, normalizeA, normalizeB, projAontoB, projBontoA, decomposeA, decomposeB]);

  return <canvas ref={canvasRef} width={700} height={700} className="border" />;
}
