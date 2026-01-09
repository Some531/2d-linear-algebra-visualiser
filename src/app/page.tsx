import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">EigenLab</h1>
      <p className="text-lg text-gray-700">Interactive Linear Algebra Visualiser</p>
      <Link
        href="/linear"
        className="px-6 py-3 bg-black text-white rounded"
      >
        Open Visualiser
      </Link>
    </main>
  );
}
