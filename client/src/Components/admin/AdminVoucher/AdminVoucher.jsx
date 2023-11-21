import React, { useState, useEffect } from "react";
import { WrapperHeader} from "../AdminUser/style";
import TableVoucher from "../../TableComponents/TableVoucher";


const AdminVoucher = () => {
 

  return (
    <div>
      <WrapperHeader>Danh sách Voucher</WrapperHeader>
      <div style={{ marginTop: '15px' }}>
        <TableVoucher  />
      </div>
    </div>
  );
};

export default AdminVoucher;