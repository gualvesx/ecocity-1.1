
interface DataCardProps {
  icon: any;
  title: string;
  description: string;
}

export const DataCard = ({ icon, title, description }: DataCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-eco-green-dark">
      <div className="w-12 h-12 rounded-full bg-eco-green-light/20 flex items-center justify-center text-eco-green-dark mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
