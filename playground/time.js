// var date=new Date();
// var months=['Jan','Feb'];
// console.log(date.getMonth()); 

var moment=require('moment');

var date=moment();
// date.add(100,'year').subtract(9,'months'); // add 100 year and minus 9 months
console.log(date.format('MMM Do, YYYY'));

// for time
console.log(date.format('h:mm a'));