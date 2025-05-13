import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getBookingListServ,
  getProductServ,
  getUserListServ,
} from "../../services/bookingDashboard.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams, useNavigate } from "react-router-dom";
import NoRecordFound from "../../Components/NoRecordFound";

function OrderList() {
  const { status: routeStatus } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [showSkelton, setShowSkelton] = useState(false);

  const [payload, setPayload] = useState({
    searchKey: "",
    status: routeStatus || "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "",
  });

  const handleGetBookingFunc = async () => {
    if (list.length === 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getBookingListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
    setShowSkelton(false);
  };

  useEffect(() => {
    setPayload((prev) => ({ ...prev, status: routeStatus || "" }));
  }, [routeStatus]);

  useEffect(() => {
    handleGetBookingFunc();
  }, [payload]);

  const staticsArr = [
    {
      title: "Total Orders",
      count: statics?.totalCount,
      bgColor: "#6777EF",
      key: "",
    },
    {
      title: "Order Placed",
      count: statics?.orderPlaced,
      bgColor: "#36A2EB",
      key: "orderPlaced",
    },
    {
      title: "Order Packed",
      count: statics?.orderPacked,
      bgColor: "#FFCE56",
      key: "orderPacked",
    },
    {
      title: "Out for Delivery",
      count: statics?.outForDelivery,
      bgColor: "#FFA500",
      key: "outForDelivery",
    },
    {
      title: "Completed",
      count: statics?.completed,
      bgColor: "#63ED7A",
      key: "completed",
    },
    {
      title: "Cancelled",
      count: statics?.cancelled,
      bgColor: "#F44336",
      key: "cancelled",
    },
  ];

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Orders" selectedItem="Orders" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="row mx-0 p-0" style={{ marginTop: "-75px" }}>
            {staticsArr.map((v, i) => (
              <div
                key={i}
                className="col-md-4 col-12"
                onClick={() => navigate(`/orders/${v.key}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="topCard shadow-sm py-4 px-3 rounded mb-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="p-2 shadow rounded"
                      style={{ background: v.bgColor }}
                    >
                      <img src="https://cdn-icons-png.flaticon.com/128/666/666120.png" />
                    </div>
                    <div className="ms-3">
                      <h6>{v.title}</h6>
                      <h2 className="text-secondary">{v.count}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row m-0 p-0 d-flex align-items-center my-4 topActionForm">
            <div className="col-lg-2 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">Orders</h3>
            </div>
            <div className="col-lg-4 mb-2 col-md-12 col-12">
              <input
                className="form-control borderRadius24"
                placeholder="Search"
                onChange={(e) =>
                  setPayload({ ...payload, searchKey: e.target.value })
                }
              />
            </div>
            <div className="col-lg-3 mb-2 col-md-6 col-12">
              <select
                className="form-control borderRadius24"
                value={payload.status}
                onChange={(e) => {
                  const selectedStatus = e.target.value;
                  navigate(`/orders/${selectedStatus}`);
                }}
              >
                <option value="">All Statuses</option>
                <option value="orderPlaced">Order Placed</option>
                <option value="orderPacked">Order Packed</option>
                <option value="outForDelivery">Out For Delivery</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <table className="table">
                  <thead style={{ background: "#F3F3F3", color: "#000" }}>
                    <tr>
                      <th className="text-center py-3">Sr. No</th>
                      <th className="text-center py-3">Payment Mode</th>
                      <th className="text-center py-3">User</th>
                      <th className="text-center py-3">Product</th>
                      <th className="text-center py-3">Status</th>
                      <th className="text-center py-3">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showSkelton
                      ? Array.from({ length: 6 }).map((_, i) => (
                          <tr key={i}>
                            <td className="text-center">
                              <Skeleton width={50} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={80} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={100} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={100} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={100} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={80} />
                            </td>
                          </tr>
                        ))
                      : list?.map((v, i) => (
                          <tr key={v._id}>
                            <td className="text-center">{i + 1}</td>
                            <td className="text-center">{v?.modeOfPayment}</td>
                            <td className="text-center">
                              {v?.userId?.firstName} {v?.userId?.lastName}
                            </td>
                            <td className="text-center">
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                  alignItems: "center",
                                }}
                              >
                                {v?.product?.map((p, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      backgroundColor: "#e8f4ff",
                                      border: "1px solid #cde1f9",
                                      color: "#003f66",
                                      padding: "10px 15px",
                                      borderRadius: "10px",
                                      fontSize: "0.85rem",
                                      minWidth: "220px",
                                      textAlign: "left",
                                      boxShadow:
                                        "0 2px 6px rgba(0, 0, 0, 0.05)",
                                    }}
                                  >
                                    {/* Product Hero Image */}
                                    {p?.productId?.productHeroImage && (
                                      <img
                                        src={p?.productId?.productHeroImage || "https://via.placeholder.com/150?text=No+Image"}
                                        alt={p?.productId?.name}
                                        style={{
                                          width: "50%",
                                          height: "60px",
                                          objectFit: "cover",
                                          borderRadius: "8px",
                                          marginBottom: "8px",
                                        }}
                                      />
                                    )}

                                    {/* Product Details */}
                                    <div
                                      style={{
                                        fontWeight: "600",
                                        marginBottom: "6px",
                                      }}
                                    >
                                      {p?.productId?.name}
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span>Qty:</span>
                                      <span>{p?.quantity}</span>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span>Total:</span>
                                      <span>₹{p?.totalPrice?.toFixed(2)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>

                            <td className="text-center">
                              <span
                                className="badge px-3 py-2 text-capitalize"
                                style={{
                                  backgroundColor:
                                    v?.status === "orderPlaced"
                                      ? "#36A2EB"
                                      : v?.status === "orderPacked"
                                      ? "#FFCE56"
                                      : v?.status === "outForDelivery"
                                      ? "#FFA500"
                                      : v?.status === "completed"
                                      ? "#63ED7A"
                                      : v?.status === "cancelled"
                                      ? "#F44336"
                                      : "#6c757d",
                                  color: "#fff",
                                  borderRadius: "20px",
                                  fontWeight: "500",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {v?.status.replace(/([A-Z])/g, " $1")}
                              </span>
                            </td>

                            <td className="text-center">{v?.totalAmount}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
                {list.length === 0 && !showSkelton && <NoRecordFound />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OrderList;
