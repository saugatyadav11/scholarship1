import { getSession } from 'next-auth/react';

import { connectToDatabase } from '@/common/lib/db';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return;
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Not authenticated !' });

    return;
  }

  //* Connecting to database
  let client;

  try {
    client = await connectToDatabase();
  } catch (error) {
    res.status(400).json({
      message: "Couldn't connect to database!",
    });

    return;
  }

  const scholarshipsCollection = client.db().collection('scholarships');

  try {
    const scholarships = await scholarshipsCollection
      .find()
      .sort({ 'data.rank': 1 })
      .toArray();
    client.close();
    res.status(200).json({
      data: scholarships,
      message: `Successfully applied !`,
    });
  } catch (error) {
    client.close();
    res.status(422).json({ message: error.message });

    return;
  }
};

export default handler;
