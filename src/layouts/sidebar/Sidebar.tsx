import "./sidebar.css";
import Sidebarnavlist from "../../components/sidebar/Sidebarnavlist";

interface navT {
  link: string;
  name: string;
  icon_classes: string;
}

const Sidebar = () => {
  let setNavList: navT[] = [];
  const user = JSON.parse(localStorage.getItem("creads") || "''");
  if (user.is_superuser) {
    setNavList = [
      {
        link: "/dashboard",
        name: "Dashboard",
        icon_classes: "bi bi-speedometer2 fs-5 text-warning",
      },
      {
        link: "/serviceproviders",
        name: "Service Providers",
        icon_classes: "bi bi-people-fill fs-5 text-warning",
      },
      {
        link: "/customers",
        name: "Customers",
        icon_classes: "bi bi-people-fill fs-5 text-warning",
      },
      {
        link: "/reports",
        name: "Reports",
        icon_classes: "bi bi-hourglass-bottom fs-5 text-warning",
      },
      {
        link: "/category",
        name: "Cetegory",
        icon_classes: "bi bi-diagram-3-fill fs-5 text-warning",
      },
      {
        link: "/all-services",
        name: "Show Services",
        icon_classes: "bi bi-gear-wide-connected fs-5 text-warning",
      },
      {
        link: "/status",
        name: "Apoointment Status",
        icon_classes: "bi bi-clock-history fs-5 text-warning",
      },
    ];
  } else if (user.is_staff) {
    setNavList = [
      {
        link: "/dashboard",
        name: "Dashboard",
        icon_classes: "bi bi-speedometer2 fs-5 text-warning",
      },
      {
        link: "/services",
        name: "Services",
        icon_classes: "bi bi-gear-wide-connected fs-5 text-warning",
      },
      {
        link: "/category",
        name: "Category",
        icon_classes: "bi bi-diagram-3-fill fs-5 text-warning",
      },
      {
        link: "/appointment",
        name: "Appointment",
        icon_classes: "bi bi-calendar-event-fill fs-5 text-warning",
      },
      {
        link: "/slot",
        name: "Slot",
        icon_classes: "bi bi-clock-fill fs-5 text-warning",
      },
    ];
  } else {
    setNavList = [
      {
        link: "/all-services",
        name: "Show Services",
        icon_classes: "bi bi-gear-wide-connected fs-5 text-warning",
      },
      {
        link: "/status",
        name: "Apoointment Status",
        icon_classes: "bi bi-clock-history fs-5 text-warning",
      },
    ];
  }
  return (
    <div className=" main-sidebar border-end bg-dark p-1 ">
      <div className="border-bottom">
        <div className="div d-flex flex-column">
          <div className="div text-center">
            <img
              src={"./assets/images/logo1.png"}
              alt="Company Logo"
              className=""
              style={{ height: "150px", width: "150px" }}
            />
          </div>

          <span className="text-white fw-bolder text-center ">Urban Clap</span>
        </div>
      </div>
      <div className="mt-4 item-container p-2 d-flex flex-column gap-3">
        {setNavList.map((item, flag) => (
          <Sidebarnavlist key={flag} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
