const User = require('../models/User');

const DEFAULT_CARE_MANAGER = {
  name: 'Chinmay Sahoo',
  email: 'chinmay@gmail.com',
  password: 'chin1987',
  role: 'careManager',
};

const seedDefaultCareManager = async () => {
  // This keeps a guaranteed demo login available for local testing and interviews.
  let demoUser = await User.findOne({ email: DEFAULT_CARE_MANAGER.email }).select('+password');

  if (!demoUser) {
    demoUser = new User(DEFAULT_CARE_MANAGER);
  } else {
    demoUser.name = DEFAULT_CARE_MANAGER.name;
    demoUser.password = DEFAULT_CARE_MANAGER.password;
    demoUser.role = DEFAULT_CARE_MANAGER.role;
  }

  await demoUser.save();
  console.log(`Demo care manager ready: ${DEFAULT_CARE_MANAGER.email}`);
};

module.exports = seedDefaultCareManager;
