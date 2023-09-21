import { AppBar, Toolbar, IconButton, Grid } from "@mui/material";
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
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <img src={gslogo} alt="AlertWave Icon" />
          </Grid>
          <Grid item>
            <IconButton
              color="inherit"
              aria-label="Sign Out"
              onClick={handleSignOut}
            >
              <ExitToAppIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
