import * as actionTypes from './../actions/actionTypes';

const initialState = () => {
    return {
        activities: []
    }
}

const reducer = (state = initialState() , action) => {
    switch(action.type){
        case actionTypes.ADD_ACTIVITY:            
            const newActivities = [action.activity, ...state.activities];            
            return {...state, activities:newActivities};
        case actionTypes.LOAD_ACTIVITIES_DATA:            
            const newActivitiesData = [...action.activities];                        
            return {...state, activities:newActivitiesData};
        default:
            return {...state};
    }
}

export default reducer;