import ExcelDataFetcher from '@/components/fatch/fatch';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Excel Data Fetcher</h1>
      <Link href="/mergeexcelfile">
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#27A388FF",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Go to Merge Excel File
        </button>
      </Link>

      <ExcelDataFetcher />
    </main>
  );
}
