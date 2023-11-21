import React from "react";
import { WrapperHeader} from "../AdminUser/style";
import TableShipping from "../../TableComponents/TableShipping";



const Shipping = () => {
 

  return (
    <div>
      <WrapperHeader>Danh sách đơn hàng giao tận nơi</WrapperHeader>
      <div style={{ marginTop: '15px' }}>
        <TableShipping />
      </div>
    </div>
  );
};

export default Shipping;