import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteData, getData } from "../../services/axiosrequests";
import Swal from "sweetalert2";
import { debounce } from "lodash";

interface slotT {
  id: number;
  slot: string;
  user?: any;
}

const Slot = () => {
  let [slot, setSlot] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const navigate = useNavigate();

  const handleUpdate = (data: slotT) => {
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
          slot = slot.filter((service: { id: number }) => {
            return service.id != id;
          });
          setSlot(slot);
          setCurrentPage(1);
          try {
            let storedata = JSON.parse(localStorage.getItem("creads") || "''");
            let config = {
              headers: { Authorization: `Bearer ${storedata.access}` },
            };
            const response = await deleteData(
              `${import.meta.env.VITE_API_URL}slot/${id}/`,
              config
            );
          } catch (err: any) {
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
      let storedata = JSON.parse(localStorage.getItem("creads") || "''");
      const response = await getData(
        `${import.meta.env.VITE_API_URL}slot/?page=${page}&search=${query}`,
        {
          headers: { Authorization: `Bearer ${storedata.access}` },
        }
      );
      setSlot(response.context?.results);
      setTotalPage(Math.ceil(response.context.count / 2));
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(currentPage, inputValue);
  }, [currentPage, debouncedSearch]);

  const handleInputChange = (event: any) => {
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
    <div>
      <div className="text-center fs-3 mt-2" style={{ fontWeight: "bold" }}>
        Slots
      </div>
      <div className="add">
        <p
          className="button"
          style={{ width: "110px" }}
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
          className="form-control"
          placeholder="seacrh here"
        />
      </div>
      <table style={{ width: "100%", padding: "5px", marginLeft: "10%" }}>
        <tbody>
          <tr>
            <th>Id</th>
            <th>Slot</th>
          </tr>

          {slot.map((item: slotT, key) => {
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
    </div>
  );
};

export default Slot;
