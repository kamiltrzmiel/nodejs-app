import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';
import { nanoid } from 'nanoid';

const contactPath = path.resolve('models', 'contacts.json');

// pobranie aktualnej listy kontaktów
export const listContacts = async () => {
  const response = await readFile(contactPath);
  return JSON.parse(response);
};

// pobranie kontaktu - wg podanego contactId
export const getContactById = async contactId => {
  const fullList = await listContacts();
  const response = fullList.find(contact => contact.id === contactId);
  return response || null;
};

// usuwanie kontaktu - wg podanego contactId (zwraca pierwsze wystąpienie - findIndex)
export const removeContact = async contactId => {
  const fullList = await listContacts();
  const index = fullList.findIndex(contact => contact.id === contactId);
  const response = index !== -1 ? fullList.splice(index, 1)[0] : null;
  await writeFile(contactPath, JSON.stringify(fullList, null, 2));
  return response;
};

// dodawanie kontaktu - nadanie  id (przyjmuje name, email, phone)
export const addContact = async ({ name, email, phone }) => {
  const fullList = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  fullList.push(newContact);
  await writeFile(contactPath, JSON.stringify(fullList, null, 2));
};

// aktualizacja kontaktu - zgodnie z id (przyjmuje name, email, phone)
export const updateContact = async (id, { name, email, phone }) => {
  const fullList = await listContacts();
  const index = fullList.findIndex(contact => contact.id === id);
  return index === -1
    ? null
    : ((fullList[index] = { id, name, email, phone }),
      await writeFile(contactPath, JSON.stringify(fullList, null, 2)),
      fullList[index]);
};
