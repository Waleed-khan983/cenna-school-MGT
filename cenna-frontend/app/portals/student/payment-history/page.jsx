const payments = [
  { receipt: "RC-901", month: "May", date: "2026-05-05", amount: "Rs. 5,000" },
  { receipt: "RC-850", month: "April", date: "2026-04-05", amount: "Rs. 5,000" },
];

export default function StudentPaymentHistoryPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Payment History</h1>
      <p className="mb-6 text-gray-500">View your previous fee payments.</p>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4">Receipt</th>
              <th className="p-4">Month</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((item) => (
              <tr key={item.receipt} className="border-b">
                <td className="p-4 font-semibold">{item.receipt}</td>
                <td className="p-4">{item.month}</td>
                <td className="p-4">{item.date}</td>
                <td className="p-4 font-bold">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}