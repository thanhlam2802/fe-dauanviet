import { motion as Motion } from 'framer-motion'

function AnimatedCard({ children, onClick }) {
  return (
    <Motion.div
      className="card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {children}
    </Motion.div>
  )
}

export default AnimatedCard