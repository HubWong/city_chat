// src/components/PricingCard.jsx

import React from "react";
import "./pricingCard.css";

const PricingCard = ({ plan, onSelect }) => {
  return (
    <div className="pricing-card">
      <h3 className="plan-name">{plan.name}</h3>
      <p className="plan-price">
        <span className="price">{plan.price}</span>
        {plan.currency}<span className="currency"> {plan.duration}</span>
      </p>
      
      <ul className="features">
        {plan.features.map((feature, index) => (
          <li key={index} className="feature-item">
            ✅ {feature}
          </li>
        ))}
      </ul>
      <button className="select-btn" onClick={() => onSelect(plan)}>
        选择此计划
      </button>
    </div>
  );
};

export default PricingCard;