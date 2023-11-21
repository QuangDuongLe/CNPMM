import React from "react";
import { WrapperHeader} from "../AdminUser/style";
import TableCancel from "../../TableComponents/TableCancel";



const Cancel = () => {

  return (
    <div>
      <WrapperHeader>Danh sách đơn hàng đã huỷ</WrapperHeader>
      <div style={{ marginTop: '15px' }}>
        <TableCancel />
      </div>
    </div>
  );
};

export default Cancel;