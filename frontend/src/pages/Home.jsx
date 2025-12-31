import React from 'react';
import Slider from '../components/Home/Slider';
import SportsBranches from '../components/Home/SportsBranches';
import SportsGridLayout from '../components/Home/SportsGridLayout';
import StatsCounter from '../components/Home/StatsCounter';

const Home = () => {
  return (
    <>
      <Slider />
      <SportsBranches />
      <SportsGridLayout />
      <StatsCounter />
 {/*      <VideoPreview /> */}
    </>
  );
};

export default Home;