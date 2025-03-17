import React from "react";
import articleImg from "../assets/article-placeholder.jpg";
import Button from "./global/Button";
import AuthorProfileCard from "./custom/AuthorProfileCard";
import ArticleShareMenu from "./custom/ArticleShareMenu";
import ArticleCommentSection from "./custom/ArticleCommentSection";

const ArticleContent = () => {
  return (
    <div className="mb-10">
      <h4 className="font-semibold text-h4 text-brown-600 mb-6">
        1. Independent Yet Affectionate
      </h4>
      <p className="text-b1 font-medium text-brown-500">
        One of the most remarkable traits of cats is their balance between
        independence and affection. Unlike dogs, who are often eager for
        constant attention, cats enjoy their alone time. They can spend hours
        grooming themselves, exploring the house, or napping in quiet corners.
        However, when they want affection, they know how to seek it out with a
        soft purr, a gentle nuzzle, or by curling up on your lap. This duality
        makes cats appealing to many people who appreciate the fact that their
        feline companions are low-maintenance but still loving. It’s like having
        a roommate who enjoys your company but doesn’t demand too much of your
        time!
      </p>
    </div>
  );
};

const Article = () => {
  return (
    <article>
      {/* Image */}
      <div className="w-full md:px-36 md:pt-16">
        <img
          src={articleImg}
          alt="article image"
          className="w-full h-[184px] sm:h-auto max-h-[587px]  md:rounded-xl object-cover max-w-full"
        />
      </div>

      {/* Content */}
      <section className="md:grid md:grid-cols-4 md:mr-36">
        <div className="md:col-span-3">
          <div className="mx-4 mb-10 md:ml-36 md:mr-20 md:mt-12">
            <div className="flex items-center gap-4 mt-6 mb-4">
              <Button
                style="px-3 py-1 w-fit font-medium text-b2"
                variant={"article-genre"}
              >
                Cat
              </Button>

              <p className="text-b1 font-medium text-brown-400">
                11 September 2024
              </p>
            </div>

            <h3 className="text-h3 font-semibold text-brown-600">
              The Fascinating World of Cats: Why We Love Our Furry Friends
            </h3>

            <div className="mt-6 mb-9 text-b1 font-medium text-brown-500">
              <p>
                Cats have captivated human hearts for thousands of years.
                Whether lounging in a sunny spot or playfully chasing a string,
                these furry companions bring warmth and joy to millions of
                homes. But what makes cats so special? Let’s dive into the
                unique traits, behaviors, and quirks that make cats endlessly
                fascinating.
              </p>
            </div>

            {[1, 2, 3, 4, 5].map((x) => (
              <ArticleContent key={x} />
            ))}

            <AuthorProfileCard className="md:hidden" />
          </div>

          <ArticleShareMenu />

          <ArticleCommentSection />
        </div>
        <div className="hidden md:block md:relative w-fit justify-self-end">
          <AuthorProfileCard className="my-12 sticky top-12 max-w-[305px] right-0" isSticky={true} />
        </div>
      </section>
    </article>
  );
};

export default Article;
