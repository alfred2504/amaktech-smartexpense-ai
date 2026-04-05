import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../data/transactions";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const handleAdd = (t: any) => {
    addTransaction(t);
    setTransactions(getTransactions());
  };

  const handleDelete = (id: number) => {
    deleteTransaction(id);
    setTransactions(getTransactions());
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <TransactionForm onAdd={handleAdd} />
        <TransactionList transactions={transactions} onDelete={handleDelete} />
      </div>
    </div>
  );
}