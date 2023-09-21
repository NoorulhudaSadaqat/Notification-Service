import { AppBar, Toolbar, IconButton } from "@mui/material";
import gslogo from "../../../assets/gslogo-white.svg";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import styles from "./topbar.module.css";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      className={styles.topBar}
      sx={{ backgroundColor: "#007fff" }}
    >
      <Toolbar>
        <div style={{ flexGrow: 1 }}>
          <img src={gslogo} alt="AlertWave Icon" />
        </div>
        <IconButton
          color="inherit"
          aria-label="Sign Out"
          onClick={handleSignOut}
        >
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
