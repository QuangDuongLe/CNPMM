import React from "react";
import { WrapperHeader} from "../AdminUser/style";
import TableComplete from "../../TableComponents/TableComplete";



const Complete = () => {

  return (
    <div>
      <WrapperHeader>Danh sách đơn hàng đã hoàn thành</WrapperHeader>
      <div style={{ marginTop: '15px' }}>
        <TableComplete />
      </div>
    </div>
  );
};

export default Complete;