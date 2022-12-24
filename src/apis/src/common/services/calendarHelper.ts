import moment from "moment";
import { googleCalenderHelper } from "./googleCalendar";
import { outlookCalendarHelper } from "./outlookCalendar";

class CalendarHelper {
  constructor() {}

  // const calendar : any = {
  //     timeZone : slot.slotTimeZone,
  //     description: data.description,
  //     duration: data.engagementDuration,
  //     start: data.engagementDateTime,
  //     recurrence: false,
  //     user : slot.User,
  //     attendees : [data.customer.email ,slot.User.email],
  //     // summary,
  //     // location
  //   }

  async createCalendarEvent(data: any) {


    if (data.user && data.user?.refreshToken) {
      let user = data.user;

      if (user.googleId) {
        /**
         *  Add google calender
         */

        const createEvent : any = await googleCalenderHelper.addEvent(
          user.refreshToken,
          data
        );

        return{ ...createEvent.data, provider: 'google'}
      } else if (user.outlookId) {
        /**
         *  Add outlook Calender
         */

        const createEvent : any= await outlookCalendarHelper.createEvent(
          user.refreshToken,
          data
        );
        return {...createEvent , provider:'outlook'}
      }
    }
    return null
  }

  async updateCalendarEvent(data: any) {


    if (data.user && data.user?.refreshToken) {
      let user = data.user;

      if (user.googleId) {
        /**
         *  Add google calender
         */

        const updateEvent : any = await googleCalenderHelper.updateEvent(
          user.refreshToken, data.calendarEventId,
          data
        );

        return{ ...updateEvent.data, provider: 'google'}
      } else if (user.outlookId) {
        /**
         *  Add outlook Calender
         */

        const updateEvent : any= await outlookCalendarHelper.updateEvent(
          user.refreshToken, data.calendarEventId,
          data
        );
        return {...updateEvent , provider:'outlook'}
      }
    }
    return null
  }
}

export const calendarHelper = new CalendarHelper();
