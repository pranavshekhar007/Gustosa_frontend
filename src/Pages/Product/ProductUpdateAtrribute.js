import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { updateProductServ, getProductDetailsServ } from "../../services/product.services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa"; 

function ProductUpdateAttribute() {
  const params = useParams();
  const navigate = useNavigate();
  const [productOtherDetails, setProductOtherDetails] = useState([
    { key: "", value: [""] },
  ]);


  const fetchProductDetails = async () => {
    try {
      const res = await getProductDetailsServ(params.id);
      if (res?.data?.statusCode === 200) {
        const details = res.data.data?.productOtherDetails || [{ key: "", value: [""] }];
        setProductOtherDetails(details);
      }
    } catch (err) {
      toast.error("Failed to load product attributes");
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const handleKeyChange = (index, newKey) => {
    const updated = [...productOtherDetails];
    updated[index].key = newKey;
    setProductOtherDetails(updated);
  };

  const handleValueChange = (index, valueIndex, newValue) => {
    const updated = [...productOtherDetails];
    updated[index].value[valueIndex] = newValue;
    setProductOtherDetails(updated);
  };

  const addAttribute = () => {
    setProductOtherDetails([...productOtherDetails, { key: "", value: [""] }]);
  };

  const removeAttribute = (index) => {
    const updated = productOtherDetails.filter((_, i) => i !== index);
    setProductOtherDetails(updated);
  };

  const addValue = (index) => {
    const updated = [...productOtherDetails];
    updated[index].value.push("");
    setProductOtherDetails(updated);
  };

  const removeValue = (index, valueIndex) => {
    const updated = [...productOtherDetails];
    updated[index].value.splice(valueIndex, 1);
    setProductOtherDetails(updated);
  };

  const handleSubmit = async () => {
    const finalPayload = {
      id: params?.id,
      productOtherDetails,
    };

    try {
      let response = await updateProductServ(finalPayload);
      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message);
        navigate("/product-list");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="Add Product" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="row mx-0 p-0" style={{ position: "relative", top: "-75px", marginBottom: "-75px" }}></div>

          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <div className="d-flex">
                  <h4 className="p-2 text-dark shadow rounded mb-4" style={{ background: "#05E2B5" }}>
                    Update Product Attributes : Step 4/4
                  </h4>
                </div>
              </div>

              {productOtherDetails.map((attr, i) => (
                <div key={i} className="border p-3 mb-3 rounded">
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Attribute Key"
                      value={attr.key}
                      onChange={(e) => handleKeyChange(i, e.target.value)}
                    />
                    <button className="btn btn-outline-danger btn-md" onClick={() => removeAttribute(i)}>
                    <FaTrashAlt />
                    </button>
                  </div>

                  {attr.value.map((val, vi) => (
                    <div className="d-flex mb-2" key={vi}>
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Attribute Value"
                        value={val}
                        onChange={(e) => handleValueChange(i, vi, e.target.value)}
                      />
                      <button className="btn btn-outline-danger btn-md" onClick={() => removeValue(i, vi)}>
                        ×
                      </button>
                    </div>
                  ))}

                  <button className="btn btn-secondary btn-sm mt-2" onClick={() => addValue(i)}>
                    + Add Value
                  </button>
                </div>
              ))}

              <button className="btn btn-success mb-3" onClick={addAttribute}>
                + Add Attribute
              </button>

              <button className="btn btn-primary w-100" style={{ borderRadius: "30px" }} onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductUpdateAttribute;