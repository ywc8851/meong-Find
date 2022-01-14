export const $ = selector => document.querySelector(selector);

export const handleSelectOptions = ({ city, district }) => {
  const $citySelect = city;
  const $districtSelect = district;

  let mainOption = $citySelect.options[$citySelect.selectedIndex].innerText;
  const subOptions = {
    seoul: ['강남구', '광진구', '서초구'],
    busan: ['해운대구', '민지구', '시안구'],
  };

  let subOption;
  switch (mainOption) {
    case '서울특별시':
      subOption = subOptions.seoul;
      break;
    case '부산광역시':
      subOption = subOptions.busan;
      break;
  }
  $districtSelect.options.length = 0;

  subOption.forEach(option => {
    const $option = document.createElement('option');
    $option.innerText = option;
    $districtSelect.append($option);
  });

  return mainOption;
};
