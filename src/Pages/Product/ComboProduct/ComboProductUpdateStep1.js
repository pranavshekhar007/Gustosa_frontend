import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../Components/Sidebar";
import TopNav from "../../../Components/TopNav";
import { getProductTypeServ } from "../../../services/productType.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { getComboProductDetailsServ, updateComboProductServ } from "../../../services/comboProduct.services";
import { getProductServ } from "../../../services/product.services";

function ComboProductUpdateStep1() {
  const params = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const contentRef = useRef("");


  const [btnLoader, setBtnLoader] = useState(false);
  const [content, setContent] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    productType: "",
    productId: [],
    gtin: "",
    shortDescription: "",
  });

  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  const config = {
    placeholder: "Start typing...",
    height: "300px",
  };

  const fetchDropdownData = async () => {
    try {
      const [typeRes, productRes] = await Promise.all([
        getProductTypeServ({ status: true }),
        getProductServ(),
      
      ]);

      if (typeRes?.data?.statusCode === 200) {
        setProductTypeOptions(
          typeRes.data.data.map((type) => ({
            label: type.name,
            value: type.name,
          }))
        );
      }
      
      if (productRes?.data?.statusCode === 200) {
        setProductOptions(
          productRes.data.data.map((product) => ({
            label: product.name,
            value: product._id,
          }))
        );
      }
    } catch (error) {
      toast.error("Failed to fetch dropdown data.");
    }
  };

  const getComboProductDetails = async () => {
    try {
      let response = await getComboProductDetailsServ(params?.id);
      if (response?.data?.statusCode === 200) {
        const product = response?.data?.data;
        setFormData({
          name: product?.name || "",
          productType: product?.productType || "",
          productId: product?.productId || [],
          gtin: product?.gtin || "",
          shortDescription: product?.shortDescription || "",
        });
        setContent(product?.shortDescription || "");
        contentRef.current = product?.shortDescription || "";
      }
    } catch (error) {
      toast.error("Failed to fetch product details.");
    }
  };

  useEffect(() => {
    fetchDropdownData();
    getComboProductDetails();
  }, []);

  const updateComboProductFunc = async () => {
    setBtnLoader(true);
    try {
      let updatedData = {
        ...formData,
        shortDescription: contentRef.current,
        id: params?.id,
      };
      let response = await updateComboProductServ(updatedData);
      if (response?.data?.statusCode === 200) {
        toast.success("Combo Product Step 1 Updated Successfully!");
        setFormData({
          name: "",
          productId: [],
          productType: "",
          gtin: "",
          shortDescription: "",
        });
        navigate("/update-combo-product-step2/" + response?.data?.data?._id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setBtnLoader(false);
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="Add Product" />
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
              <div className="d-flex">
                <h4
                  className="p-2 text-dark shadow rounded mb-4"
                  style={{ background: "#05E2B5" }}
                >
                  Update Combo Product : Step 1/4
                </h4>
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="form-control"
                  />
                </div>

                

                <div className="col-6 mb-3">
                  <label>Product Type</label>
                  <Select
                    value={
                      formData.productType
                        ? {
                            label: formData.productType,
                            value: formData.productType,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setFormData({
                        ...formData,
                        productType: selected?.value || "",
                      })
                    }
                    options={productTypeOptions}
                  />
                </div>

            

                <div className="col-6 mb-3">
                  <label>Product</label>
                  <Select
                    isMulti
                    value={productOptions.filter((option) =>
                      formData.productId.includes(option.value)
                    )}
                    onChange={(selected) =>
                      setFormData({
                        ...formData,
                        productId: selected.map((option) => option.value),
                      })
                    }
                    options={productOptions}
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
                  <label>Short Description</label>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={content}
                    onChange={(newContent) => {
                      contentRef.current = newContent;
                    }}
                  />
                </div>

                <div className="col-12">
                  <button
                    className="btn btn-primary w-100"
                    style={{
                      background: "#61ce70",
                      border: "none",
                      borderRadius: "24px",
                    }}
                    onClick={updateComboProductFunc}
                    disabled={btnLoader}
                  >
                    {btnLoader ? "Saving..." : "Update & Continue"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComboProductUpdateStep1;
