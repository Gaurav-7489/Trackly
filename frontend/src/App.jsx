import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import Intro from "./pages/Intro";

/**
 * Animated wrapper for each page
 */
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }} // Starts slightly lower and invisible
    animate={{ opacity: 1, y: 0 }}   // Slides up and fades in
    exit={{ opacity: 0, y: -10 }}    // Slides up further and fades out
    transition={{ duration: 0.4, ease: "easeInOut" }}
    style={{ width: "100%", height: "100%" }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();

  return (
    // mode="wait" ensures the old page finishes its animation before the new one starts
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={<PageTransition><Intro /></PageTransition>} 
        />
        <Route 
          path="/login" 
          element={<PageTransition><Login /></PageTransition>} 
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Fallback to Login */}
        <Route path="*" element={<PageTransition><Login /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}