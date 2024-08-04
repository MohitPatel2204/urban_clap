import React, { useCallback, useEffect, useState } from "react";
import ResponsiveAppBar from "../../layouts/header/ResponsiveAppBar";
import Sidebar from "../../layouts/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { deleteData, getData } from "../../services/axiosrequests";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Category = () => {
  const [categorys, setcategory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const navigate = useNavigate();
  let userdata = useSelector((state) => state.user);
  let storedata = JSON.parse(localStorage.getItem("creads"));
  let config = { headers: { Authorization: `Bearer ${storedata.access}` } };

  const handleUpdate = (data) => {
    navigate("/addcategory", {
      state: data,
    });
  };
  const handleAddServices = () => {
    navigate("/addcategory", {
      state: {
        name: "",
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
          let cat = categorys.filter((service) => {
            return service.id != id;
          });
          setcategory(cat);
          setCurrentPage(1);
          let storedata = JSON.parse(localStorage.getItem("creads"));
          let config = {
            headers: { Authorization: `Bearer ${storedata.access}` },
          };
          console.log(id);
          const response = await deleteData(
            `${import.meta.env.VITE_API_URL}category/?id=${id}`,
            config
          );
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
        `${import.meta.env.VITE_API_URL}category/`,
        {
          headers: { Authorization: `Bearer ${storedata.access}` },
          params: {
            page: page,
            search: query,
          },
        }
      );
      setcategory(response.context?.results);
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
        <div
          className="add-form"
          style={{ padding: "20px", marginLeft: "22%", width: "75%" }}
        >
          <div className="text-center fs-3 text-primary">Category</div>
          <div className="mb-4 mt-3">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          <div className="add">
            <p
              className="btn btn-primary"
              onClick={() => {
                handleAddServices();
              }}
            >
              Add Category
            </p>
          </div>
          <table style={{ width: "100%", padding: "5px" }}>
            <tbody>
              <tr>
                <th>Id</th>
                <th>Name</th>
              </tr>

              {categorys.map((item, key) => {
                return (
                  <tr key={key}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      <p
                        onClick={() =>
                          handleUpdate({
                            id: item.id,
                            name: item.name,
                          })
                        }
                        className="btn btn-primary"
                      >
                        Update
                      </p>
                    </td>
                    {userdata?.text?.pk == 1 && (
                      <td>
                        <p
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </p>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
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
          </table>
        </div>
      </div>
    </div>
  );
};

export default Category;
