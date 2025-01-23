import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';

type EventData = {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    venue: string;
    interests: string[];
    category: string;
}



function CreateEvents() {
    const [formInfo, setFormInfo] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        venue: '',
        interests: [],
        category: '',
    });
    const [categories, setCategories] = useState([]);
    const [interests, setInterests] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('this is formdata', formInfo);
            await axios.post('/api/event', formInfo);
        } catch (error) {
            console.error('Error creating event', error);
        }
    }


    const checkboxHandler = (e) => {
        const {value, checked} = e.target;
        const {interests} = formInfo;
        const {category} = formInfo;

        // Check if data attribute is interest or categories
        if (e.target.dataset.id === 'interest') {
            // When user first clicks checkbox
            if (checked) {
                // Update State
                setFormInfo(prevState => ({
                    ...prevState,
                    interests: [...interests, value],
                    interestsRes: [...interests, value],
                }));

                // If checkbox is not active (user deselects)
            } else {
                // Update State - remove unchecked interest
                setFormInfo(prevState => ({
                    ...prevState,
                    interests: interests.filter(
                        (e) => e !== value
                    ),
                    interestsRes: interests.filter(
                        (e) => e !== value
                    ),
                }));
            }

            // Same logic applies for when data attribute is 'category'
        } else if (e.target.dataset.id === 'category') {
            if (checked) {
                setFormInfo(prevState => ({
                    ...prevState,
                    category: [...category, value],
                    categoryRes: [...category, value],
                }));
            } else {
                setFormInfo(prevState => ({
                    ...prevState,
                    category: category.filter(
                        (e) => e !== value
                    ),
                    categoryRes: category.filter(
                        (e) => e !== value
                    ),
                }));
            }
        }
    };


    const getInterests = async () => {
        try {
            const allInterests = await axios.get('/api/signup/interests')
            setInterests(allInterests.data);
        } catch (error) {
            console.error('Error getting interests from DB', error);
        }
    }

    const getCategories = async () => {
        try {
            const allCategories = await axios.get('/api/event/categories');
            setCategories(allCategories.data);
        } catch (error) {
            console.error('Error getting categories from DB', error);
        }
    };

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        getInterests();
        // noinspection JSIgnoredPromiseFromCall
        getCategories();

        console.log(`
        Form Info: \n 
        Title = ${formInfo.title} \n
        Description = ${formInfo.description} \n
        Start Time = ${formInfo.startTime} \n
        End Time = ${formInfo.endTime} \n
        Start Date = ${formInfo.startDate} \n
        End Date = ${formInfo.endDate} \n
        Venue = ${formInfo.venue} \n
        Interests = ${formInfo.interestsRes} \n 
        Category = ${formInfo.categoryRes}
        `);

    }, [formInfo])
    return (<>


            <div>
                <h4>Hello Stanky</h4>
            </div>


            <div>
                <form onSubmit={onSubmit} className='max-w-sm mx-auto'>
                    <div className='mb-5'>


                        <label>Title
                            <input name='title'
                                   value={formInfo.title}
                                   onChange={handleChange}
                                   className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>
                        <label>Description
                            <input name='description'
                                   value={formInfo.description}
                                   onChange={handleChange}
                                   className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>

                        <label>Start Date
                            <input
                                name='startDate'
                                value={formInfo.startDate}
                                onChange={handleChange}
                                type='date'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>
                        <label>End Date
                            <input
                                name='endDate'
                                value={formInfo.endDate}
                                onChange={handleChange}
                                type='date'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>
                        <label>Start Time
                            <input
                                name='startTime'
                                value={formInfo.startTime}
                                onChange={handleChange}
                                type='time'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>
                        <label>End Time
                            <input
                                name='endTime'
                                value={formInfo.endTime}
                                onChange={handleChange}
                                type='time'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>
                        <label>Event Category
                            <input
                                name='event-category'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>
                        <label>Venue
                            <input
                                name='venue'
                                value={formInfo.venue}
                                onChange={handleChange}
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>
                        <div>
                            {categories.map((category) => (
                                <div
                                    key={category.id}>
                                    {category.name}
                                    <input
                                        className='form-check-input'
                                        data-id='category'
                                        type='checkbox'
                                        name={category.name}
                                        value={category.name}
                                        onChange={checkboxHandler}
                                    >
                                    </input>
                                </div>
                            ))}
                        </div>
                        <div>-----(=^‥^)-----</div>
                        <div>
                            {interests.map((interest, index) => (
                                <div
                                    key={index}
                                > {interest}
                                    <input
                                        className='form-check-input'
                                        data-id='interest'
                                        type='checkbox'
                                        name={interest}
                                        value={interest}
                                        onChange={checkboxHandler}
                                    >
                                    </input>
                                </div>
                            ))}
                        </div>
                    </div>


                    <button type='submit'
                            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Submit
                    </button>
                </form>
            </div>


        </>
    )
};

export default CreateEvents;
