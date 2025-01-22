import React from 'react';

function CreateEvents() {

    return (<>
            <div>
                <h4>Hello Stanky</h4>
            </div>

            <div>
                <form onSubmit={onSubmit}>
                    <label>Title
                        <input name='event-title'/>
                    </label>
                    <label>Description
                        <input name='event-description'/>
                    </label>

                    <label>Start Date
                        <input name='event-start-date'/>
                    </label>
                    <label>End Date
                        <input name='event-end-date'/>
                    </label>

                    <label>Start Time
                        <input name='event-start-time'/>
                    </label>

                    <label>
                        <input name='event-end-time'/>
                    </label>

                    <label>Event Category
                        <input name='event-category'/>
                    </label>

                    <label>Event Interests?
                        <input type='checkbox' value='Interest 1' className='event-interests' />
                        Interest 1
                        <input type='checkbox' value='Interest 2' className='event-interests' />
                        Interest 2
                        <input type='checkbox' value='Interest 3' className='event-interests' />
                        Interest 3
                        <input type='checkbox' value='Interest 4' className='event-interests' />
                        Interest 4
                        <input type='checkbox' value='Interest 5 ERROR' className='event-interests' />
                    </label>

                    <label>Venue
                        <input name='event-venue'/>
                    </label>

                    <button type='submit'>Submit</button>
                </form>
            </div>
        </>
    )
};

export default CreateEvents;
