import schedule from 'node-schedule';

export default class EmailScheduler {
  constructor(date:Date,x:any) {
    
    date.setTime(date.getTime() + 1000 * 60);
    schedule.scheduleJob(date, function(y:string) {
      console.log("tada!");
    }.bind(null, x));
    console.log(x)
  }
}

