import { fetchHtml } from './requests';

export const render = async path => {
  try {
    const { data } = await fetchHtml(path);
    document.open();
    document.write(data);
    document.close();
  } catch (error) {
    console.error(error);
  }
};

export const handleHistory = async event => {
  try {
    await render(event.state ? event.state.path : '/');
  } catch (err) {
    console.error(err);
  }
};

export const moveToPage = async path => {
  history.pushState({ path }, '', path);
  try {
    await render(path);
  } catch (error) {
    console.error(error);
  }
};
