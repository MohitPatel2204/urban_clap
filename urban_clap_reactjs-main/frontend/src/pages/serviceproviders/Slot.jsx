import React, { useCallback, useEffect, useState } from "react";
import ResponsiveAppBar from "../../layouts/header/ResponsiveAppBar";
import Sidebar from "../../layouts/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { deleteData, getData } from "../../services/axiosrequests";
import Swal from "sweetalert2";
import { debounce } from "lodash";

const Slot = () => {
  let [slot, setSlot] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const navigate = useNavigate();

  const handleUpdate = (data) => {
    navigate("/addslot", {
      state: data,
    });
  };
  const handleAddServices = () => {
    navigate("/addslot", {
      state: {
        solt: "",
      },
    });
  };

  const handleDelete = (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success btn-gap",
        cancelButton: "btn btn-danger btn-gap",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          slot = slot.filter((service) => {
            return service.id != id;
          });
          setSlot(slot);
          setCurrentPage(1);
          try {
            let storedata = JSON.parse(localStorage.getItem("creads"));
            let config = {
              headers: { Authorization: `Bearer ${storedata.access}` },
            };
            const response = await deleteData(
              `${import.meta.env.VITE_API_URL}slot/${id}/`,
              config
            );
          } catch (err) {
            console.log(err.response);
          }
          swalWithBootstrapButtons
            .fire({
              title: "Deleted!",
              text: "Category Deleted...!",
              icon: "success",
            })
            .then(async (result2) => {});
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your data is safe :)",
            icon: "error",
          });
        }
      });
  };

  const debouncedSearch = useCallback(
    debounce(async (page, query) => {
      let storedata = JSON.parse(localStorage.getItem("creads"));
      const response = await getData(
        `${import.meta.env.VITE_API_URL}slot/?page=${page}&search=${query}`,
        {
          headers: { Authorization: `Bearer ${storedata.access}` },
        }
      );
      console.log(response);
      setSlot(response.context?.results);
      setTotalPage(Math.ceil(response.context.count / 2));
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(currentPage, inputValue);
  }, [currentPage, debouncedSearch]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setCurrentPage(1);
    debouncedSearch(currentPage, event.target.value);
  };
  const handleNext = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="header-for-page">
        <ResponsiveAppBar />
        <div className="add-form" style={{ width: "75%", marginLeft: "21%" }}>
          <div className="text-center fs-3 mt-3 text-primary">Slots</div>
          <div className="add">
            <p
              className="btn btn-primary"
              onClick={() => {
                handleAddServices();
              }}
            >
              Add Slot
            </p>
          </div>
          <div className="mb-4 mt-3">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          <table style={{ width: "100%", padding: "5px", marginLeft: "10%" }}>
            <tbody>
              <tr>
                <th>Id</th>
                <th>Slot</th>
              </tr>

              {slot.map((item, key) => {
                return (
                  <tr key={key}>
                    <td>{item.id}</td>
                    <td>{item.slot}</td>
                    <td>
                      <p
                        onClick={() =>
                          handleUpdate({
                            id: item.id,
                            slot: item.slot,
                            user: item.user,
                          })
                        }
                        className="btn btn-primary"
                      >
                        Update
                      </p>
                    </td>
                    <td>
                      <p
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="buttons d-flex gap-3">
            <button
              className="btn btn-primary"
              onClick={handlePrev}
              disabled={currentPage == 1}
            >
              Prev
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={currentPage === totalPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slot;
