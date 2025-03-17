import { motion } from 'framer-motion'; // ✨ Import Framer Motion
import Frame from './assets/frame.png';

export default function HeroSection() {
  return (
    <section className="pb-[114px] pt-20 md:mt-[100px] custom2">
      <div className="container lg:px-20">
        <div className="grid items-center gap-6 md:grid-cols-2">
          {/* ✅ Animated Image */}
          <motion.div
            className="flex justify-center md:order-2"
            initial={{ opacity: 0, scale: 0.8 }} // 🔄 Fade & Scale In
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.img
              className="max-md:w-full"
              src={Frame}
              width="326"
              height="290"
              alt="frame"
              whileHover={{ scale: 1.05, rotate: 2 }} // 🔄 Hover Effect
              whileTap={{ scale: 0.95 }} // 🔄 Tap Effect
            />
          </motion.div>

          {/* ✅ Animated Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }} // 🔄 Slide Left
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <h1 className="mb-1.5 text-[56px] font-bold leading-none text-[#F5BF42] lg:text-[73px]">
              Tasker
            </h1>
            <p
              className="text-lg my-2 opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Effortlessly Organize, Prioritize, and Conquer Tasks with Tasker -
              Your Personal Productivity Ally for Seamless Goal Achievement and
              Stress-Free Task Management.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
