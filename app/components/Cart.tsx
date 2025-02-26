import React from "react";
import { GrCart } from "react-icons/gr";

const Cart = () => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <GrCart size="1.5rem" />
          <span className="badge badge-sm indicator-item ">8</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;
