import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  // Ensure user is authenticated
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { title, content } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            email: session.user.email, // ✅ Ensure this is defined
          },
        },
      },
    });

    res.status(200).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating post' });
  }
}
