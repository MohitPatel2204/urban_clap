import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@mui/material";
import { addUser, updateNotification } from "../../reducer/profile";
import userT from "../../types/userT";
import useAxois from "../../hooks/axois";
import { toast } from "react-toastify";
import Toast from "../../components/common/Toast";

interface settingsT {
  name: string;
  path: string;
}

const settings: settingsT[] = [
  { name: "Profile", path: "/profile" },
  { name: "Logout", path: "/signin" },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<HTMLElement | null>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<HTMLElement | null>(
    null
  );
  const user = useDispatch();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { axoisGet } = useAxois();

  async function fetchMyAPI() {
    try {
      const response = await axoisGet(`updateuser/`);
      const userdata = response.context;
      user(
        addUser({
          ...userdata,
          profile: { profile_photo: userdata.profile[0].profile_photo },
          notification: [],
        })
      );
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  React.useEffect(() => {
    fetchMyAPI();
  }, []);

  const storedata = useSelector(
    (state: { user: { text: userT } }) => state.user
  );

  React.useEffect(() => {
    if (storedata?.text?.pk != undefined) {
      const socket = new WebSocket(
        `ws://127.0.0.1:8000/ws/notifications/${storedata?.text?.pk}/`
      );

      socket.onopen = () => {
        console.log("WebSocket connection established.");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        dispatch(updateNotification(data.message));
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => socket.close();
    }
  }, [storedata?.text?.pk]);

  const handleOpenNavMenu = (event: React.ChangeEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.ChangeEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#212631", zIndex: "1" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            ></Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>

          <Box sx={{ flexGrow: 0 }}>
            <div className="d-flex">
              <MenuItem>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge
                    badgeContent={storedata?.text.notification?.length}
                    color="error"
                  >
                    <i
                      onClick={() => {
                        navigate("/notification");
                      }}
                      className="bi bi-bell"
                    ></i>
                  </Badge>
                </IconButton>
              </MenuItem>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Remy Sharp"
                    src={storedata?.text.profile?.profile_photo}
                  />
                </IconButton>
              </Tooltip>
            </div>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting: settingsT) => (
                <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                  <Link
                    className="link-offset-2 link-underline link-underline-opacity-0 text-dark"
                    to={setting.path}
                  >
                    {setting.name}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <Toast />
    </AppBar>
  );
}
export default ResponsiveAppBar;
