import React, { useState, useEffect } from "react";
import { WrapperHeader} from "../AdminUser/style";
import TableProduct from "../../TableComponents/TableProduct";


const AdminProduct = () => {
 

  return (
    <div>
      <WrapperHeader>Danh sách sản phẩm</WrapperHeader>
      <div style={{ marginTop: '15px' }}>
        <TableProduct  />
      </div>
    </div>
  );
};

export default AdminProduct;