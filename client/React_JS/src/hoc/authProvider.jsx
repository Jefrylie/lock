import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";
import Loading from "../components/Loading";
import { theme } from "@chakra-ui/react";
export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      if (token) {
        const auth = await api()
          .post("/user/token", { token })
          .then((res) => res.data.user);
        if (auth) {
          console.log(auth);
          dispatch({
            type: "login",
            payload: auth,
          });
          const auth2 = await api()
            .post("/user/tokenup", { token })
            .then((res) => res.data.user);
        } else {
          dispatch({
            type: "logout",
          });
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  return (
    <>
      <>{isLoading ? <Loading /> : children}</>
    </>
  );
}
