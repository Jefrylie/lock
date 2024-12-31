import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedPage({
  children,
  redirect = false,
  needLogin = false,
  guestOnly = false,
}) {
  const userSelector = useSelector((state) => state.login.auth); 
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleRedirect = () => {
      if (redirect || (needLogin && !userSelector.id)) {
        return nav("/login"); 
      }
      if (guestOnly && userSelector?.id) {
        return nav("/"); 
      }
    };

    handleRedirect();
    setIsLoading(false);
  }, [redirect, needLogin, guestOnly, userSelector, nav]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>; 
}
