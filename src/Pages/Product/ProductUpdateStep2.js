import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";

import {
  updateProductServ,
  getProductDetailsServ,
} from "../../services/product.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import JoditEditor from "jodit-react";
import Select from "react-select";

import { getBrandServ } from "../../services/brand.services";
import { useParams, useNavigate } from "react-router-dom";
function ProductUpdateStep2() {
  const params = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [_id, setId] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const contentRef = useRef(""); // ✅ Store content without causing re-renders
  const [showPackServingWarning, setShowPackServingWarning] = useState(false);
  const [proceedAnyway, setProceedAnyway] = useState(false); // for "Yes/No" control

  // Jodit Editor Config
  const config = {
    placeholder: "Start typing...",
    height: "400px",
  };
  const [formData, setFormData] = useState({
    stockQuantity: "",
    brandId: "",
    price: "",
    discountedPrice: "",
    ingredients: "",
    packOf: "",
    numberOfPieces: "",
    currency: "",
    MRP: "",
    offerPrice: "",
    salePrice: "",
    saleStartDate: "",
    saleEndDate: "",
    itemWeight: "",
    packageWeight: "",
    packSize: "",
    servingSize: "",
    energy: "",
    protein: "",
    carbohydrate: "",
    fat: "",
    saturatedFat: "",
    transFat: "",
    totalSugar: "",
    addedSugar: "",
    dietaryFiber: "",
    calcium: "",
    iron: "",
    phosphorus: "",
    potassium: "",
    sodium: "",
    description: "",
  });

  const [brandList, setBrandList] = useState([]);
  const getBrandList = async () => {
    try {
      let response = await getBrandServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setBrandList(response?.data?.data);
      }
    } catch (error) {}
  };

  const getProductDetails = async () => {
    try {
      let response = await getProductDetailsServ(params?.id);
      if (response?.data?.statusCode === 200) {
        const product = response?.data?.data;
        setFormData({
          stockQuantity: product?.stockQuantity || "",
          brandId: product?.brandId || "",
          price: product?.price || "",
          discountedPrice: product?.discountedPrice || "",
          ingredients: product?.ingredients || "",
          description: product?.description || "",

          // Newly added fields
          packOf: product?.packOf || "",
          numberOfPieces: product?.numberOfPieces || "",
          currency: product?.currency || "",
          MRP: product?.MRP || "",
          offerPrice: product?.offerPrice || "",
          salePrice: product?.salePrice || "",
          saleStartDate: product?.saleStartDate || "",
          saleEndDate: product?.saleEndDate || "",
          itemWeight: product?.itemWeight || "",
          packageWeight: product?.packageWeight || "",
          packSize: product?.packSize || "",
          servingSize: product?.servingSize || "",
          energy: product?.energy || "",
          protein: product?.protein || "",
          carbohydrate: product?.carbohydrate || "",
          fat: product?.fat || "",
          saturatedFat: product?.saturatedFat || "",
          transFat: product?.transFat || "",
          totalSugar: product?.totalSugar || "",
          addedSugar: product?.addedSugar || "",
          dietaryFiber: product?.dietaryFiber || "",
          calcium: product?.calcium || "",
          iron: product?.iron || "",
          phosphorus: product?.phosphorus || "",
          potassium: product?.potassium || "",
          sodium: product?.sodium || "",
        });
        setContent(product?.description || "");
        contentRef.current = product?.description || "";
      }
    } catch (error) {
      toast.error("Failed to fetch product details.");
    }
  };

  useEffect(() => {
    getBrandList();
    getProductDetails();
  }, []);

  const updateProductFunc = async () => {
    setBtnLoader(true);
    try {
      let updatedData = {
        ...formData,
        description: contentRef.current,
        id: params?.id,
      };
      let response = await updateProductServ(updatedData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          stockQuantity: "",
          brandId: "",
          price: "",
          discountedPrice: "",
          ingredients: "",
          description: "",
          packOf: "",
          numberOfPieces: "",
          currency: "",
          MRP: "",
          offerPrice: "",
          salePrice: "",
          saleStartDate: "",
          saleEndDate: "",
          itemWeight: "",
          packageWeight: "",
          packSize: "",
          servingSize: "",
          energy: "",
          protein: "",
          carbohydrate: "",
          fat: "",
          saturatedFat: "",
          transFat: "",
          totalSugar: "",
          addedSugar: "",
          dietaryFiber: "",
          calcium: "",
          iron: "",
          phosphorus: "",
          potassium: "",
          sodium: "",
        });
        navigate("/update-product-step3/" + response?.data?.data?._id);
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
              <div className="table-responsive table-invoice">
                <div className="d-flex">
                  <h4
                    className="p-2 text-dark shadow rounded mb-4 "
                    style={{ background: "#05E2B5" }}
                  >
                    Update Product : Step 2/4
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label>Stock Quantity</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: e?.target.value,
                      })
                    }
                    value={formData?.stockQuantity}
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Brand</label>
                  <select
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        brandId: e?.target.value,
                      })
                    }
                    value={formData?.brandId}
                    className="form-control"
                  >
                    <option>Select</option>
                    {brandList?.map((v, i) => {
                      return <option value={v?._id}>{v?.name}</option>;
                    })}
                  </select>
                </div>
                <div className="col-12 d-flex ">
                  <p className="py-1 px-3 me-2 bg-primary text-light rounded bedge">INR</p>
                  <p className="py-1 px-3 me-2 bg-secondary text-light rounded bedge" style={{cursor:"pointer"}} onClick={()=>alert("Comming Soon")}>USD</p>
                  <p className="py-1 px-3 me-2 bg-secondary text-light rounded bedge" style={{cursor:"pointer"}} onClick={()=>alert("Comming Soon")}>AED</p>
                  
                </div>
                <div className="col-4 mb-3">
                  <label>Product Price (MRP)</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e?.target.value,
                      })
                    }
                    value={formData?.price}
                    className="form-control"
                  />
                </div>
                <div className="col-4 mb-3">
                  <label>Discounted/Sale Price</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountedPrice: e?.target.value,
                      })
                    }
                    value={formData?.discountedPrice}
                    className="form-control"
                  />
                </div>
                <div className="col-4 mb-3">
                  <label>Offer Price</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, offerPrice: e.target.value })
                    }
                    value={formData?.offerPrice}
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Ingredients</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ingredients: e?.target.value,
                      })
                    }
                    value={formData?.ingredients}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Pack Of</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, packOf: e.target.value })
                    }
                    value={formData?.packOf}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Number of Pieces</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numberOfPieces: e.target.value,
                      })
                    }
                    value={formData?.numberOfPieces}
                    className="form-control"
                  />
                </div>
                {/* 
                <div className="col-6 mb-3">
                  <label>Currency</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    value={formData?.currency}
                    className="form-control"
                  />
                </div> */}

                {/* <div className="col-6 mb-3">
                  <label>Sale Price</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, salePrice: e.target.value })
                    }
                    value={formData?.salePrice}
                    className="form-control"
                  />
                </div> */}

                <div className="col-6 mb-3">
                  <label>Sale Start Date</label>
                  <input
                    type="date"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        saleStartDate: e.target.value,
                      })
                    }
                    value={formData?.saleStartDate}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Sale End Date</label>
                  <input
                    type="date"
                    onChange={(e) =>
                      setFormData({ ...formData, saleEndDate: e.target.value })
                    }
                    value={formData?.saleEndDate}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Item Weight</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, itemWeight: e.target.value })
                    }
                    value={formData?.itemWeight}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Package Weight</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        packageWeight: e.target.value,
                      })
                    }
                    value={formData?.packageWeight}
                    className="form-control"
                  />
                </div>

                {/* Nutritional Section Heading  */}
                <div className="col-12 mt-4 mb-2">
                  <h2
                    className="text-secondary"
                    style={{ fontFamily: "poppins" }}
                  >
                    Nutritional
                  </h2>
                </div>

                <div className="col-6 mb-3">
                  <label>Pack Size </label>
                  <input
                    type="number"
                    onChange={(e) =>
                      setFormData({ ...formData, packSize: e.target.value })
                    }
                    value={formData.packSize}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Serving Size </label>
                  <input
                    type="number"
                    onChange={(e) => {
                      const newServingSize = e.target.value;
                      const pack = parseFloat(formData.packSize);
                      const serve = parseFloat(newServingSize);

                      // Basic check: If both values are valid and not zero
                      if (pack && serve && pack % serve !== 0) {
                        setShowPackServingWarning(true);
                      } else {
                        setShowPackServingWarning(false);
                        setProceedAnyway(false);
                      }

                      setFormData({ ...formData, servingSize: newServingSize });
                    }}
                    value={formData.servingSize}
                    className="form-control"
                  />
                </div>
                {showPackServingWarning && !proceedAnyway && (
                  <div className="alert alert-warning mt-3">
                    <p>
                      ⚠️ Pack size and Serving size don't match. Do you want to
                      continue?
                    </p>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => setProceedAnyway(true)}
                    >
                      Yes
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        setShowPackServingWarning(false);
                        setFormData({ ...formData, servingSize: "" });
                      }}
                    >
                      No
                    </button>
                  </div>
                )}

                <div className="col-6 mb-3">
                  <label>Energy (Kcal)</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, energy: e.target.value })
                    }
                    value={formData?.energy}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Protein (g)</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, protein: e.target.value })
                    }
                    value={formData?.protein}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Carbohydrate (g)</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, carbohydrate: e.target.value })
                    }
                    value={formData?.carbohydrate}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Fat (g)</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, fat: e.target.value })
                    }
                    value={formData?.fat}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Saturated Fat (g)</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, saturatedFat: e.target.value })
                    }
                    value={formData?.saturatedFat}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Trans Fat (g)</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, transFat: e.target.value })
                    }
                    value={formData?.transFat}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Total Sugar</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, totalSugar: e.target.value })
                    }
                    value={formData?.totalSugar}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Added Sugar</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, addedSugar: e.target.value })
                    }
                    value={formData?.addedSugar}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Dietary Fiber (g)</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, dietaryFiber: e.target.value })
                    }
                    value={formData?.dietaryFiber}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Calcium (mg)</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, calcium: e.target.value })
                    }
                    value={formData?.calcium}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Iron (mg)</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, iron: e.target.value })
                    }
                    value={formData?.iron}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Phosphorus (mg)</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, phosphorus: e.target.value })
                    }
                    value={formData?.phosphorus}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Potassium (mg)</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, potassium: e.target.value })
                    }
                    value={formData?.potassium}
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Sodium (mg)</label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, sodium: e.target.value })
                    }
                    value={formData?.sodium}
                    className="form-control"
                  />
                </div>

                <div className="col-12 mb-3">
                  <label>Product Description</label>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={content}
                    onChange={(newContent) => {
                      contentRef.current = newContent; // ✅ Update ref without re-rendering
                    }}
                  />
                </div>
                {btnLoader ? (
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
                      Updating ...
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
                      onClick={() => updateProductFunc()}
                      disabled={showPackServingWarning && !proceedAnyway} // Disable until confirmed
                    >
                      Update
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

export default ProductUpdateStep2;
