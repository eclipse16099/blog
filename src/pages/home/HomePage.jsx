import React from "react";

import MainLayout from "../../components/MainLayout";
import Articles from "./container/Articles";
import CTA from "./container/CTA";
import Hero from "./container/Hero";
import {useSelector} from "react-redux";

const HomePage = () => {
  const token = useSelector((state) => state.user?.userInfo?.token)
  return (
    <MainLayout>
      {!token ? (
        <Hero />
      ) : <></>}
      {token ? (
        <Articles />
      ) : <></>}
      <CTA />
    </MainLayout>
  );
};

export default HomePage;
