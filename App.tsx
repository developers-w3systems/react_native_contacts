// App.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import Modal from 'react-native-modal';

import { RealmContext, Task } from './models/Task';

const { useQuery, useRealm } = RealmContext;

function App(): JSX.Element {
  const realm = useRealm();
  const tasks = useQuery(Task);
  const [updatedTask, setUpdatedTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const addTask = useCallback(() => {
    realm.write(() => {
      realm.create('Task', {
        _id: new Realm.BSON.ObjectId(),
        title: newTaskTitle,
        description: newTaskDescription,
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsAddModalVisible(false);
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
      setIsUpdateModalVisible(false);
    }
  }, [realm, updatedTask]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Task));
    });
  }, [realm]);

  const handleAddContact = () => {
    setIsAddModalVisible(true);
  };

  const handleUpdateContact = (task: Task) => {
    setUpdatedTask(task);
    setIsUpdateModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contacts</Text>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <TouchableOpacity onPress={() => handleUpdateContact(item)}>
              <Text style={styles.contactName}>{item.title}</Text>
            </TouchableOpacity>
            <Text style={styles.phoneNumber}>{item.description}</Text>
            <TouchableOpacity onPress={() => deleteTask(item._id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>

      <Modal isVisible={isAddModalVisible} onBackdropPress={() => setIsAddModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newTaskTitle}
            onChangeText={(text) => setNewTaskTitle(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={newTaskDescription}
            onChangeText={(text) => setNewTaskDescription(text)}
          />
          <TouchableOpacity style={styles.saveButton} onPress={addTask}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isUpdateModalVisible} onBackdropPress={() => setIsUpdateModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Update Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={updatedTask?.title}
            onChangeText={(text) => setUpdatedTask((prev) => ({ ...prev, title: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={updatedTask?.description}
            onChangeText={(text) => setUpdatedTask((prev) => ({ ...prev, description: text }))}
          />
          <TouchableOpacity style={styles.saveButton} onPress={updateTask}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setIsUpdateModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contactItem: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phoneNumber: {
    fontSize: 16,
    color: 'gray',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  button: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButton: {
    color: 'red',
    marginTop: 8,
  },
});

export default App;