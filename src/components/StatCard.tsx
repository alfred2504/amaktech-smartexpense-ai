type Props = {
  title: string;
  value: number;
  gradient: string;
};

export default function StatCard({ title, value, gradient }: Props) {
  return (
    <div className={`p-6 rounded-xl text-white shadow ${gradient}`}>
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-2xl font-bold">${value}</h2>
    </div>
  );
}