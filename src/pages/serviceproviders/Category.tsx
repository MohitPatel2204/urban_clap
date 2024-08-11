import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import userT from "../../types/userT";
import Spinner from "../spiner";
import SerachBox from "../../components/common/FormController/SerachBox";
import useAxois from "../../hooks/axois";

type categoryT = {
  id: number;
  name: string;
};

const Category = () => {
  const [categorys, setcategory] = useState<Array<categoryT>>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const navigate = useNavigate();
  const userdata = useSelector(
    (state: { user: { text: userT } }) => state.user
  );
  const { axiosDelete, axoisGet } = useAxois();

  const handleUpdate = (data: categoryT) => {
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
  const handleDelete = (id: number) => {
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
          const cat = categorys.filter((categoty) => categoty.id !== id);
          setcategory(cat);
          setCurrentPage(1);

          await axiosDelete(`category/?id=${id}`);
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Category Deleted...!",
            icon: "success",
          });
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
      setLoader(false);
      const response = await axoisGet(`category/`, {
        page: page,
        search: query,
      });
      setcategory(response.context?.results);
      setTotalPage(Math.ceil(response.context.count / 2));
      setLoader(true);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(currentPage, inputValue);
  }, [currentPage, debouncedSearch]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setCurrentPage(1);
    debouncedSearch(currentPage, value);
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
    <div>
      <div className="text-center fs-3 mt-2" style={{ fontWeight: "bold" }}>
        Category
      </div>
      <div className="mb-4 mt-3">
        {/* <input type="text" /> */}
        <SerachBox
          name="serch"
          value={inputValue}
          onChange={handleInputChange}
          className="form-control"
          placeholder="seacrh here"
        />
      </div>
      <div className="add">
        <p
          className="button"
          style={{ width: "140px" }}
          onClick={() => {
            handleAddServices();
          }}
        >
          Add Category
        </p>
      </div>
      {loader ? (
        <React.Fragment>
          <table style={{ width: "100%", padding: "5px" }}>
            <tbody>
              <tr>
                <th>Id</th>
                <th>Name</th>
              </tr>

              {categorys.map((item: { id: number; name: string }, key) => {
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
          </table>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              className="button"
              onClick={handlePrev}
              disabled={currentPage == 1}
            >
              Prev
            </button>
            <button
              className="button"
              onClick={handleNext}
              disabled={currentPage === totalPage}
            >
              Next
            </button>
          </div>
        </React.Fragment>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "15% auto",
          }}
        >
          {" "}
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default Category;
