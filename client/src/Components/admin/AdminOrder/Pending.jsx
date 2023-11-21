import React from "react";
import { WrapperHeader} from "../AdminUser/style";
import TablePending from "../../TableComponents/TablePending";



const Pending = () => {
 

  return (
    <div>
      <WrapperHeader>Danh sách đơn hàng chờ xác nhận</WrapperHeader>
      <div style={{ marginTop: '15px' }}>
        <TablePending />
      </div>
    </div>
  );
};

export default Pending;