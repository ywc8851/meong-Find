import { fetchHtml } from './requests';

export const createDocument = html => {
  document.open();
  document.write(html);
  document.close();
};

export const render = async path => {
  try {
    const { data } = await fetchHtml(path);
    createDocument(data);
  } catch (error) {
    history.back();
    console.error(error);
  }
};

export const handleHistory = async event => {
  try {
    await render(event?.state?.path || '/');
  } catch (err) {
    console.error(err);
  }
};

export const moveToPage = async path => {
  history.pushState({ path, prev: location.href }, '', path);
  try {
    await render(path);
  } catch (error) {
    console.error(error);
  }
};
