import { paymentPlans } from "@/shared/config";

import PricingCard from "./PricingCard";
import './priceBoard.css'

const PriceBoard = () => {
 const handleSelectPlan = (plan) => {
    alert(`你选择了：${plan.name}`);
    // 这里可以替换为你自己的逻辑，比如跳转到支付页面
  };

  return (
    <div className="pricing-section">
      {paymentPlans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} onSelect={handleSelectPlan} />
      ))}
    </div>
  );
}

export default PriceBoard
