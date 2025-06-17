import { useEffect, useState } from 'react';
import { LayoutDashboard } from 'lucide-react';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/transactions')
      .then((res) => res.json())
      .then(setTransactions)
      .catch(() => setTransactions([]));
  }, []);

  const total = transactions.reduce((sum, t) => sum + (parseFloat(t.Amount) || 0), 0);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6" />
        Dashboard
      </h1>
      <div className="mb-4">
        <span className="font-semibold">Total:</span>{' '}
        {total.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Description</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2">{t.Date}</td>
                <td className="p-2">{t.Description}</td>
                <td className="p-2 text-right">
                  {parseFloat(t.Amount).toLocaleString(undefined, {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
