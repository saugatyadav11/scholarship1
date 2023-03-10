import { getSession } from 'next-auth/react';

import { connectToDatabase } from '@/common/lib/db';

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return;
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Not authenticated !' });

    return;
  }
  const userEmail = session.user.email;

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

  const { documents, ...restValues } = req.body;

  //* save the profile photo to cloudinary
  let documentImageData;

  try {
    let multiplePicturePromise = documents.map((picture) =>
      cloudinary.uploader.upload(picture, {
        upload_preset: 'documents',
      }),
    );
    // await all the cloudinary upload functions in promise.all, exactly where the magic happens
    const imageResponses = await Promise.all(multiplePicturePromise);
    documentImageData = imageResponses;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }

  const scholarshipsCollection = client.db().collection('scholarships');

  try {
    await scholarshipsCollection.insertOne({
      state: 'applied',
      data: {
        email: userEmail,
        ...restValues,
        appliedDate: new Date(),
        documentImageData,
      },
    });
    client.close();
    res
      .status(200)
      .json({ message: `Successfully applied ! (${req.body.universityId})` });
  } catch (error) {
    client.close();
    res.status(422).json({ message: error.message });

    return;
  }
};

export default handler;
