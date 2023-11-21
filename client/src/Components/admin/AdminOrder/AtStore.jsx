import React from "react";
import { WrapperHeader} from "../AdminUser/style";
import TableAtStore from "../../TableComponents/TableAtStore";



const AtStore = () => {
 

  return (
    <div>
      <WrapperHeader>Danh sách đơn hàng nhận tại cửa hàng</WrapperHeader>
      <div style={{ marginTop: '15px' }}>
        <TableAtStore />
      </div>
    </div>
  );
};

export default AtStore;