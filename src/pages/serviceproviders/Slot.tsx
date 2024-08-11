import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { debounce } from "lodash";
import userT from "../../types/userT";
import { toast } from "react-toastify";
import SerachBox from "../../components/common/FormController/SerachBox";
import Toast from "../../components/common/Toast";
import useAxois from "../../hooks/axois";

interface slotT {
  id: number;
  slot: string;
  user?: userT;
}

const Slot = () => {
  let [slot, setSlot] = useState<Array<slotT>>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const navigate = useNavigate();
  const { axiosDelete, axoisGet } = useAxois();

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
            await axiosDelete(`slot/${id}/`);
            toast.success("Slot deleted successfully");
          } catch (err) {
            toast.error((err as Error).message);
          }
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
      const response = await axoisGet(`slot/`, {
        page,
        search: query,
      });
      setSlot(response.context?.results);
      setTotalPage(Math.ceil(response.context.count / 2));
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
        <SerachBox
          name="serachbox"
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
      <Toast />
    </div>
  );
};

export default Slot;
