const BASE_URL = import.meta.env.API_BACKEND;

if (!BASE_URL) {
  throw new Error("La variable de entorno API_BACKEND no está definida.");
}
console.log("LA URL ES: ",BASE_URL)
export default BASE_URL;