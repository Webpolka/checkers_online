type Props = {
  title: string;
  description: string;
};

export const RulesCard = ({ title, description }: Props) => {
  return (
    <div className="backdrop-blur-md bg-indigo-700/40 border border-white/15 rounded-2xl px-6 py-5 shadow-lg shadow-black/20 transition hover:bg-white/10">
      <h3 className="font-bold text-xl text-white mb-2">
        {title}
      </h3>
      <p className="text-white/80 text-md font-semibold leading-relaxed">
        {description}
      </p>
    </div>
  );
};
