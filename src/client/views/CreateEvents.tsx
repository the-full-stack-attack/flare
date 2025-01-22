import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';

function CreateEvents() {

    const [formInfo, setFormInfo] = useState({
        interests: [],
        response: [],
    });
    const [categories, setCategories] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [interests, setInterests] = useState([]);
    const [formData, setFormData] = useState();
    const onSubmit = () => {

    }

    const checkboxHandler = (e) => {
        // setIsChecked(!isChecked);
        const {value, checked} = e.target;
        const {interests} = formInfo;

        console.log(`${value} is ${checked} `);

        if (checked) {
            setFormInfo({
                interests: [...interests, value],
                response: [...interests, value],
            });
        } else {
            setFormInfo({
                interests: interests.filter(
                    (e) => e !== value
                ),
                response: interests.filter(
                    (e) => e !== value
                ),
            });
        }
    }

    const getInterests = async () => {
        try {
            const allInterests = await axios.get('/signup/interests')
            // console.log('allInterests: ', allInterests);
            setInterests(allInterests.data);
        } catch (error) {
            console.error('Error getting interests from DB', error);
        }
    }

    const getCategories = async () => {
        try {
            const allCategories = await axios.get('/event/categories');
            console.log('This is what we got: ', allCategories);

            setCategories(allCategories.data);
            console.log('This my mf state: ', allCategories.data);
        } catch (error) {
            console.error('Error getting categories from DB', error);
        }
    };

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        getInterests();
        // noinspection JSIgnoredPromiseFromCall
        getCategories();
    }, [])
    return (<>


            <div>
                <h4>Hello Stanky</h4>
            </div>


            <div>
                <form onSubmit={onSubmit} className='max-w-sm mx-auto'>
                    <div className='mb-5'>


                        <label>Title
                            <input name='event-title'
                                   className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>
                        <label>Description
                            <input name='event-description'
                                   className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>

                        <label>Start Date
                            <input
                                type='date'
                                name='event-start-date'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>
                        <label>End Date
                            <input
                                type='date'
                                name='event-end-date'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>

                        <label>Start Time
                            <input
                                type='time'
                                name='event-start-time'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>

                        <label>End Time
                            <input
                                type='time'
                                name='event-end-time'
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>

                        <label>Event Category
                            <input name='event-category'
                                   className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>

                        <label>Venue
                            <input name='event-venue'
                                   className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                        </label>


                        <div>

                            {categories.map((category, index) => (
                                <div
                                    key={index}>
                                    {category.name}
                                </div>
                            ))}

                        </div>

                        <div>

                            {interests.map((interest, index) => (
                                <div
                                    key={index}
                                > {interest}
                                    <input
                                        className='form-check-input'
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
