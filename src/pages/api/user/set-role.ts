import { getSession } from 'next-auth/react';

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

  const userCollection = client.db().collection('users');

  //* find user
  let user;

  try {
    user = await userCollection.findOne({
      email: userEmail,
    });
  } catch (err) {
    res.status(422).json({ message: "Couldn't find the user." });
    client.close();

    return;
  }

  if (!user) {
    res.status(422).json({ message: "User don't exists." });
    client.close();

    return;
  }

  let roleExists;

  try {
    roleExists = await userCollection.findOne({
      role: req.body.role,
      email: user.email,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Role checking failed!',
    });
  }

  if (roleExists) {
    res.status(400).json({
      message: 'Role already exists! Please use different email',
    });

    return;
  }

  try {
    await userCollection.updateOne(
      { email: userEmail },
      { $set: { role: req.body.role } },
    );
    client.close();
    res.status(200).json({ message: `Role added ! (${req.body.role})` });
  } catch (error) {
    client.close();
    res.status(422).json({ message: error.message });

    return;
  }
};

export default handler;
