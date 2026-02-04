import { motion } from "framer-motion";

type Props = {
  index: number;
  title: string;
  description: string;
};

export const RulesCard = ({ index, title, description }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.4, ease: "easeOut" }}
      className="
        backdrop-blur-md
        bg-blue-700/20
        border border-white/15
        rounded-2xl
        px-6 py-5
        shadow-lg shadow-black/20
        transition
        hover:bg-white/10
      "
    >
      <h3 className="font-bold text-xl text-white mb-2">
        {title}
      </h3>
      <p className="text-white/80 text-md font-semibold leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};
