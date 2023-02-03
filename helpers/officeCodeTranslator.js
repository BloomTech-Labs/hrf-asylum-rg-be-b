let officeCodeTranslator = (item) => {
  switch (item.asylum_office) {
    case 'ZLA':
      item.asylum_office = 'Los Angeles, CA';
      item.asylum_code = 'ZLA';
      break;
    case 'ZSF':
      item.asylum_office = 'San Francisco, CA';
      item.asylum_code = 'ZSF';
      break;
    case 'ZNY':
      item.asylum_office = 'New York, NY';
      item.asylum_code = 'ZNY';
      break;
    case 'ZHN':
      item.asylum_office = 'Houston, TX';
      item.asylum_code = 'ZHN';
      break;
    case 'ZCH':
      item.asylum_office = 'Chicago, IL';
      item.asylum_code = 'ZCH';
      break;
    case 'ZNK':
      item.asylum_office = 'Newark, NJ';
      item.asylum_code = 'ZNK';
      break;
    case 'ZAR':
      item.asylum_office = 'Arlington, VA';
      item.asylum_code = 'ZAR';
      break;
    case 'ZBO':
      item.asylum_office = 'Boston, MA';
      item.asylum_code = 'ZBO';
      break;
    case 'ZMI':
      item.asylum_office = 'Miami, FL';
      item.asylum_code = 'ZMI';
      break;
    case 'ZOL':
      item.asylum_office = 'New Orleans, LA';
      item.asylum_code = 'ZOL';
      break;
    default:
  }
  return item;
};

module.exports = { officeCodeTranslator };
