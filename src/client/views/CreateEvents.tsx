import React from 'react';

function CreateEvents() {

    return (<>
            <div>
                <h4>Hello Stanky</h4>
            </div>

            <div>
                <form>
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
                        <input name='event-interests'/>
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
