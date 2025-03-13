import Article from "./components/Article";
import ArticleSection from "./components/ArticleSection";
import Hero from "./components/Hero";
import Footer from "./components/global/Footer";
import Navbar from "./components/global/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div>
        {/* <Hero />
        <ArticleSection /> */}
        <Article />
      </div>
      <Footer />
    </>
  );
}

export default App;
