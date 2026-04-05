let transactions: any[] = [];

export const getTransactions = () => transactions;

export const addTransaction = (t: any) => {
  transactions = [t, ...transactions];
};

export const deleteTransaction = (id: number) => {
  transactions = transactions.filter((t) => t.id !== id);
};