import ArticleSection from "./components/ArticleSection";
import Hero from "./components/Hero";
import Navbar from "./components/global/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div>
        <Hero />
        <ArticleSection />
      </div>
    </>
  );
}

export default App;
