import { useEffect } from "react";
import Article from "./components/Article";
import ArticleSection from "./components/ArticleSection";
import Hero from "./components/Hero";
import Footer from "./components/global/Footer";
import Navbar from "./components/global/Navbar";
import { checkHealth } from "./api/users";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";

function App() {
  useEffect(() => {
    const fetchHealth = async () => {
      const res = await checkHealth();
      console.log(res);
    };

    fetchHealth()
  }, []);

  return (
    <>
      <Navbar />
      <div>
        {/* <Hero /> */}
        {/* <ArticleSection /> */}
        <Article />
        {/* <LogIn /> */}
        {/* <SignUp /> */}
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default App;
