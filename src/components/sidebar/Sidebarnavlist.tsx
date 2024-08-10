import { Link } from "react-router-dom";
interface menuT {
  link: string;
  name: string;
  icon_classes?: string;
}
const Sidebarnavlist = (props: { item: menuT }) => {
  return (
    <div className="div d-flex gap-5 p-2">
      <i className={props.item?.icon_classes}></i>
      <Link
        to={props.item.link}
        className="mt-1 text-white link-offset-2 link-underline link-underline-opacity-0"
      >
        {props.item.name}
      </Link>
    </div>
  );
};

export default Sidebarnavlist;
