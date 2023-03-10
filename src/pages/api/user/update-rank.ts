import { getSession } from 'next-auth/react';
import { ObjectId } from 'mongodb';

import { connectToDatabase } from '@/common/lib/db';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
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
  const bulkUpdateOps = req.body.map((data) => {
    return {
      updateOne: {
        filter: { _id: new ObjectId(data._id) },
        update: { $set: { 'data.rank': data.data.rank } },
      },
    };
  });

  try {
    await scholarshipsCollection.bulkWrite(bulkUpdateOps);
    client.close();
    res.status(200).json({ message: `Rank successfully updated !` });
  } catch (error) {
    client.close();
    res.status(422).json({ message: error.message });

    return;
  }
};

export default handler;
