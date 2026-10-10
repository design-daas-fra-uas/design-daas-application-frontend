import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* Dashboard */
import MainUser from "./user/mainUser";

function Dashboard() {
  const { t } = useTranslation();

  let userToken = localStorage.getItem("role");

  useEffect(() => {
    if (!userToken) {
      window.location.href = "/";
    }
  }, [userToken]);

  return (
    <>
      <MainUser />
    </>
  );
}

export default Dashboard;
