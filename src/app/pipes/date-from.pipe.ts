import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFrom'
})
export class DateFromPipe implements PipeTransform {

  today = new Date().getDate();

  transform(value: unknown, ...args: string[]): unknown {
    return this.fromNow(args[0]);
  }

  // getDateFrom(date: string) {
  //   const newDate = new Date(date).getDate();
  //   if (newDate === this.today) {
  //     return new Date(date).toLocaleTimeString()
  //   } else if (newDate === (this.today + 1)) {

  //   }
  // }

  fromNow(date: string) {
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;
    const units = [
        { max: 30 * SECOND, divisor: 1, past1: 'just now', pastN: 'just now', future1: 'just now', futureN: 'just now' },
        { max: MINUTE, divisor: SECOND, past1: 'a second ago', pastN: '# seconds ago', future1: 'in a second', futureN: 'in # seconds' },
        { max: HOUR, divisor: MINUTE, past1: 'a min ago', pastN: '# mins ago', future1: 'in a min', futureN: 'in # mins' },
        { max: DAY, divisor: HOUR, past1: 'an hr ago', pastN: '# hrs ago', future1: 'in an hr', futureN: 'in # hrs' },
        { max: WEEK, divisor: DAY, past1: 'yesterday', pastN: '# days ago', future1: 'tomorrow', futureN: 'in # days' },
        { max: 4 * WEEK, divisor: WEEK, past1: 'last week', pastN: '# weeks ago', future1: 'in a week', futureN: 'in # weeks' },
        { max: YEAR, divisor: MONTH, past1: 'last month', pastN: '# months ago', future1: 'in a month', futureN: 'in # months' },
        { max: 100 * YEAR, divisor: YEAR, past1: 'last year', pastN: '# years ago', future1: 'in a year', futureN: 'in # years' },
        // eslint-disable-next-line max-len
        { max: 1000 * YEAR, divisor: 100 * YEAR, past1: 'last century', pastN: '# centuries ', future1: 'in a century', futureN: 'in # centuries' },
        // eslint-disable-next-line max-len
        { max: Infinity, divisor: 1000 * YEAR, past1: 'last millennium', pastN: '# millennia ', future1: 'in a millennium', futureN: 'in # millennia' },
    ];
    const diff = Date.now() - (new Date(parseInt(date, 10)).getTime());
    const diffAbs = Math.abs(diff);
    for (const unit of units) {

      // console.log(diff, unit.max, new Date('1629361010570'))
        if (diffAbs < unit.max) {
            const isFuture = diff < 0;
            const x = Math.round(Math.abs(diff) / unit.divisor);
            if (x <= 1) {return isFuture ? unit.future1 : unit.past1;}
            return (isFuture ? unit.futureN : unit.pastN).replace('#', x.toString());
        }
    }
  };

}
