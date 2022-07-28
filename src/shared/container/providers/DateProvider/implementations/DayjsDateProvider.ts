import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  dateNow() {
    return dayjs().toDate();
  }
  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  compareInHours(start_date: Date, end_date: Date): number {
    const endDateUtc = this.convertToUTC(end_date);
    const startDateUtc = this.convertToUTC(start_date);

    return dayjs(endDateUtc).diff(dayjs(startDateUtc), "hours");
  }

  compareInDays(start_date: Date, end_date: Date): number {
    const endDateUtc = this.convertToUTC(end_date);
    const startDateUtc = this.convertToUTC(start_date);

    return dayjs(endDateUtc).diff(dayjs(startDateUtc), "days");
  }

  addDays(days: number): Date {
    return dayjs().add(days, "days").toDate();
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, "hours").toDate();
  }

  compareIfBefore(start_date: Date, end_date: Date) {
    return dayjs(start_date).isBefore(end_date);
  }
}

export { DayjsDateProvider };
