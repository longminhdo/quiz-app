import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';

interface Props {
  query: any;
  reset?: boolean;
}

function useUpdateUrlQuery() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tmp = Array.from(searchParams.entries());
  const currentParams: any = {};

  tmp.forEach((el) => {
    if (!currentParams[el[0]]) {
      currentParams[el[0]] = el[1];
    } else if (typeof currentParams[el[0]] === 'string') {
      currentParams[el[0]] = [currentParams[el[0]], el[1]];
    } else {
      currentParams[el[0]] = [...currentParams[el[0]], el[1]];
    }
  });

  const updateQuery = ({ query, reset = false }: Props) => {
    let newQuery = {};

    if (reset) {
      newQuery = {
        ...query,
      };
    } else {
      newQuery = {
        ...currentParams,
        ...query,
      };
    }

    Object.keys(newQuery).forEach((key) => {
      if (!newQuery[key]) {
        delete newQuery[key];
      }
    });
    navigate(
      {
        search: createSearchParams(newQuery).toString(),
      },
      { replace: true },
    );
  };

  return { updateQuery, currentParams };
}

export default useUpdateUrlQuery;
