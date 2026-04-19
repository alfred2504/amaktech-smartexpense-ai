type SiteFooterProps = {
  className?: string;
};

export default function SiteFooter({ className = "" }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={`text-center text-sm text-slate-500 ${className}`.trim()}>
      © {year} SmartExpense AI | Built by AmakTech
    </footer>
  );
}