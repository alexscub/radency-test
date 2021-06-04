export default {
  name(name) {
    return !!name;
  },
  age(age) {
    if (!age) {
      return false
    }
    return +age >= 21 && Number.isInteger(+age);
  },
  experience(exp, row) {
    if (!exp) {
      return false
    }
    return (
      +exp >= 0 &&
      +exp < +row.find(cell => cell.column.id === 'age').value - 21
    );
  },
  income(num) {
    if (!num) {
      return false
    }
    return +num >= 0 && +num < 1000000;
  },
  number(license) {
    if (!license) {
      return false
    }
    return license && license.toString().length === 6;
  },
  children(hasChildren) {
    return (
      hasChildren === 'TRUE' || hasChildren === 'FALSE' || hasChildren === ''
    );
  },
  phone(phone) {
    if (!phone) {
      return false
    }
    return phone.match(/^\+1\d{10}$|^1\d{10}$|^\d{10}$/);
  },
  expiration(dataStr) {
    if (!dataStr) {
      return false
    }
    return (
      dataStr.match(
        /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$|^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
      ) && Date.parse(dataStr) > Date.now()
    );
  },
  email(emailStr) {
    if (!emailStr) {
      return false
    }
    emailStr = '' + emailStr;
    return emailStr
      .trim()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  },
};;
