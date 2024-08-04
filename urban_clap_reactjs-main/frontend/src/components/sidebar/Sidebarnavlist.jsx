import React from "react";
import { Link } from "react-router-dom";

const Sidebarnavlist = ({ item }) => {
  return (
    <div className="div d-flex gap-5 p-2">
      <i className={item.icon_classes}></i>
      <Link
        to={item.link}
        className="mt-1 text-white link-offset-2 link-underline link-underline-opacity-0"
      >
        {item.name}
      </Link>
    </div>
  );
};

export default Sidebarnavlist;
