import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const useRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  return {
    navigate,
    location,
    params,
    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search)),
    currentRoute: location.pathname,
    asPath: location.pathname + location.search,
  };
};
