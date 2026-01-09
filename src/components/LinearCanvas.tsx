"use client";

type LinearCanvasProps = {
  vectors: number[][];
  resultVector?: number[];
  dimension?: 2;
};

export default function LinearCanvas({
  vectors,
  resultVector,
  dimension = 2,
}: LinearCanvasProps) {
  if (dimension !== 2) return null; // Only 2D

  return (
    <canvas
      width={700}
      height={700}
      ref={(canvas) => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 50;

        // Draw grid
        ctx.strokeStyle = "#eee";
        ctx.lineWidth = 1;
        for (let x = 0; x <= canvas.width; x += scale) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += scale) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Draw axes with arrows
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

        // Axis labels
        ctx.fillStyle = "#000";
        ctx.font = "16px sans-serif";
        ctx.fillText("X", canvas.width - 20, centerY - 5);
        ctx.fillText("Y", centerX + 5, 20);

        // Draw vectors with arrowheads
        const drawVector = (v: number[], color: string, label: string) => {
          const x1 = centerX;
          const y1 = centerY;
          const x2 = centerX + v[0] * scale;
          const y2 = centerY - v[1] * scale;

          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Arrowhead
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
          ctx.fillStyle = color;
          ctx.fill();

          // Label
          ctx.fillStyle = color;
          ctx.font = "16px sans-serif";
          ctx.fillText(label, x2 + 5, y2 - 5);
        };

        drawVector(vectors[0], "red", "A");
        drawVector(vectors[1], "blue", "B");
        if (resultVector) drawVector(resultVector, "green", "Result");
      }}
    />
  );
}
