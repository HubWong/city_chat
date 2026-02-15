import styles from "./Landing.module.css";

import HeroSection from "../LandingCmp/Hero";
import SuccessStories from "../LandingCmp/Stories";
import UserStats from "../LandingCmp/UserStat";
import QuickMatch from "../LandingCmp/QuickMatch";
import Payment from '@/pages/Payment'
export default function LandingPage() {
  return (
    <div className={styles.content}>
      <HeroSection />
      <SuccessStories />
      <UserStats />
      <QuickMatch />

      <Payment />
    </div>
  );
}
