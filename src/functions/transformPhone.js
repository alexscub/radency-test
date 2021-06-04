const transformPhone = phone => {
  if (phone.match(/^1\d{10}/)) {
    return '+' + phone;
  }
  if (phone.match(/^\d{10}/)) {
    return '+1' + phone;
  }
  return phone;
};

export default transformPhone;
