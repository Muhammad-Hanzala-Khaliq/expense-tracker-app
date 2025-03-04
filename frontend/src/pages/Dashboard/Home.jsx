import React from 'react'
import DasboardLayout from "../../components/layouts/DasboardLayout";
import { userUserAuth } from "../../hooks/useUserAuth";

const Home = () => {
  userUserAuth();
  return (
    <DasboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">Home</div>
    </DasboardLayout>
  );
};

export default Home