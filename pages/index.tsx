import React from "react";
import { GetStaticProps } from "next";
import prisma from "../lib/prisma";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";

export const getStaticProps: GetStaticProps = async () => {
  try {
    const feed = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    return {
      props: { feed },
      revalidate: 10, // ISR: Regenerates every 10 seconds
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      props: { feed: [] }, // Return an empty array on failure
    };
  }
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = ({ feed }) => {
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {feed.length > 0 ? (
            feed.map((post) => (
              <div key={post.id} className="post">
                <Post post={post} />
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }
        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }
        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Blog;
