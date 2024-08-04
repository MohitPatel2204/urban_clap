import React, { useState } from "react";

import { debounce } from "lodash";
import { getData } from "../../services/axiosrequests";

export default function Searching() {
  const [inputValue, setInputValue] = useState("");

  const debouncedSearch = debounce(async (searchTerm) => {
    if (searchTerm.trim() != "") {
      let storedata = JSON.parse(localStorage.getItem("creads"));
      const response = await getData(
        `${
          import.meta.env.VITE_API_URL
        }service-searching/?service=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${storedata.access}` },
        }
      );
      console.log(response);
    }
  }, 2000);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    debouncedSearch(event.target.value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
    </div>
  );
}
