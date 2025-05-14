import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../Components/Sidebar";
import TopNav from "../../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import Select from "react-select";
import { useGlobalState } from "../../../GlobalProvider";
import { useNavigate } from "react-router-dom";
import { getProductServ } from "../../../services/product.services";
import { addComboProductServ } from "../../../services/comboProduct.services";
import { getProductTypeServ } from "../../../services/productType.service";
function AddComboProduct() {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const editor = useRef(null);
  const contentRef = useRef("");
  const config = {
    placeholder: "Start typing...",
    height: "300px",
  };
  const [hsnError, setHsnError] = useState("");

  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    productId: [],
    productType: "",
    gtin: "",
    shortDescription: "",
  });

  const [productType, setProductType] = useState([]);
  const getProductTypeListFunc = async () => {
    try {
      let response = await getProductTypeServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setProductType(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [productList, setProductList] = useState([]);
  const getProductListFunc = async () => {
    try {
      let response = await getProductServ();
      if (response?.data?.statusCode == "200") {
        setProductList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductTypeListFunc();
    getProductListFunc();
  }, []);
  const [loader, setLoader] = useState(false);
  const handleSubmit = async () => {
    setLoader(true);
    try {
      let finalPayload;
      const shortDescription = contentRef.current;
      if (formData?.createdByAdmin != "No") {
        finalPayload = {
          name: formData?.name,
          productId: formData?.productId,
          productType: formData?.productType,
          gtin: formData?.gtin,
          shortDescription: shortDescription,
          createdBy: formData?.createdBy,
        };
      }
      if (formData?.createdByAdmin == "No") {
        finalPayload = {
          name: formData?.name,
          productId: formData?.productId,
          productType: formData?.productType,
          gtin: formData?.gtin,
          shortDescription: shortDescription,
          createdBy: formData?.createdBy,
        };
      }
      let response = await addComboProductServ(finalPayload);
      if (response?.data?.statusCode == 200) {
        toast.success(response?.data?.message);
        setFormData({
          name: "",
          productId: [],
          productType: "",
          gtin: "",
          createdBy: "",
          createdByAdmin: "",
        });
        contentRef.current = "";
        setContent("");
        navigate("/update-combo-product-step2/" + response?.data?.data?._id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setLoader(false);
  };

  return (
    <div className="bodyContainer">
      <Sidebar
        selectedMenu="Product Management"
        selectedItem="Add Combo Product"
      />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div
            className="row mx-0 p-0"
            style={{
              position: "relative",
              top: "-75px",
              marginBottom: "-75px",
            }}
          ></div>

          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <div className="d-flex">
                  <h4
                    className="p-2 text-dark shadow rounded mb-4 "
                    style={{ background: "#05E2B5" }}
                  >
                    Add Combo Product : Step 1/4
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label>Product Name*</label>
                  <input
                    value={formData?.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e?.target?.value })
                    }
                    className="form-control"
                    style={{ height: "45px" }}
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Select Product Type*</label>
                  <select
                    className="form-control"
                    value={formData?.productType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productType: e?.target?.value,
                      })
                    }
                  >
                    <option>Select</option>
                    {productType?.map((v, i) => {
                      return <option>{v?.name}</option>;
                    })}
                  </select>
                </div>

                <div className="col-6 mb-3">
                  <label>Product*</label>
                  <Select
                    isMulti
                    options={productList?.map((v) => ({
                      label: v?.name,
                      value: v?._id,
                    }))}
                    value={productList
                      .filter((v) => formData.productId.includes(String(v._id)))
                      .map((v) => ({ label: v.name, value: v._id }))}
                    onChange={(selectedOptions) =>
                      setFormData({
                        ...formData,
                        productId: selectedOptions.map(
                          (option) => option.value
                        ),
                      })
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>GTIN Code*</label>
                  <input
                    className="form-control"
                    style={{ height: "45px" }}
                    value={formData?.gtin || ""}
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setFormData({ ...formData, gtin: value });
                      }
                    }}
                  />
                </div>

                <div className="col-12 mb-3">
                  <label>Short Description*</label>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={content}
                    onChange={(newContent) => {
                      contentRef.current = newContent;
                    }}
                  />
                </div>
                {loader ? (
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#05E2B5",
                        border: "none",
                        borderRadius: "24px",
                        opacity: "0.6",
                      }}
                    >
                      Saving ...
                    </button>
                  </div>
                ) : formData?.name &&
                  formData?.productType?.length > 0 &&
                  formData?.gtin ? (
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#05E2B5",
                        border: "none",
                        borderRadius: "24px",
                      }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#61ce70",
                        border: "none",
                        borderRadius: "24px",
                      }}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddComboProduct;
