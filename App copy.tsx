// App.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, TextInput } from 'react-native';

import { RealmContext, Task } from './models/Task';

const { useQuery, useRealm } = RealmContext;

function App(): JSX.Element {
  const realm = useRealm();
  const tasks = useQuery(Task);
  const [updatedTask, setUpdatedTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const addTask = useCallback(() => {
    realm.write(() => {
      realm.create('Task', {
        _id: new Realm.BSON.ObjectId(),
        title: newTaskTitle || 'New Task',
        description: newTaskDescription || 'Sync',
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
    });
  }, [realm, newTaskTitle, newTaskDescription]);

  const deleteTask = useCallback((taskId: Realm.BSON.ObjectId) => {
    realm.write(() => {
      const taskToDelete = realm.objectForPrimaryKey(Task, taskId);
      if (taskToDelete) {
        realm.delete(taskToDelete);
      }
    });
  }, [realm]);

  const updateTask = useCallback(() => {
    if (updatedTask) {
      realm.write(() => {
        const taskToUpdate = realm.objectForPrimaryKey(Task, updatedTask._id);
        if (taskToUpdate) {
          taskToUpdate.title = updatedTask.title;
          taskToUpdate.description = updatedTask.description;
        }
      });
      setUpdatedTask(null);
    }
  }, [realm, updatedTask]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Task));
    });
  }, [realm]);

  return (
    <View style={{ flex: 1 }}>
      <Text>User</Text>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>{`${item.title} - ${item.description}`}</Text>
            <TouchableOpacity onPress={() => deleteTask(item._id)}>
              <Text style={{ color: 'red' }}>{'Delete'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUpdatedTask(item)}>
              <Text style={{ color: 'blue' }}>{'Update'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {updatedTask && (
        <View>
          <TextInput
            placeholder="New Title"
            value={updatedTask.title}
            onChangeText={(text) => setUpdatedTask({ ...updatedTask, title: text, _id: updatedTask._id })}
          />
          <TextInput
            placeholder="New Description"
            value={updatedTask.description}
            onChangeText={(text) => setUpdatedTask({ ...updatedTask, description: text, _id: updatedTask._id })}
          />
          <TouchableOpacity style={{ backgroundColor: 'green' }} onPress={updateTask}>
            <Text>{'Update Task'}</Text>
          </TouchableOpacity>
        </View>
      )}
      <View>
        <TextInput
          placeholder="New Task Title"
          value={newTaskTitle}
          onChangeText={(text) => setNewTaskTitle(text)}
        />
        <TextInput
          placeholder="New Task Description"
          value={newTaskDescription}
          onChangeText={(text) => setNewTaskDescription(text)}
        />
        <TouchableOpacity style={{ backgroundColor: 'yellow' }} onPress={addTask}>
          <Text>{'New Task'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default App;

// App.tsx
// import React, { useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
// import Modal from 'react-native-modal';

// const ContactsScreen = () => {
//   const [contacts, setContacts] = useState([
//     { id: '1', name: 'John Doe', phoneNumber: '123-456-7890' },
//     { id: '2', name: 'Jane Doe', phoneNumber: '987-654-3210' },
//   ]);

//   const [selectedContact, setSelectedContact] = useState(null);
//   const [isAddModalVisible, setIsAddModalVisible] = useState(false);
//   const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
//   const [updatedName, setUpdatedName] = useState('');
//   const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState('');
//   const [newContactName, setNewContactName] = useState('');
//   const [newContactPhoneNumber, setNewContactPhoneNumber] = useState('');

//   const handleContactPress = (contact) => {
//     setSelectedContact(contact);
//     setUpdatedName(contact.name);
//     setUpdatedPhoneNumber(contact.phoneNumber);
//     setIsUpdateModalVisible(true);
//   };

//   const handleDeleteContact = () => {
//     if (selectedContact) {
//       const updatedContacts = contacts.filter((contact) => contact.id !== selectedContact.id);
//       setContacts(updatedContacts);
//       setSelectedContact(null);
//     }
//   };

//   const handleUpdateContact = () => {
//     setIsUpdateModalVisible(true);
//   };

//   const handleAddContact = () => {
//     setIsAddModalVisible(true);
//   };

//   const handleSaveUpdate = () => {
//     if (selectedContact) {
//       const updatedContacts = contacts.map((contact) =>
//         contact.id === selectedContact.id
//           ? { ...contact, name: updatedName, phoneNumber: updatedPhoneNumber }
//           : contact
//       );
//       setContacts(updatedContacts);
//       setSelectedContact(null);
//       setIsUpdateModalVisible(false);
//     }
//   };

//   const handleSaveAdd = () => {
//     const newContact = {
//       id: String(contacts.length + 1),
//       name: newContactName,
//       phoneNumber: newContactPhoneNumber,
//     };
//     setContacts([...contacts, newContact]);
//     setIsAddModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Contacts</Text>
//       <FlatList
//         data={contacts}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.contactItem}>
//             <TouchableOpacity onPress={() => handleContactPress(item)}>
//               <Text style={styles.contactName}>{item.name}</Text>
//             </TouchableOpacity>
//             <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
//           </View>
//         )}
//       />
//       {selectedContact && (
//         <View style={styles.selectedContact}>
//           <Text style={styles.selectedContactText}>
//             Selected Contact: {selectedContact.name} - {selectedContact.phoneNumber}
//           </Text>
//         </View>
//       )}
//       <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
//         <Text style={styles.buttonText}>Add</Text>
//       </TouchableOpacity>

//       <Modal isVisible={isAddModalVisible} onBackdropPress={() => setIsAddModalVisible(false)}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>Add Contact</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Name"
//             value={newContactName}
//             onChangeText={(text) => setNewContactName(text)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             value={newContactPhoneNumber}
//             onChangeText={(text) => setNewContactPhoneNumber(text)}
//           />
//           <TouchableOpacity style={styles.saveButton} onPress={handleSaveAdd}>
//             <Text style={styles.buttonText}>Save</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       {/* Update Contact Modal */}
//       <Modal isVisible={isUpdateModalVisible} onBackdropPress={() => setIsUpdateModalVisible(false)}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>Update Contact</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Name"
//             value={updatedName}
//             onChangeText={(text) => setUpdatedName(text)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             value={updatedPhoneNumber}
//             onChangeText={(text) => setUpdatedPhoneNumber(text)}
//           />
//           <TouchableOpacity style={styles.saveButton} onPress={handleSaveUpdate}>
//             <Text style={styles.buttonText}>Save</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button} onPress={handleDeleteContact}>
//             <Text style={styles.buttonText}>Delete</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   contactItem: {
//     marginBottom: 16,
//   },
//   contactName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'blue',
//   },
//   phoneNumber: {
//     fontSize: 16,
//     color: 'gray',
//   },
//   selectedContact: {
//     marginTop: 16,
//     padding: 8,
//     backgroundColor: 'lightgray',
//   },
//   selectedContactText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   button: {
//     backgroundColor: 'red',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 5,
//     alignItems: 'center',
//   },
//   addButton: {
//     backgroundColor: 'green',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   modalContainer: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 10,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 5,
//     marginBottom: 10,
//     padding: 8,
//   },
//   saveButton: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
// });

// export default ContactsScreen;
