import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotesApp = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Load notes from AsyncStorage on component mount
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('@notes');
      if (storedNotes !== null) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNote = async () => {
    if (note.trim() !== '') {
      try {
        const newNotes = [...notes, { id: Date.now().toString(), text: note }];
        await AsyncStorage.setItem('@notes', JSON.stringify(newNotes));
        setNotes(newNotes);
        setNote('');
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  };

  const deleteNote = async (id) => {
    try {
      const updatedNotes = notes.filter((note) => note.id !== id);
      await AsyncStorage.setItem('@notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Add a Note:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your note"
        value={note}
        onChangeText={(text) => setNote(text)}
      />
      <Button title="Save Note" onPress={saveNote} />

      <Text style={styles.label1}>Your Notes:</Text>
      
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card_temp}>
          <View style={styles.noteItem}>
            <Text style={styles.text11}>{item.text}</Text>
            <Button style={styles.butt} title="Delete" onPress={() => deleteNote(item.id)} />
          </View>
          </View>
        )}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  butt:{position:'absolute',
    borderRadius:10,
    marginTop:'80',
    color:'black',
  },
  text11:{
color:'white',
marginLeft:20,
marginTop:10,
marginRight:20,
  },
  card_temp:{
    width:250,
    height:250,
    boxshadow:"10px 10px 17px 12px rgba(0,0,0,1)",
    borderColor:'#ffffff',
    backgroundColor:'#6ca5f5',
    borderRadius:10,
 },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    marginTop:111,
  }, 
  label1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    marginTop:11,
  },
  input: {
    height: 211,
    width:311,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default NotesApp;
