export default function TransactionList({ transactions, onDelete }: any) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-bold mb-3">Transactions</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t: any) => (
              <tr key={t.id} className="border-b">
                <td>{t.date}</td>
                <td>{t.category}</td>
                <td>{t.type}</td>
                <td className={t.type === "income" ? "text-green-600" : "text-red-600"}>
                  ${t.amount}
                </td>
                <td>
                  <button
                    onClick={() => onDelete(t.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}