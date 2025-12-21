import bcrypt from 'bcryptjs';

const testPassword = async () => {
  const password = 'admin@123';

  // Generate hash (this is what should be stored in DB)
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log('Password:', password);
  console.log('Generated Hash:', hash);
  console.log('Hash Length:', hash.length);

  // Test comparison
  const isMatch = await bcrypt.compare(password, hash);
  console.log('Password matches:', isMatch);

  // Test with your provided hash
  const yourHash = '$2a$10$Jt6pLlSM1fK0.Or6/IaPteAXkwXc98NQpcK1lYdpIHhrJ7ZIWMxwW';
  console.log('\nYour hash length:', yourHash.length);

  try {
    const matchesYourHash = await bcrypt.compare(password, yourHash);
    console.log('Password matches your hash:', matchesYourHash);
  } catch (error) {
    console.log('Error comparing with your hash:', error.message);
  }
};

testPassword();
