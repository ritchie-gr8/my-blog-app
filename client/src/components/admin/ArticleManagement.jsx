import React, { useState } from "react";
import ArticleManager from "./ArticleManager";
import ArticleEditor from "./ArticleEditor";

const ArticleManagement = () => {
  const [mode, setMode] = useState("list");
  const [articles, setArticles] = useState([
    {
      id: 1,
      title:
        "Understanding Cat Behavior: Why Your Feline Friend Acts the Way They Do",
      category: "Cat",
      status: "Published",
    },
    {
      id: 2,
      title: "The Fascinating World of Cats: Why We Love Our Furry Friends",
      category: "Cat",
      status: "Published",
    },
    {
      id: 3,
      title:
        "Finding Motivation: How to Stay Inspired Through Life's Challenges",
      category: "General",
      status: "Published",
    },
    {
      id: 4,
      title:
        "The Science of the Cat's Purr: How It Benefits Cats and Humans Alike",
      category: "Cat",
      status: "Published",
    },
    {
      id: 5,
      title: "Top 10 Health Tips to Keep Your Cat Happy and Healthy",
      category: "Cat",
      status: "Published",
    },
    {
      id: 6,
      title: "Unlocking Creativity: Simple Habits to Spark Inspiration Daily",
      category: "Inspiration",
      status: "Published",
    },
  ]);

  return (
    <div>
      {mode === "list" && (
        <ArticleManager
          setMode={setMode}
          articles={articles}
        />
      )}
      {mode === "editor" && (
        <ArticleEditor
          setMode={setMode}
          articles={articles}
          setArticles={setArticles}
        />
      )}
    </div>
  );
};

export default ArticleManagement;
