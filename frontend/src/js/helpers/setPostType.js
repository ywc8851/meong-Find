import { WEBPACK_DEV_SERVER } from '../config';

export const setPostType = () => {
  if (location.href !== `${WEBPACK_DEV_SERVER}/`) return;
  const filterOption = JSON.parse(sessionStorage.getItem('filterOption'));
  if (!filterOption) {
    return { type: 'all', value: null };
  }
  return {
    type: filterOption?.search ? 'search' : 'find',
    value: filterOption,
  };
};
