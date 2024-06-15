import axios from "axios";

axios.defaults.baseURL = "https://ramp.up.railway.app/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
