import {getCountry} from '@helpers/country';

export const validateEmail = email => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    ? true
    : false;
};
export const validatePassword = password => {
  return password.length > 5 ? true : false;
};

export const validatePhone = phone => {
  return phone.length < 10 ? false : true;
};

export const validateMobile = async number => {
  let country = await getCountry();
  let country_id = country?.country_id;
  if (country_id === 'IN') {
    return /^\d{10}$/.test(number) ? true : false;
  } else {
    return /^(\+\d{1,3}[- ]?)?\d{6,}$/.test(number) ? true : false;
  }
};

export const validateMobileWithCountry = async (number, country) => {
  if (country === 'IN') {
    return /^\d{10}$/.test(number) ? true : false;
  } else {
    return /^(\+\d{1,3}[- ]?)?\d{6,}$/.test(number) ? true : false;
  }
};

export const validateOTP = otp => {
  return /^\d{6}$/.test(otp) ? true : false;
};

export const validateName = name => {
  name = name.trim();
  return /^[a-zA-Z ]*$/.test(name) ? true : false;
};

export const validatePincode = (pincode, regex) => {
  regex = regex.substring(1, regex.length - 1);
  const re = new RegExp(regex);
  return re.test(pincode) ? true : false;
};
