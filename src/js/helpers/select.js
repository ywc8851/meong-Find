const options = {
  서울특별시: ['강남구', '광진구', '서초구'],
  부산광역시: ['해운대구', '민지구', '시안구'],
};

export const handleSelectOptions = ({ $city, $district }) => {
  const city = $city.options[$city.selectedIndex].textContent;
  $district.innerHTML = `<option selected disabled>구</option>${options[city]
    .map(district => `<option>${district}</option>`)
    .join()}`;
};
