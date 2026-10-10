import React from 'react';

import MainUser from './user/mainUser';

// The route is already guarded in App.js, so this only renders the user dashboard.
function Dashboard() {
  return <MainUser />;
}

export default Dashboard;
