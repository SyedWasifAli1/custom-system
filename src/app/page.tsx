'use client';

import { useState } from 'react';

export default function NumberGenerator() {
  const [baseNumber, setBaseNumber] = useState('+923100000000');
  const [increment, setIncrement] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const totalNumbers = 100;

  const generateNumbers = (start: string | number | bigint | boolean) => {
    return Array.from({ length: totalNumbers }, (_, i) => {
      const num = BigInt(start) + BigInt(increment) * BigInt(i);
      return `+${num.toString()}`;
    });
  };

  const startNumber = BigInt(baseNumber) + BigInt(currentPage) * BigInt(totalNumbers) * BigInt(increment);
  const numbers = generateNumbers(startNumber);

  const copyAll = () => {
    navigator.clipboard.writeText(numbers.join('\n'));
    alert('All numbers copied!');
  };

  return (
    <div className="max-w-md mx-auto p-6 text-center rounded-lg shadow-md bg-gray-100">
      <h2 className="mb-4 text-xl font-semibold">Number Generator</h2>
      <input
        type="text"
        value={baseNumber}
        onChange={(e) => setBaseNumber(e.target.value)}
        placeholder="Base Number"
        className="block w-full mb-3 p-2 rounded border border-gray-300"
      />
      <input
        type="number"
        value={increment}
        onChange={(e) => setIncrement(Number(e.target.value))}
        placeholder="Increment"
        className="block w-full mb-3 p-2 rounded border border-gray-300"
      />
      <div className="mt-3">
        <button 
          disabled={currentPage === 0} 
          onClick={() => setCurrentPage((p) => p - 1)} 
          className="px-4 py-2 mr-2 rounded bg-green-500 text-white disabled:opacity-50">
          Previous 100
        </button>
        <button 
          onClick={() => setCurrentPage((p) => p + 1)} 
          className="px-4 py-2 rounded bg-red-500 text-white">
          Next 100
        </button>
      </div>
      <button 
        onClick={copyAll} 
        className="mt-3 px-4 py-2 rounded bg-blue-500 text-white">
        Copy All
      </button>
      <ul className="mt-3 list-none bg-white rounded p-3 shadow">
        {numbers.map((num, index) => (
          <li key={index} className="py-1 text-lg font-bold">{num}</li>
        ))}
      </ul>
    </div>
  );
}
