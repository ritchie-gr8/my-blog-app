import React from "react";
import SearchBox from "./ui/SearchBox";
import ArticleCard from "./ui/ArticleCard";

const ArticleSection = () => {
  return (
    <section className="md:mx-32">
      <h3 className="text-h3 m-4">Latest articles</h3>
      <SearchBox />
      <article className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((x) => (
          <ArticleCard />
        ))}
      </article>
      <button className="w-full font-medium text-brown-600 underline text-center mt-6 mb-14 cursor-pointer sm:mt-14 sm:mb-28">View more</button>
    </section>
  );
};

export default ArticleSection;
