import axios from "axios";

export const api = axios.create({
  baseURL: "https://rocketnotes-api-k91h.onrender.com" // endereço do back-end rodando no computador
});