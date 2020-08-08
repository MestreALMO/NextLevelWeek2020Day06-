import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import PageHeader from '../../components/PageHeader';

import styles from './styles';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const [ subject, setSubject ] = useState('');
    const [ week_day, setWeekDay ] = useState('');
    const [ time, setTime ] = useState('');

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersId = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                })

                setFavorites(favoritedTeachersId);
            }
        })
    }

    useFocusEffect(() => {
        loadFavorites();
    });

    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }

    async function handleFiltersSubmit() {
        loadFavorites();

        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time,
            }
        });

        setIsFiltersVisible(false);
        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader 
                title="Teachers availables" 
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name='filter' size={20} color='#fff' />
                    </BorderlessButton>
                )}
            >
                { isFiltersVisible && ( 
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Subject</Text>
                        <TextInput 
                            style={styles.input}
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            placeholder="What subject?"
                            placeholderTextColor="#c1bccc"
                        />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Week day</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)}
                                    placeholder="What day?"
                                    placeholderTextColor="#c1bccc"
                                />
                            </View>
                            
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Time</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    placeholder="What time?"
                                    placeholderTextColor="#c1bccc"
                                />
                            </View>
                        </View>

                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filter</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView
                style={styles.TeacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    )
                })}
            </ScrollView>
        </View>
    );
}

export default TeacherList;