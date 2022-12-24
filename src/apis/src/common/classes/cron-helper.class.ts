import cron from "node-cron";
import EmailScheduler from './scheduler.hepler.class'
import EngagementDao from '../../daos/engagement.dao'
import {CRON_EXP,SCHEDULER_TIME} from "../config/constant"


export default class CronHelper {
    constructor() {
      let dateNow = new Date()
      let endDate = new Date(dateNow.getTime() + SCHEDULER_TIME);
      console.log("-------------------------------------start, end",dateNow,endDate)
      cron.schedule( CRON_EXP, async () => {
        console.log("running every minute")
        const result = await EngagementDao.getEngagementsByremainderTime({
          startDate: dateNow.toISOString(),
          endDate: endDate,
      });
      console.log("#####result",result)
      let mailParams;
        new EmailScheduler(dateNow,mailParams);
      });
    }
}




