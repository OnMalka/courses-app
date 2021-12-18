export const getDayStringFromInt = (int) => {
    switch(int){
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuseday';
        case 3:
            return 'wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        case 6:
            return 'Saturday';
        default:
            return null;
    };
};

export const getScheduledDatesForCourse = (start, end, daysOfTheWeek) => {
    const endDate = new Date(end);
    const result = [];
    // console.log('start: ', startDate);
    // console.log('end: ', endDate);
    // console.log('days: ', daysOfTheWeek);    
    for(let currentDate = new Date(start); currentDate<=endDate; currentDate.setDate(currentDate.getDate() + 1)){
        // console.log('current: ', currentDate);
        if(daysOfTheWeek.includes(currentDate.getDay())){
            // console.log('pushing current date');
            result.push(new Date(currentDate));
        };
    };
    return result;
};