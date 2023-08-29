import Contact from '../service/schemas/contacts.js';

// pobranie aktualnej listy kontaktów
export const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    console.log('error - db full contact list', error);
    throw error;
  }
};

// pobranie kontaktu - wg podanego contactId
export const getContactById = async contactId => {
  try {
    return await Contact.findOne({ _id: contactId });
  } catch (error) {
    console.log('error - db contact by id', error);
    throw error;
  }
};

// usuwanie kontaktu - wg podanego contactId
export const removeContact = async contactId => {
  try {
    return await Contact.findByIdAndRemove({ _id: contactId });
  } catch (error) {
    console.log('error - remove from db contact by id', error);
    throw error;
  }
};

// dodawanie kontaktu - nadanie  id (przyjmuje name, email, phone)
export const addContact = async body => {
  try {
    return await Contact.create(body);
  } catch (error) {
    console.log('error - db add contact');
    throw error;
  }
};

// aktualizacja kontaktu - zgodnie z id
export const updateContact = async (contactId, body) => {
  try {
    return await Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true });
  } catch (error) {
    console.log('error - db update contact by id');
    throw error;
  }
};

// aktualizacja favorite - zgodnie z id
export const updatedStatusContact = async (contactId, favorite) => {
  try {
    return await Contact.findByIdAndUpdate(
      { _id: contactId },
      { $set: { favorite: favorite } },
      { new: true }
    );
  } catch (error) {
    console.log('error - db update favorite by id');
  }
};
