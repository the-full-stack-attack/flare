// import React from 'react';
// import { motion } from 'framer-motion';
// import { FaSun, FaCloud, FaTemperatureHigh } from 'react-icons/fa';

// export const WeatherPlaceholder = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       className="relative group transition-all duration-300 hover:transform hover:scale-[1.02] h-full"
//     >
//       <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
//       <div className="relative h-full rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl p-6 overflow-hidden">
//         {/* Subtle glow effect */}
//         <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
        
//         <div className="relative z-10 h-full flex flex-col justify-between">
//           <div>
//             <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
//               Local Weather
//             </h3>
//             <p className="text-white/70">Partly Cloudy</p>
//             <div className="flex items-center mt-4">
//               <FaTemperatureHigh className="text-orange-500 mr-2 text-xl" />
//               <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
//                 72°F
//               </p>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <motion.div
//               animate={{
//                 y: [0, -5, 0],
//                 rotate: [0, 5, 0]
//               }}
//               transition={{
//                 duration: 4,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//               className="flex items-center justify-center"
//             >
//               <FaSun className="text-5xl text-yellow-500" />
//             </motion.div>

//             <div className="grid grid-cols-3 gap-2">
//               <div className="p-2 rounded-lg bg-white/[0.03]">
//                 <p className="text-orange-500/80 text-xs">High</p>
//                 <p className="text-white/80 font-medium">75°</p>
//               </div>
//               <div className="p-2 rounded-lg bg-white/[0.03]">
//                 <p className="text-orange-500/80 text-xs">Low</p>
//                 <p className="text-white/80 font-medium">65°</p>
//               </div>
//               <div className="p-2 rounded-lg bg-white/[0.03]">
//                 <p className="text-orange-500/80 text-xs">Humidity</p>
//                 <p className="text-white/80 font-medium">45%</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };
