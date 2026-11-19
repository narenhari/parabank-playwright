function uniqueUser() {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    firstName: 'Test',
    lastName: 'User',
    address: '1 Test Street',
    city: 'Melbourne',
    state: 'VIC',
    zipCode: '3000',
    phone: '0400000000',
    ssn: '123-45-6789',
    username: `qa_${id}`,
    password: 'Passw0rd!',
  };
}

module.exports = { uniqueUser };