import axios from "axios";

const SERVER_URL: string = "http://localhost:8000";
const API_URL = axios.create({ baseURL: SERVER_URL });

export default API_URL;
