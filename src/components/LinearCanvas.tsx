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

    // Draw grid
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 3;
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

    // Draw axes with arrows
    const drawAxis = (fromX: number, fromY: number, toX: number, toY: number, label: string) => {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      // arrowhead
      const angle = Math.atan2(toY - fromY, toX - fromX);
      const headLen = 10;
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
      ctx.lineTo(toX, toY);
      ctx.fillStyle = "black";
      ctx.fill();

      // label
      ctx.fillStyle = "black";
      ctx.font = "14px sans-serif";
      ctx.fillText(label, toX + 5, toY - 5);
    };

    drawAxis(centerX, centerY, centerX + width / 2, centerY, "x");
        const drawArrow = (x1: number, y1: number, x2: number, y2: number) => {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          const headLength = 10;
          const angle = Math.atan2(y2 - y1, x2 - x1);
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(
            x2 - headLength * Math.cos(angle - Math.PI / 6),
            y2 - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            x2 - headLength * Math.cos(angle + Math.PI / 6),
            y2 - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.lineTo(x2, y2);
          ctx.fillStyle = "#000";
          ctx.fill();
        };

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        drawArrow(0, centerY, canvas.width, centerY); // X-axis
        drawArrow(centerX, canvas.height, centerX, 0); // Y-axis

    // Draw a vector arrow
    const drawVector = (v: number[], color: string, label?: string) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      const x = centerX + v[0] * scale;
      const y = centerY - v[1] * scale;
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

    // Draw original vectors
    drawVector(vectors[0], "red", "A");
    drawVector(vectors[1], "blue", "B");

    // Optional features
    if (normalizeA) {
      const mag = Math.hypot(vectors[0][0], vectors[0][1]);
      if (mag !== 0) drawVector([vectors[0][0] / mag, vectors[0][1] / mag], "orange", "Â");
    }

    if (normalizeB) {
      const mag = Math.hypot(vectors[1][0], vectors[1][1]);
      if (mag !== 0) drawVector([vectors[1][0] / mag, vectors[1][1] / mag], "cyan", "B̂");
    }

    if (linCombo && resultVector) drawVector(resultVector, "green", "Result");

    if (projAontoB) {
      const dot = vectors[0][0] * vectors[1][0] + vectors[0][1] * vectors[1][1];
      const magB2 = vectors[1][0] ** 2 + vectors[1][1] ** 2;
      if (magB2 !== 0) {
        const proj = [(dot / magB2) * vectors[1][0], (dot / magB2) * vectors[1][1]];
        drawVector(proj, "purple", "proj A→B");
      }
    }

    if (projBontoA) {
      const dot = vectors[0][0] * vectors[1][0] + vectors[0][1] * vectors[1][1];
      const magA2 = vectors[0][0] ** 2 + vectors[0][1] ** 2;
      if (magA2 !== 0) {
        const proj = [(dot / magA2) * vectors[0][0], (dot / magA2) * vectors[0][1]];
        drawVector(proj, "brown", "proj B→A");
      }
    }

    if (decomposeA) {
      // decomposition: A = projAontoB + perp
      const dot = vectors[0][0] * vectors[1][0] + vectors[0][1] * vectors[1][1];
      const magB2 = vectors[1][0] ** 2 + vectors[1][1] ** 2;
      if (magB2 !== 0) {
        const proj = [(dot / magB2) * vectors[1][0], (dot / magB2) * vectors[1][1]];
        const perp = [vectors[0][0] - proj[0], vectors[0][1] - proj[1]];
        drawVector(proj, "purple", "proj A→B");
        drawVector(perp, "red", "A⊥");
      }
    }

    if (decomposeB) {
      const dot = vectors[0][0] * vectors[1][0] + vectors[0][1] * vectors[1][1];
      const magA2 = vectors[0][0] ** 2 + vectors[0][1] ** 2;
      if (magA2 !== 0) {
        const proj = [(dot / magA2) * vectors[0][0], (dot / magA2) * vectors[0][1]];
        const perp = [vectors[1][0] - proj[0], vectors[1][1] - proj[1]];
        drawVector(proj, "brown", "proj B→A");
        drawVector(perp, "blue", "B⊥");
      }
    }
  }, [
    vectors,
    resultVector,
    linCombo,
    normalizeA,
    normalizeB,
    projAontoB,
    projBontoA,
    decomposeA,
    decomposeB,
  ]);

  return <canvas ref={canvasRef} width={700} height={700} className="border" />;
}
