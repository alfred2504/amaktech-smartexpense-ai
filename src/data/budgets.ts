let budgets: any[] = [];

export const getBudgets = () => budgets;

export const addBudget = (b: any) => {
  const existing = budgets.find((item) => item.category === b.category);

  if (existing) {
    existing.limit = b.limit; // update
  } else {
    budgets.push(b);
  }
};

export const deleteBudget = (category: string) => {
  budgets = budgets.filter((b) => b.category !== category);
};