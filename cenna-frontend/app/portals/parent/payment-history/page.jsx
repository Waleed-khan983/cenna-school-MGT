const payments = [
  { child: "Ahmad Khan", receipt: "RC-901", date: "2026-05-05", amount: "Rs. 5,000" },
  { child: "Fatima Khan", receipt: "RC-902", date: "2026-05-05", amount: "Rs. 4,500" },
];

export default function ParentPaymentHistoryPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Payment History</h1>
      <p className="mb-6 text-gray-500">View paid fee records and receipts.</p>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4">Receipt</th>
              <th className="p-4">Child</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.receipt} className="border-b">
                <td className="p-4 font-semibold">{payment.receipt}</td>
                <td className="p-4">{payment.child}</td>
                <td className="p-4">{payment.date}</td>
                <td className="p-4 font-bold">{payment.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}